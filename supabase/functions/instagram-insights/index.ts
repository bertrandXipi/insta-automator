import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, since, until } = await req.json()

    if (!userId) {
      throw new Error("userId est requis")
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!)

    // 1. Get Instagram credentials from DB
    const { data: account, error: acctError } = await supabase
      .from('instagram_accounts')
      .select('ig_user_id, access_token, token_expires_at')
      .eq('user_id', userId)
      .single()

    if (acctError || !account) {
      throw new Error("Compte Instagram non connecté")
    }

    if (account.token_expires_at && new Date(account.token_expires_at) < new Date()) {
      throw new Error("Token Instagram expiré. Veuillez reconnecter votre compte.")
    }

    const IG_USER_ID = account.ig_user_id
    const ACCESS_TOKEN = account.access_token

    const untilDate = until || daysAgo(1)
    const sinceDate = since || daysAgo(90)

    // 2. Fetch account insights
    const metrics = [
      'impressions',
      'reach',
      'profile_views',
      'website_clicks',
      'follower_count'
    ].join(',')

    const insightsUrl =
      `https://graph.facebook.com/v21.0/${IG_USER_ID}/insights` +
      `?metric=${metrics}` +
      `&period=day` +
      `&since=${sinceDate}&until=${untilDate}` +
      `&access_token=${ACCESS_TOKEN}`

    const insightsRes = await fetch(insightsUrl)
    const insightsData = await insightsRes.json()

    if (insightsData.error) {
      if (insightsData.error.code === 403 || insightsData.error.code === 400) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "insufficient_permissions",
            message: "Permissions insuffisantes pour lire les insights. Reconnectez votre compte Instagram.",
            detail: insightsData.error
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
        )
      }
      throw new Error(`Erreur API Instagram: ${insightsData.error.message}`)
    }

    // Build metric lookup
    const metricsMap: Record<string, { values: { value: number }[] }> = {}
    for (const item of insightsData.data || []) {
      metricsMap[item.name] = item
    }

    const sumValues = (metricName: string): number =>
      (metricsMap[metricName]?.values || []).reduce((s: number, v: any) => s + (v.value || 0), 0)

    const impressions = sumValues('impressions')
    const reach = sumValues('reach')
    const profileViews = sumValues('profile_views')
    const websiteClicks = sumValues('website_clicks')

    const followerValues = metricsMap['follower_count']?.values || []
    const latestFollowers = followerValues.slice(-1)[0]?.value || 0

    function aggregateViews(days: number): { views: number; avgPerDay: number } {
      const allVals = metricsMap['impressions']?.values || []
      const slice = allVals.slice(-days)
      const views = slice.reduce((s: number, v: any) => s + (v.value || 0), 0)
      return { views, avgPerDay: Math.round(views / Math.max(slice.length, 1)) }
    }

    // 3. Fetch recent media for top posts + content distribution
    const mediaUrl =
      `https://graph.facebook.com/v21.0/${IG_USER_ID}/media` +
      `?fields=id,media_type,caption,timestamp,like_count,comments_count` +
      `&since=${sinceDate}&until=${untilDate}` +
      `&limit=25` +
      `&access_token=${ACCESS_TOKEN}`

    const mediaRes = await fetch(mediaUrl)
    const mediaData = await mediaRes.json()

    // Content distribution from media types
    const mediaTypeCount: Record<string, number> = {}
    for (const media of mediaData.data || []) {
      const mt = media.media_type === 'CAROUSEL_ALBUM' ? 'CAROUSEL' : media.media_type
      mediaTypeCount[mt] = (mediaTypeCount[mt] || 0) + 1
    }
    const totalMedia = Object.values(mediaTypeCount).reduce((s, c) => s + c, 0)

    const dist = {
      publications: totalMedia > 0 ? Math.round(((mediaTypeCount['IMAGE'] || 0) + (mediaTypeCount['CAROUSEL'] || 0)) / totalMedia * 1000) / 10 : 0,
      reels: totalMedia > 0 ? Math.round((mediaTypeCount['REEL'] || 0) / totalMedia * 1000) / 10 : 0,
      stories: 0,
      videos: totalMedia > 0 ? Math.round((mediaTypeCount['VIDEO'] || 0) / totalMedia * 1000) / 10 : 0,
    }

    // 4. Fetch insights per post for top 5
    const topPostsPromises = (mediaData.data || []).slice(0, 10).map(async (media: any) => {
      const insightsPerMediaUrl =
        `https://graph.facebook.com/v21.0/${media.id}/insights` +
        `?metric=impressions,reach,engagement` +
        `&access_token=${ACCESS_TOKEN}`

      try {
        const miRes = await fetch(insightsPerMediaUrl)
        const miData = await miRes.json()

        const miMetrics: Record<string, number> = {}
        for (const item of miData.data || []) {
          miMetrics[item.name] = item.values?.[0]?.value || 0
        }

        return {
          date: media.timestamp ? new Date(media.timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '',
          title: (media.caption || '').substring(0, 40) || 'Sans titre',
          views: miMetrics.impressions || 0,
          likes: media.like_count || 0,
          saves: 0,
          interactions: (media.like_count || 0) + (media.comments_count || 0) + (miMetrics.engagement || 0),
        }
      } catch {
        return null
      }
    })

    const allCandidates = (await Promise.all(topPostsPromises)).filter(Boolean)
    const topPosts = allCandidates.sort((a: any, b: any) => b.views - a.views).slice(0, 5)

    const totalInteractions = topPosts.reduce((s: number, p: any) => s + (p.interactions || 0), 0)

    // 5. Build StatsSnapshotData response
    const periodStart = new Date(sinceDate)
    const periodEnd = new Date(untilDate)
    const diffDays = Math.round((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24))

    const monthLabel = periodStart.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

    const statsData = {
      period: monthLabel,
      duration: `${diffDays} jours`,
      followers: latestFollowers,
      visibility: {
        totalViews: impressions,
        uniqueReach: reach,
        followersPercent: reach > 0 ? Math.round((latestFollowers / reach) * 100) : 0,
        nonFollowersPercent: reach > 0 ? Math.round((1 - latestFollowers / reach) * 100) : 0,
      },
      viewsTrend: {
        last30Days: aggregateViews(30),
        last14Days: aggregateViews(14),
        last7Days: aggregateViews(7),
      },
      contentDistribution: dist,
      engagement: {
        totalInteractions,
        fromFollowers: 0,
        last30Days: 0,
      },
      conversion: {
        profileVisits: profileViews,
        linkClicks: websiteClicks,
        addressClicks: 0,
        ctr: profileViews > 0 ? Math.round((websiteClicks / profileViews) * 1000) / 10 : 0,
      },
      topPosts,
      peakHours: [],
      financial: {
        monthlyInvestment: 0,
        cpm: 0,
        potentialROI: '',
      },
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: statsData,
        meta: {
          since: sinceDate,
          until: untilDate,
          daysAnalyzed: diffDays,
          mediaCount: totalMedia,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

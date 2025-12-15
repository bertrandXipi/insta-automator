import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()

    if (!userId) {
      throw new Error("userId est requis")
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!)

    const { data, error } = await supabase
      .from('instagram_accounts')
      .select('ig_username, token_expires_at, ig_user_id')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return new Response(
        JSON.stringify({ 
          connected: false 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Vérifier si le token est expiré
    const isExpired = data.token_expires_at && new Date(data.token_expires_at) < new Date()

    return new Response(
      JSON.stringify({ 
        connected: !isExpired,
        username: data.ig_username,
        expiresAt: data.token_expires_at,
        isExpired
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

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Types
interface Post {
  id: string;
  date: string;
  caption: string;
  imageUrl: string;
  published: boolean;
  isClientManaged?: boolean;
  hashtags: string[];
  cta: string;
}

interface ScheduledPublishRequest {
  targetDate?: string; // Format "DD/MM" - optional, defaults to today
  dryRun?: boolean;    // If true, simulates without actually publishing
}

interface ScheduledPublishResponse {
  success: boolean;
  action: 'published' | 'skipped' | 'no_post' | 'error' | 'dry_run';
  postId?: string;
  message: string;
  post?: Post; // Included in dry_run mode to show what would be published
}

interface ValidationResult {
  valid: boolean;
  reason?: string;
}

// Get today's date in DD/MM format (Paris timezone)
function getTodayDate(): string {
  const now = new Date();
  const parisTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
  const day = parisTime.getDate().toString().padStart(2, '0');
  const month = (parisTime.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
}

// Validate post before publication
function validatePost(post: Post): ValidationResult {
  // Check imageUrl exists and is not base64
  if (!post.imageUrl || post.imageUrl.startsWith('data:')) {
    return { valid: false, reason: 'Invalid or missing imageUrl (base64 not allowed)' };
  }
  
  // Check caption is not empty
  if (!post.caption || post.caption.trim() === '') {
    return { valid: false, reason: 'Empty caption' };
  }
  
  return { valid: true };
}

// Find today's post from database
async function findTodaysPost(supabase: any, targetDate: string): Promise<Post | null> {
  console.log(`Searching for post with date: ${targetDate}`);
  
  // Query posts table - posts are stored with content as JSONB
  const { data, error } = await supabase
    .from('posts')
    .select('id, content')
    .order('id', { ascending: true });

  if (error) {
    console.error('Database query error:', error);
    throw new Error(`Database error: ${error.message}`);
  }

  if (!data || data.length === 0) {
    console.log('No posts found in database');
    return null;
  }

  // Filter posts: match date, not published
  for (const row of data) {
    const post = row.content as Post;
    if (post.date === targetDate && !post.published) {
      console.log(`Found matching post: ${post.id}`);
      return post;
    }
  }

  console.log(`No unpublished post found for date ${targetDate}`);
  return null;
}

// Log to publication_history table
async function logPublicationHistory(
  supabase: any,
  postId: string | null,
  action: 'published' | 'skipped' | 'no_post' | 'error',
  message: string,
  targetDate: string
): Promise<void> {
  const { error } = await supabase
    .from('publication_history')
    .insert({
      post_id: postId,
      action,
      message,
      target_date: targetDate
    });

  if (error) {
    console.error('Failed to log publication history:', error);
  }
}

// Update post status to published
async function updatePostStatus(supabase: any, post: Post): Promise<void> {
  const updatedPost = { ...post, published: true };
  
  const { error } = await supabase
    .from('posts')
    .upsert({
      id: post.id,
      content: updatedPost
    });

  if (error) {
    throw new Error(`Failed to update post status: ${error.message}`);
  }
}

// Call the existing publish-instagram function
async function callPublishInstagram(
  supabaseUrl: string,
  serviceRoleKey: string,
  post: Post
): Promise<{ success: boolean; error?: string }> {
  const fullCaption = `${post.caption}\n\n${post.cta}\n\n${post.hashtags.join(' ')}`;
  
  const response = await fetch(`${supabaseUrl}/functions/v1/publish-instagram`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      postId: post.id,
      imageUrl: post.imageUrl,
      caption: fullCaption
    })
  });

  const result = await response.json();
  return result;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        action: 'error', 
        message: 'Server configuration error: missing environment variables' 
      } as ScheduledPublishResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  try {
    // Parse request body (optional targetDate and dryRun for testing)
    let targetDate: string;
    let dryRun: boolean = false;
    try {
      const body: ScheduledPublishRequest = await req.json();
      targetDate = body.targetDate || getTodayDate();
      dryRun = body.dryRun || false;
    } catch {
      targetDate = getTodayDate();
    }

    console.log(`=== Scheduled Publish Started ===`);
    console.log(`Target date: ${targetDate}`);
    console.log(`Dry run: ${dryRun}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);

    // Step 1: Find today's post
    const post = await findTodaysPost(supabase, targetDate);

    if (!post) {
      const message = `No unpublished post found for date ${targetDate}`;
      console.log(message);
      if (!dryRun) {
        await logPublicationHistory(supabase, null, 'no_post', message, targetDate);
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          action: 'no_post', 
          message 
        } as ScheduledPublishResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: Validate the post
    const validation = validatePost(post);
    
    if (!validation.valid) {
      const message = `Post ${post.id} skipped: ${validation.reason}`;
      console.warn(message);
      if (!dryRun) {
        await logPublicationHistory(supabase, post.id, 'skipped', message, targetDate);
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          action: 'skipped', 
          postId: post.id,
          message,
          post: dryRun ? post : undefined
        } as ScheduledPublishResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // DRY RUN MODE: Return what would be published without actually doing it
    if (dryRun) {
      const message = `[DRY RUN] Would publish post ${post.id} - "${post.caption.substring(0, 50)}..."`;
      console.log(message);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          action: 'dry_run', 
          postId: post.id,
          message,
          post // Include full post details for review
        } as ScheduledPublishResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 3: Call publish-instagram (only if not dry run)
    console.log(`Publishing post ${post.id}...`);
    const publishResult = await callPublishInstagram(SUPABASE_URL, SUPABASE_SERVICE_KEY, post);

    if (!publishResult.success) {
      const message = `Publication failed for post ${post.id}: ${publishResult.error || 'Unknown error'}`;
      console.error(message);
      await logPublicationHistory(supabase, post.id, 'error', message, targetDate);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          action: 'error', 
          postId: post.id,
          message 
        } as ScheduledPublishResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Step 4: Update post status and log success
    await updatePostStatus(supabase, post);
    const message = `Successfully published post ${post.id}`;
    console.log(message);
    await logPublicationHistory(supabase, post.id, 'published', message, targetDate);

    return new Response(
      JSON.stringify({ 
        success: true, 
        action: 'published', 
        postId: post.id,
        message 
      } as ScheduledPublishResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    const message = `Scheduler error: ${error.message}`;
    console.error(message);
    
    // Try to log the error (may fail if supabase is the issue)
    try {
      await logPublicationHistory(supabase, null, 'error', message, getTodayDate());
    } catch (logError) {
      console.error('Failed to log error to history:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        action: 'error', 
        message 
      } as ScheduledPublishResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

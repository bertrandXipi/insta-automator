// Pure functions extracted from scheduled-publish Edge Function for testing
// These functions contain the core business logic without Supabase dependencies

export interface Post {
  id: string;
  date: string;
  caption: string;
  imageUrl: string;
  published: boolean;
  isClientManaged?: boolean;
  hashtags: string[];
  cta: string;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export type PublicationAction = 'published' | 'skipped' | 'no_post' | 'error';

export interface PublicationHistoryEntry {
  post_id: string | null;
  action: PublicationAction;
  message: string;
  target_date: string;
}

/**
 * Get today's date in DD/MM format (Paris timezone)
 */
export function getTodayDate(): string {
  const now = new Date();
  const parisTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
  const day = parisTime.getDate().toString().padStart(2, '0');
  const month = (parisTime.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
}

/**
 * Validate a post before publication
 * Requirements: 3.1, 3.2, 3.3
 */
export function validatePost(post: Post): ValidationResult {
  // Check imageUrl exists and is not base64 (Requirement 3.1)
  if (!post.imageUrl || post.imageUrl.startsWith('data:')) {
    return { valid: false, reason: 'Invalid or missing imageUrl (base64 not allowed)' };
  }
  
  // Check caption is not empty (Requirement 3.2)
  if (!post.caption || post.caption.trim() === '') {
    return { valid: false, reason: 'Empty caption' };
  }
  
  // Check not client-managed (Requirement 3.3)
  if (post.isClientManaged) {
    return { valid: false, reason: 'Client-managed post' };
  }
  
  return { valid: true };
}

/**
 * Select the first unpublished, non-client-managed post for a given date
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */
export function selectPostForDate(posts: Post[], targetDate: string): Post | null {
  // Filter posts: match date, not published, not client-managed
  const matchingPosts = posts.filter(post => 
    post.date === targetDate && 
    !post.published && 
    !post.isClientManaged
  );

  // Return first matching post or null (Requirement 1.2 - first unpublished)
  return matchingPosts.length > 0 ? matchingPosts[0] : null;
}

/**
 * Create a publication history entry
 * Requirements: 4.1, 4.2, 4.3
 */
export function createHistoryEntry(
  postId: string | null,
  action: PublicationAction,
  message: string,
  targetDate: string
): PublicationHistoryEntry {
  return {
    post_id: postId,
    action,
    message,
    target_date: targetDate
  };
}

/**
 * Update post status to published (returns new post object)
 * Requirement: 2.2
 */
export function markPostAsPublished(post: Post): Post {
  return { ...post, published: true };
}

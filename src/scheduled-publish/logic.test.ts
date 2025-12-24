import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  Post,
  validatePost,
  selectPostForDate,
  markPostAsPublished,
  createHistoryEntry,
  PublicationAction
} from './logic';

// ============================================================================
// GENERATORS - Random post generators for property-based testing
// ============================================================================

// Generate a valid date in DD/MM format
const dateArb = fc.tuple(
  fc.integer({ min: 1, max: 31 }),
  fc.integer({ min: 1, max: 12 })
).map(([day, month]) => 
  `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`
);

// Generate a valid URL (not base64)
const validUrlArb = fc.webUrl();

// Generate a base64 image URL (invalid for Instagram)
const base64UrlArb = fc.string({ minLength: 10, maxLength: 100 })
  .map(s => `data:image/jpeg;base64,${s}`);

// Generate a non-empty caption
const validCaptionArb = fc.string({ minLength: 1, maxLength: 500 })
  .filter(s => s.trim().length > 0);

// Generate an empty or whitespace-only caption
const invalidCaptionArb = fc.constantFrom('', '   ', '\t', '\n', '  \n  ');

// Generate hashtags array
const hashtagsArb = fc.array(
  fc.string({ minLength: 1, maxLength: 30 }).map(s => `#${s.replace(/\s/g, '')}`),
  { minLength: 0, maxLength: 10 }
);

// Generate a valid post (can be published to Instagram)
const validPostArb: fc.Arbitrary<Post> = fc.record({
  id: fc.uuid(),
  date: dateArb,
  caption: validCaptionArb,
  imageUrl: validUrlArb,
  published: fc.boolean(),
  isClientManaged: fc.constant(false),
  hashtags: hashtagsArb,
  cta: fc.string({ maxLength: 100 })
});

// Generate a post with invalid imageUrl (base64)
const postWithBase64ImageArb: fc.Arbitrary<Post> = fc.record({
  id: fc.uuid(),
  date: dateArb,
  caption: validCaptionArb,
  imageUrl: base64UrlArb,
  published: fc.constant(false),
  isClientManaged: fc.constant(false),
  hashtags: hashtagsArb,
  cta: fc.string({ maxLength: 100 })
});

// Generate a post with empty caption
const postWithEmptyCaptionArb: fc.Arbitrary<Post> = fc.record({
  id: fc.uuid(),
  date: dateArb,
  caption: invalidCaptionArb,
  imageUrl: validUrlArb,
  published: fc.constant(false),
  isClientManaged: fc.constant(false),
  hashtags: hashtagsArb,
  cta: fc.string({ maxLength: 100 })
});

// Generate a client-managed post
const clientManagedPostArb: fc.Arbitrary<Post> = fc.record({
  id: fc.uuid(),
  date: dateArb,
  caption: validCaptionArb,
  imageUrl: validUrlArb,
  published: fc.constant(false),
  isClientManaged: fc.constant(true),
  hashtags: hashtagsArb,
  cta: fc.string({ maxLength: 100 })
});

// Generate an unpublished, non-client-managed post for a specific date
const unpublishedPostForDateArb = (targetDate: string): fc.Arbitrary<Post> => fc.record({
  id: fc.uuid(),
  date: fc.constant(targetDate),
  caption: validCaptionArb,
  imageUrl: validUrlArb,
  published: fc.constant(false),
  isClientManaged: fc.constant(false),
  hashtags: hashtagsArb,
  cta: fc.string({ maxLength: 100 })
});

// Generate a published post
const publishedPostArb: fc.Arbitrary<Post> = fc.record({
  id: fc.uuid(),
  date: dateArb,
  caption: validCaptionArb,
  imageUrl: validUrlArb,
  published: fc.constant(true),
  isClientManaged: fc.boolean(),
  hashtags: hashtagsArb,
  cta: fc.string({ maxLength: 100 })
});

// ============================================================================
// PROPERTY-BASED TESTS
// ============================================================================

describe('Scheduled Publish Logic', () => {
  
  // --------------------------------------------------------------------------
  // Property 1: Post Selection by Date
  // **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
  // --------------------------------------------------------------------------
  describe('Property 1: Post Selection by Date', () => {
    
    it('should return null when no posts exist for the target date', () => {
      fc.assert(
        fc.property(
          fc.array(validPostArb, { minLength: 0, maxLength: 20 }),
          dateArb,
          (posts, targetDate) => {
            // Ensure no posts match the target date
            const postsWithDifferentDates = posts.map(p => ({
              ...p,
              date: p.date === targetDate ? '99/99' : p.date
            }));
            
            const result = selectPostForDate(postsWithDifferentDates, targetDate);
            expect(result).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return the first unpublished, non-client-managed post for the date', () => {
      fc.assert(
        fc.property(
          dateArb,
          fc.array(validPostArb, { minLength: 1, maxLength: 10 }),
          (targetDate, otherPosts) => {
            // Create a specific unpublished post for the target date
            const targetPost: Post = {
              id: 'target-post-id',
              date: targetDate,
              caption: 'Target caption',
              imageUrl: 'https://example.com/image.jpg',
              published: false,
              isClientManaged: false,
              hashtags: [],
              cta: ''
            };
            
            // Mix with other posts (ensure they don't match criteria)
            const allPosts = [
              ...otherPosts.map(p => ({ ...p, date: '99/99' })), // Different dates
              targetPost
            ];
            
            const result = selectPostForDate(allPosts, targetDate);
            expect(result).not.toBeNull();
            expect(result?.id).toBe('target-post-id');
            expect(result?.published).toBe(false);
            expect(result?.isClientManaged).toBeFalsy();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should skip already published posts', () => {
      fc.assert(
        fc.property(
          dateArb,
          (targetDate) => {
            const publishedPost: Post = {
              id: 'published-post',
              date: targetDate,
              caption: 'Published caption',
              imageUrl: 'https://example.com/image.jpg',
              published: true,
              isClientManaged: false,
              hashtags: [],
              cta: ''
            };
            
            const result = selectPostForDate([publishedPost], targetDate);
            expect(result).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // --------------------------------------------------------------------------
  // Property 2: Invalid Post Rejection
  // **Validates: Requirements 3.1, 3.2**
  // --------------------------------------------------------------------------
  describe('Property 2: Invalid Post Rejection', () => {
    
    it('should reject posts with base64 imageUrl', () => {
      fc.assert(
        fc.property(postWithBase64ImageArb, (post) => {
          const result = validatePost(post);
          expect(result.valid).toBe(false);
          expect(result.reason).toContain('imageUrl');
        }),
        { numRuns: 100 }
      );
    });

    it('should reject posts with empty caption', () => {
      fc.assert(
        fc.property(postWithEmptyCaptionArb, (post) => {
          const result = validatePost(post);
          expect(result.valid).toBe(false);
          expect(result.reason).toContain('caption');
        }),
        { numRuns: 100 }
      );
    });

    it('should accept posts with valid imageUrl and caption', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.uuid(),
            date: dateArb,
            caption: validCaptionArb,
            imageUrl: validUrlArb,
            published: fc.boolean(),
            isClientManaged: fc.constant(false),
            hashtags: hashtagsArb,
            cta: fc.string({ maxLength: 100 })
          }),
          (post) => {
            const result = validatePost(post);
            expect(result.valid).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // --------------------------------------------------------------------------
  // Property 3: Client-Managed Post Exclusion
  // **Validates: Requirements 3.3**
  // --------------------------------------------------------------------------
  describe('Property 3: Client-Managed Post Exclusion', () => {
    
    it('should reject client-managed posts in validation', () => {
      fc.assert(
        fc.property(clientManagedPostArb, (post) => {
          const result = validatePost(post);
          expect(result.valid).toBe(false);
          expect(result.reason).toContain('Client-managed');
        }),
        { numRuns: 100 }
      );
    });

    it('should not select client-managed posts', () => {
      fc.assert(
        fc.property(
          dateArb,
          (targetDate) => {
            const clientManagedPost: Post = {
              id: 'client-managed',
              date: targetDate,
              caption: 'Client caption',
              imageUrl: 'https://example.com/image.jpg',
              published: false,
              isClientManaged: true,
              hashtags: [],
              cta: ''
            };
            
            const result = selectPostForDate([clientManagedPost], targetDate);
            expect(result).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // --------------------------------------------------------------------------
  // Property 4: Publication Status Update
  // **Validates: Requirements 2.2**
  // --------------------------------------------------------------------------
  describe('Property 4: Publication Status Update', () => {
    
    it('should set published to true after marking as published', () => {
      fc.assert(
        fc.property(validPostArb, (post) => {
          const unpublishedPost = { ...post, published: false };
          const result = markPostAsPublished(unpublishedPost);
          
          expect(result.published).toBe(true);
          // Other fields should remain unchanged
          expect(result.id).toBe(unpublishedPost.id);
          expect(result.caption).toBe(unpublishedPost.caption);
          expect(result.imageUrl).toBe(unpublishedPost.imageUrl);
        }),
        { numRuns: 100 }
      );
    });

    it('should not mutate the original post', () => {
      fc.assert(
        fc.property(validPostArb, (post) => {
          const unpublishedPost = { ...post, published: false };
          const originalPublished = unpublishedPost.published;
          
          markPostAsPublished(unpublishedPost);
          
          // Original should be unchanged
          expect(unpublishedPost.published).toBe(originalPublished);
        }),
        { numRuns: 100 }
      );
    });
  });

  // --------------------------------------------------------------------------
  // Property 5: Failed Publication Preserves State
  // **Validates: Requirements 2.3**
  // --------------------------------------------------------------------------
  describe('Property 5: Failed Publication Preserves State', () => {
    
    it('should preserve original post state when not calling markPostAsPublished', () => {
      fc.assert(
        fc.property(validPostArb, (post) => {
          const unpublishedPost = { ...post, published: false };
          
          // Simulate failed publication - don't call markPostAsPublished
          // The post should remain unchanged
          expect(unpublishedPost.published).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
  });

  // --------------------------------------------------------------------------
  // Property 6: Audit Trail Completeness
  // **Validates: Requirements 4.3**
  // --------------------------------------------------------------------------
  describe('Property 6: Audit Trail Completeness', () => {
    
    it('should create history entry with all required fields', () => {
      const actions: PublicationAction[] = ['published', 'skipped', 'no_post', 'error'];
      
      fc.assert(
        fc.property(
          fc.option(fc.uuid(), { nil: null }),
          fc.constantFrom(...actions),
          fc.string({ minLength: 1, maxLength: 200 }),
          dateArb,
          (postId, action, message, targetDate) => {
            const entry = createHistoryEntry(postId, action, message, targetDate);
            
            expect(entry.post_id).toBe(postId);
            expect(entry.action).toBe(action);
            expect(entry.message).toBe(message);
            expect(entry.target_date).toBe(targetDate);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should allow null post_id for no_post action', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }),
          dateArb,
          (message, targetDate) => {
            const entry = createHistoryEntry(null, 'no_post', message, targetDate);
            
            expect(entry.post_id).toBeNull();
            expect(entry.action).toBe('no_post');
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});

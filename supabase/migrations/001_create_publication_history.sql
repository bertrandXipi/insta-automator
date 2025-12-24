-- Migration: Create publication_history table
-- Description: Table for audit trail of scheduled Instagram publications
-- Requirements: 4.3 - Store publication history for audit purposes

-- Create the publication_history table
CREATE TABLE IF NOT EXISTS publication_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id TEXT,
  action TEXT NOT NULL CHECK (action IN ('published', 'skipped', 'no_post', 'error')),
  message TEXT NOT NULL,
  target_date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for queries by date (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_publication_history_date ON publication_history(target_date);

-- Index for queries by action (useful for monitoring errors)
CREATE INDEX IF NOT EXISTS idx_publication_history_action ON publication_history(action);

-- Index for queries by post_id (useful for tracking specific posts)
CREATE INDEX IF NOT EXISTS idx_publication_history_post_id ON publication_history(post_id);

-- Comment on table for documentation
COMMENT ON TABLE publication_history IS 'Audit trail for scheduled Instagram publications';
COMMENT ON COLUMN publication_history.id IS 'Unique identifier for the history entry';
COMMENT ON COLUMN publication_history.post_id IS 'Reference to the post that was processed (null if no post found)';
COMMENT ON COLUMN publication_history.action IS 'Result of the scheduler run: published, skipped, no_post, or error';
COMMENT ON COLUMN publication_history.message IS 'Detailed message about the action taken';
COMMENT ON COLUMN publication_history.target_date IS 'The date that was being processed (format DD/MM)';
COMMENT ON COLUMN publication_history.created_at IS 'Timestamp when the entry was created';

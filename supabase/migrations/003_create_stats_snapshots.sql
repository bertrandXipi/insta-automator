-- Migration: Create stats_snapshots table
-- Description: Store Instagram analytics snapshots for period comparison

CREATE TABLE IF NOT EXISTS stats_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'default-user',
  period TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  data JSONB NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('manual', 'api', 'migration')),
  business_metrics JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for querying by user
CREATE INDEX IF NOT EXISTS idx_stats_snapshots_user ON stats_snapshots(user_id);

-- Index for querying by date range
CREATE INDEX IF NOT EXISTS idx_stats_snapshots_period ON stats_snapshots(period_start, period_end);

-- Index for looking up latest snapshot per user
CREATE INDEX IF NOT EXISTS idx_stats_snapshots_user_created ON stats_snapshots(user_id, created_at DESC);

COMMENT ON TABLE stats_snapshots IS 'Periodic Instagram analytics snapshots for performance comparison';
COMMENT ON COLUMN stats_snapshots.period IS 'Human-readable period name (e.g., "Decembre 2025 - Janvier 2026")';
COMMENT ON COLUMN stats_snapshots.data IS 'Complete stats data in StatsSnapshotData format (JSONB)';
COMMENT ON COLUMN stats_snapshots.source IS 'Origin of the data: manual, api (from Instagram), or migration (from hardcoded)';
COMMENT ON COLUMN stats_snapshots.business_metrics IS 'Manual business metrics (CPM, monthlyInvestment, potentialROI)';

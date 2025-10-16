-- Create migration tracking table
CREATE TABLE IF NOT EXISTS migration_history (
  id SERIAL PRIMARY KEY,
  migration_name VARCHAR(255) NOT NULL UNIQUE,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  git_commit VARCHAR(40),
  applied_by VARCHAR(255),
  execution_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT
);

-- Create index for faster lookups
CREATE INDEX idx_migration_history_name ON migration_history(migration_name);
CREATE INDEX idx_migration_history_applied_at ON migration_history(applied_at DESC);

-- Add comment
COMMENT ON TABLE migration_history IS 'Tracks all database migrations applied to this environment';

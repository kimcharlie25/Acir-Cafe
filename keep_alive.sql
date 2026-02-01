-- Enable the pg_cron extension if it's not already enabled
-- Note: You might need to check "Database > Extensions" in Supabase dashboard to ensure it's allowed
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a schema for our maintenance tasks if it doesn't exist
CREATE SCHEMA IF NOT EXISTS maintenance;

-- Create a simple logging table to track keeps-alive pings
CREATE TABLE IF NOT EXISTS maintenance.keep_alive_log (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    last_ping_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delete old logs to keep the table small (keeps last 30 days)
CREATE OR REPLACE FUNCTION maintenance.cleanup_keep_alive_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM maintenance.keep_alive_log
    WHERE last_ping_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule the keep-alive ping every 12 hours
-- This inserts a timestamp into the log table, which counts as database activity
SELECT cron.schedule(
    'supabase-keep-alive-ping',      -- Job name
    '0 */12 * * *',                  -- Every 12 hours
    $$INSERT INTO maintenance.keep_alive_log (last_ping_at) VALUES (NOW());$$
);

-- Schedule a cleanup job to run once a week
SELECT cron.schedule(
    'cleanup-keep-alive-logs',       -- Job name
    '0 0 * * 0',                     -- Every Sunday at midnight
    $$SELECT maintenance.cleanup_keep_alive_logs();$$
);

-- Initial ping to verify it works and start the process
INSERT INTO maintenance.keep_alive_log (last_ping_at) VALUES (NOW());

-- Instructions:
-- 1. Copy this entire script.
-- 2. Go to your Supabase Dashboard.
-- 3. Open the "SQL Editor" from the left sidebar.
-- 4. Paste this script into a new query and click "Run".
-- 5. You can verify the job is scheduled by running: SELECT * FROM cron.job;

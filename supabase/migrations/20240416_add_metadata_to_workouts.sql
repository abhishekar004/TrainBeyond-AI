-- Drop the column if it exists (to avoid any type mismatches)
ALTER TABLE workouts DROP COLUMN IF EXISTS metadata;

-- Add metadata column to workouts table
ALTER TABLE workouts ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb; 
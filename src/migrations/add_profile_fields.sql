-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS weight decimal(5,2),
ADD COLUMN IF NOT EXISTS height decimal(5,2);

-- Update existing rows to have NULL values for new columns
UPDATE profiles
SET age = NULL,
    weight = NULL,
    height = NULL
WHERE age IS NULL
   OR weight IS NULL
   OR height IS NULL; 
-- Drop existing foreign key constraint
ALTER TABLE user_exercise_logs DROP CONSTRAINT IF EXISTS user_exercise_logs_workout_id_fkey;

-- Add new foreign key constraint with ON DELETE CASCADE
ALTER TABLE user_exercise_logs 
ADD CONSTRAINT user_exercise_logs_workout_id_fkey 
FOREIGN KEY (workout_id) 
REFERENCES workouts(id) 
ON DELETE CASCADE; 
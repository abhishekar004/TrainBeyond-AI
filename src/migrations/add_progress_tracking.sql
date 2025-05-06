-- Create weight tracking table
CREATE TABLE IF NOT EXISTS weight_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    weight DECIMAL(5,2) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- Create workout completion tracking table
CREATE TABLE IF NOT EXISTS workout_completions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_minutes INTEGER,
    difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
    notes TEXT
);

-- Create exercise progress tracking table
CREATE TABLE IF NOT EXISTS exercise_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
    workout_completion_id UUID REFERENCES workout_completions(id) ON DELETE CASCADE,
    sets INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    weight DECIMAL(5,2),
    duration_seconds INTEGER,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_weight_logs_user_date ON weight_logs(user_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_workout_completions_user_date ON workout_completions(user_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_exercise_progress_user_date ON exercise_progress(user_id, recorded_at);

-- Add RLS policies
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_progress ENABLE ROW LEVEL SECURITY;

-- Policies for weight_logs
CREATE POLICY "Users can view their own weight logs"
    ON weight_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weight logs"
    ON weight_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weight logs"
    ON weight_logs FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weight logs"
    ON weight_logs FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for workout_completions
CREATE POLICY "Users can view their own workout completions"
    ON workout_completions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout completions"
    ON workout_completions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout completions"
    ON workout_completions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout completions"
    ON workout_completions FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for exercise_progress
CREATE POLICY "Users can view their own exercise progress"
    ON exercise_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exercise progress"
    ON exercise_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise progress"
    ON exercise_progress FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercise progress"
    ON exercise_progress FOR DELETE
    USING (auth.uid() = user_id); 
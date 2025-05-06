-- Create daily_progress table
CREATE TABLE IF NOT EXISTS daily_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    completed_workouts INTEGER NOT NULL DEFAULT 0,
    total_minutes INTEGER NOT NULL DEFAULT 0,
    calories_burned INTEGER NOT NULL DEFAULT 0,
    streak INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, date)
);

-- Create progress_stats table
CREATE TABLE IF NOT EXISTS progress_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    total_workouts INTEGER NOT NULL DEFAULT 0,
    total_minutes INTEGER NOT NULL DEFAULT 0,
    total_calories INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL,
    unlocked BOOLEAN NOT NULL DEFAULT false,
    date_unlocked TIMESTAMP WITH TIME ZONE,
    progress INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, achievement_id)
);

-- Create function to update progress stats
CREATE OR REPLACE FUNCTION update_progress_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update progress_stats
    INSERT INTO progress_stats (user_id, current_streak, longest_streak, total_workouts, total_minutes, total_calories)
    VALUES (
        NEW.user_id,
        NEW.streak,
        GREATEST(NEW.streak, COALESCE((SELECT longest_streak FROM progress_stats WHERE user_id = NEW.user_id), 0)),
        NEW.completed_workouts,
        NEW.total_minutes,
        NEW.calories_burned
    )
    ON CONFLICT (user_id) DO UPDATE
    SET
        current_streak = EXCLUDED.current_streak,
        longest_streak = GREATEST(EXCLUDED.longest_streak, progress_stats.longest_streak),
        total_workouts = progress_stats.total_workouts + EXCLUDED.total_workouts,
        total_minutes = progress_stats.total_minutes + EXCLUDED.total_minutes,
        total_calories = progress_stats.total_calories + EXCLUDED.total_calories,
        last_updated = timezone('utc'::text, now());

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for daily_progress updates
CREATE TRIGGER update_progress_stats_trigger
AFTER INSERT OR UPDATE ON daily_progress
FOR EACH ROW
EXECUTE FUNCTION update_progress_stats();

-- Create RLS policies
ALTER TABLE daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Daily progress policies
CREATE POLICY "Users can view their own daily progress"
    ON daily_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily progress"
    ON daily_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily progress"
    ON daily_progress FOR UPDATE
    USING (auth.uid() = user_id);

-- Progress stats policies
CREATE POLICY "Users can view their own progress stats"
    ON progress_stats FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress stats"
    ON progress_stats FOR UPDATE
    USING (auth.uid() = user_id);

-- User achievements policies
CREATE POLICY "Users can view their own achievements"
    ON user_achievements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
    ON user_achievements FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
    ON user_achievements FOR UPDATE
    USING (auth.uid() = user_id); 
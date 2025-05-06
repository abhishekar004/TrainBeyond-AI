import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProgressContextType {
  workoutProgress: any[];
  achievements: any[];
  loading: boolean;
  refreshProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [workoutProgress, setWorkoutProgress] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshProgress = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch workout completions
      const { data: completions, error: completionsError } = await supabase
        .from('workout_completions')
        .select(`
          *,
          workout:workouts(*),
          exercises:exercise_progress(*)
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (completionsError) throw completionsError;
      setWorkoutProgress(completions || []);

      // Calculate achievements
      const newAchievements = calculateAchievements(completions || []);
      setAchievements(newAchievements);

    } catch (error: any) {
      console.error('Error fetching progress:', error);
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const calculateAchievements = (completions: any[]) => {
    const achievements = [];

    // Total workouts completed
    const totalWorkouts = completions.length;
    if (totalWorkouts >= 1) achievements.push({ id: 'first_workout', name: 'First Workout', description: 'Completed your first workout' });
    if (totalWorkouts >= 5) achievements.push({ id: 'five_workouts', name: 'Consistent', description: 'Completed 5 workouts' });
    if (totalWorkouts >= 10) achievements.push({ id: 'ten_workouts', name: 'Dedicated', description: 'Completed 10 workouts' });

    // Check for consecutive days
    const sortedCompletions = [...completions].sort((a, b) => 
      new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime()
    );
    
    let consecutiveDays = 1;
    let maxConsecutiveDays = 1;
    
    for (let i = 1; i < sortedCompletions.length; i++) {
      const prevDate = new Date(sortedCompletions[i-1].completed_at);
      const currentDate = new Date(sortedCompletions[i].completed_at);
      
      if (isConsecutiveDay(prevDate, currentDate)) {
        consecutiveDays++;
        maxConsecutiveDays = Math.max(maxConsecutiveDays, consecutiveDays);
      } else {
        consecutiveDays = 1;
      }
    }

    if (maxConsecutiveDays >= 3) achievements.push({ 
      id: 'three_day_streak', 
      name: '3-Day Streak', 
      description: 'Worked out for 3 consecutive days' 
    });
    if (maxConsecutiveDays >= 7) achievements.push({ 
      id: 'week_streak', 
      name: 'Week Streak', 
      description: 'Worked out for 7 consecutive days' 
    });

    return achievements;
  };

  const isConsecutiveDay = (date1: Date, date2: Date) => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  };

  useEffect(() => {
    refreshProgress();
  }, [user]);

  return (
    <ProgressContext.Provider value={{ 
      workoutProgress, 
      achievements, 
      loading, 
      refreshProgress 
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}; 
import { format, subDays } from 'date-fns';

interface ExerciseCompletion {
  completed_at: string;
  exercises: any[];
}

export function getProgressStats(workoutProgress: ExerciseCompletion[]) {
  const stats = {
    totalWorkouts: workoutProgress.length,
    currentStreak: 0,
    bestDay: { date: '', count: 0 },
  };
  let currentStreak = 0;
  let lastDate: Date | null = null;
  let bestDayCount = 0;
  let bestDayDate = '';
  // Count exercises per day for the last 7 days
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
  const dayCounts: Record<string, number> = {};
  last7Days.forEach(day => {
    dayCounts[format(day, 'yyyy-MM-dd')] = 0;
  });
  // New: Map for all days in workoutProgress
  const allDayExerciseCounts: Record<string, number> = {};
  workoutProgress.forEach((completion: ExerciseCompletion) => {
    const date = new Date(completion.completed_at);
    const key = format(date, 'yyyy-MM-dd');
    // For streak and mini-graph (last 7 days)
    if (key in dayCounts) {
      dayCounts[key] += (completion.exercises ? completion.exercises.length : 0);
    }
    // For best day (all time)
    if (!(key in allDayExerciseCounts)) allDayExerciseCounts[key] = 0;
    allDayExerciseCounts[key] += (completion.exercises ? completion.exercises.length : 0);
    // Streak calculation (consecutive days)
    if (!lastDate) {
      currentStreak = 1;
    } else {
      const diffDays = Math.ceil(Math.abs(date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        currentStreak++;
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    }
    lastDate = date;
  });
  // Find best day (all time, by exercise count)
  Object.entries(allDayExerciseCounts).forEach(([date, count]) => {
    if ((count as number) > bestDayCount) {
      bestDayCount = count as number;
      bestDayDate = format(new Date(date), 'MMM d');
    }
  });
  stats.currentStreak = currentStreak;
  stats.bestDay = { date: bestDayDate, count: bestDayCount };
  // Prepare data for mini graph
  const miniGraphData = last7Days.map(day => ({
    day: format(day, 'EEE'),
    count: dayCounts[format(day, 'yyyy-MM-dd')] || 0
  }));
  return { stats, miniGraphData };
} 
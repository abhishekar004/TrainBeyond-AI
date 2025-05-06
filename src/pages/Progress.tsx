import React, { useState } from 'react';
import { useProgress } from '@/contexts/ProgressContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Calendar, Dumbbell, Loader2 } from 'lucide-react';
import { format, getDaysInMonth, isSameMonth, isSameYear } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';
import { getProgressStats } from '@/utils/progressStats';
import { StatCard } from '@/components/StatCard';

export const Progress = () => {
  const { workoutProgress, achievements, loading } = useProgress();

  // Get current month and year
  const now = new Date();
  const daysInMonth = getDaysInMonth(now);
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Aggregate exercise completions by day of current month
  const dayCounts: Record<number, number> = {};
  for (let i = 1; i <= daysInMonth; i++) {
    dayCounts[i] = 0;
  }
  workoutProgress.forEach((completion) => {
    const date = new Date(completion.completed_at);
    if (isSameMonth(date, now) && isSameYear(date, now)) {
      const day = date.getDate();
      dayCounts[day] += (completion.exercises ? completion.exercises.length : 0);
    }
  });
  const exerciseData = Array.from({ length: daysInMonth }, (_, i) => ({
    day: (i + 1).toString(),
    count: dayCounts[i + 1] || 0
  }));

  // State for view more/less
  const [showAllWorkouts, setShowAllWorkouts] = useState(false);
  const workoutsToShow = showAllWorkouts ? workoutProgress : workoutProgress.slice(0, 5);

  // --- Add stats calculation ---
  const { stats: progressStats } = getProgressStats(workoutProgress);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Progress</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Current Streak" value={`${progressStats.currentStreak} days`} color="bg-gradient-to-br from-purple-500 to-indigo-600" icon={<span className="mr-2">🔥</span>} subtitle="Keep the fire burning!" />
        <StatCard title="Best Day" value={`${progressStats.bestDay.count} exercises`} color="bg-gradient-to-br from-blue-500 to-cyan-600" icon={<span className="mr-2">🎯</span>} subtitle={`on ${progressStats.bestDay.date}`} />
        <StatCard title="Total Workouts" value={progressStats.totalWorkouts} color="bg-gradient-to-br from-green-500 to-emerald-600" icon={<span className="mr-2">⚡</span>} subtitle="This month" />
        <StatCard title="Calories Burned" value={`${(workoutProgress.reduce((acc, w) => acc + (w.duration_minutes || 0), 0) * 5)} kcal`} color="bg-gradient-to-br from-pink-500 to-red-500" icon={<span className="mr-2">🏋️</span>} subtitle="Estimated" />
      </div>

      {/* Exercise Completion Graph */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Exercise Completion by Day (This Month)</h2>
        {exerciseData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={exerciseData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" label={{ value: 'Day', position: 'insideBottom', offset: -10 }} />
              <YAxis allowDecimals={false} label={{ value: 'Exercises Completed', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1">
                <LabelList dataKey="count" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No exercise completions yet. Complete some workouts to see your stats!
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Workout History */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Workout History</h2>
          <div className="space-y-4">
            {workoutsToShow.length > 0 ? (
              <>
                {workoutsToShow.map((completion) => (
                  <Card key={completion.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{completion.workout.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(completion.completed_at), 'MMM d, yyyy')}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Dumbbell className="h-4 w-4 mr-2" />
                          {completion.exercises.length} exercises
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {completion.duration_minutes} minutes
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {workoutProgress.length > 5 && (
                  <button
                    className="mt-2 text-primary underline text-sm font-medium"
                    onClick={() => setShowAllWorkouts((v) => !v)}
                  >
                    {showAllWorkouts ? 'Show Less' : 'View More'}
                  </button>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No workout history yet. Complete a workout to see your progress!
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
          <div className="space-y-4">
            {achievements.length > 0 ? (
              achievements.map((achievement) => (
                <Card key={achievement.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                      {achievement.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No achievements yet. Keep working out to earn achievements!
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress; 
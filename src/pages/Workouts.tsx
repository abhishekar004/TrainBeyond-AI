import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dumbbell, Plus, Calendar, Clock, Filter, ListFilter, Trash2, Timer, Star, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Exercise } from '@/types/exercise';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useProgress } from '@/contexts/ProgressContext';

interface WorkoutMetadata {
  exercise_count?: number;
  last_performed?: string;
  total_duration?: number;
  goal?: string;
  schedule?: Array<{
    day: string;
    focus: string;
    exercises: Array<{
      id?: string;
      name: string;
      bodyPart: string;
      equipment: string;
      target: string;
      gifUrl: string;
      instructions: string;
      sets?: number;
      reps?: number;
    }>;
  }>;
}

const workoutPlans = [
  {
    id: 'strength',
    name: 'Strength Training',
    description: 'Build muscle and increase strength with our comprehensive program.',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
    workoutsPerWeek: 4,
    duration: '8 weeks',
    level: 'Intermediate',
    schedule: [
      { 
        day: 'Monday', 
        focus: 'Upper Body', 
        exercises: [
          {
            name: 'Bench Press',
            bodyPart: 'Chest',
            equipment: 'Barbell',
            target: 'Pectorals',
            gifUrl: 'https://example.com/benchpress.gif',
            instructions: 'Lie on bench, grip bar slightly wider than shoulders, lower to chest and press up.',
            sets: 4,
            reps: 8
          },
          {
            name: 'Bent Over Rows',
            bodyPart: 'Back',
            equipment: 'Barbell',
            target: 'Upper Back',
            gifUrl: 'https://example.com/rows.gif',
            instructions: 'Bend at hips, keep back straight, pull bar to waist.',
            sets: 4,
            reps: 10
          },
          {
            name: 'Overhead Press',
            bodyPart: 'Shoulders',
            equipment: 'Barbell',
            target: 'Deltoids',
            gifUrl: 'https://example.com/ohp.gif',
            instructions: 'Press bar overhead, keep core tight, lower with control.',
            sets: 3,
            reps: 8
          }
        ]
      },
      { day: 'Tuesday', focus: 'Rest', exercises: [] },
      { 
        day: 'Wednesday', 
        focus: 'Lower Body', 
        exercises: [
          {
            name: 'Squats',
            bodyPart: 'Legs',
            equipment: 'Barbell',
            target: 'Quadriceps',
            gifUrl: 'https://example.com/squat.gif',
            instructions: 'Feet shoulder-width, keep chest up, squat until thighs parallel.',
            sets: 4,
            reps: 8
          },
          {
            name: 'Romanian Deadlifts',
            bodyPart: 'Legs',
            equipment: 'Barbell',
            target: 'Hamstrings',
            gifUrl: 'https://example.com/rdl.gif',
            instructions: 'Hinge at hips, keep back straight, lower bar along legs.',
            sets: 4,
            reps: 10
          },
          {
            name: 'Calf Raises',
            bodyPart: 'Legs',
            equipment: 'Bodyweight',
            target: 'Calves',
            gifUrl: 'https://example.com/calfraise.gif',
            instructions: 'Stand on edge of step, raise heels, lower below step.',
            sets: 3,
            reps: 15
          }
        ]
      },
      { day: 'Thursday', focus: 'Rest', exercises: [] },
      { 
        day: 'Friday', 
        focus: 'Full Body', 
        exercises: [
          {
            name: 'Deadlifts',
            bodyPart: 'Full Body',
            equipment: 'Barbell',
            target: 'Posterior Chain',
            gifUrl: 'https://example.com/deadlift.gif',
            instructions: 'Feet hip-width, grip bar, lift with legs and back.',
            sets: 4,
            reps: 6
          },
          {
            name: 'Pull-ups',
            bodyPart: 'Back',
            equipment: 'Pull-up Bar',
            target: 'Lats',
            gifUrl: 'https://example.com/pullup.gif',
            instructions: 'Hang from bar, pull up until chin above bar.',
            sets: 3,
            reps: 8
          },
          {
            name: 'Dips',
            bodyPart: 'Chest',
            equipment: 'Parallel Bars',
            target: 'Triceps',
            gifUrl: 'https://example.com/dips.gif',
            instructions: 'Lower body between bars, push up to starting position.',
            sets: 3,
            reps: 10
          }
        ]
      },
      { day: 'Saturday', focus: 'Active Recovery', exercises: [] },
      { day: 'Sunday', focus: 'Rest', exercises: [] }
    ]
  },
  {
    id: 'weight-loss',
    name: 'Weight Loss',
    description: 'Effective cardio and strength workouts designed for fat loss.',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop',
    workoutsPerWeek: 5,
    duration: '12 weeks',
    level: 'Beginner',
    schedule: [
      { 
        day: 'Monday', 
        focus: 'HIIT Cardio', 
        exercises: [
          {
            name: 'Jump Rope',
            bodyPart: 'Full Body',
            equipment: 'Jump Rope',
            target: 'Cardiovascular',
            gifUrl: 'https://example.com/jumprope.gif',
            instructions: 'Jump continuously for 30 seconds, rest 15 seconds.',
            sets: 8,
            reps: 30
          },
          {
            name: 'Burpees',
            bodyPart: 'Full Body',
            equipment: 'Bodyweight',
            target: 'Cardiovascular',
            gifUrl: 'https://example.com/burpee.gif',
            instructions: 'Squat, kick legs back, push-up, jump up.',
            sets: 4,
            reps: 10
          },
          {
            name: 'Mountain Climbers',
            bodyPart: 'Core',
            equipment: 'Bodyweight',
            target: 'Cardiovascular',
            gifUrl: 'https://example.com/mountainclimbers.gif',
            instructions: 'In plank position, alternate bringing knees to chest.',
            sets: 4,
            reps: 20
          }
        ]
      },
      { 
        day: 'Tuesday', 
        focus: 'Upper Body', 
        exercises: [
          {
            name: 'Push-ups',
            bodyPart: 'Chest',
            equipment: 'Bodyweight',
            target: 'Upper Body',
            gifUrl: 'https://example.com/pushup.gif',
            instructions: 'Keep body straight, lower chest to ground, push up.',
            sets: 3,
            reps: 12
          },
          {
            name: 'Dumbbell Rows',
            bodyPart: 'Back',
            equipment: 'Dumbbells',
            target: 'Upper Back',
            gifUrl: 'https://example.com/dumbbellrow.gif',
            instructions: 'Bend at hips, pull dumbbell to waist.',
            sets: 3,
            reps: 12
          }
        ]
      },
      { 
        day: 'Wednesday', 
        focus: 'HIIT Cardio', 
        exercises: [
          {
            name: 'High Knees',
            bodyPart: 'Legs',
            equipment: 'Bodyweight',
            target: 'Cardiovascular',
            gifUrl: 'https://example.com/highknees.gif',
            instructions: 'Run in place, bringing knees up high.',
            sets: 4,
            reps: 30
          },
          {
            name: 'Jump Squats',
            bodyPart: 'Legs',
            equipment: 'Bodyweight',
            target: 'Lower Body',
            gifUrl: 'https://example.com/jumpsquat.gif',
            instructions: 'Squat down, explode up into jump.',
            sets: 4,
            reps: 12
          }
        ]
      },
      { 
        day: 'Thursday', 
        focus: 'Lower Body', 
        exercises: [
          {
            name: 'Bodyweight Squats',
            bodyPart: 'Legs',
            equipment: 'Bodyweight',
            target: 'Lower Body',
            gifUrl: 'https://example.com/squat.gif',
            instructions: 'Feet shoulder-width, squat until thighs parallel.',
            sets: 4,
            reps: 15
          },
          {
            name: 'Lunges',
            bodyPart: 'Legs',
            equipment: 'Bodyweight',
            target: 'Lower Body',
            gifUrl: 'https://example.com/lunge.gif',
            instructions: 'Step forward, lower back knee to ground.',
            sets: 3,
            reps: 12
          }
        ]
      },
      { 
        day: 'Friday', 
        focus: 'HIIT Cardio', 
        exercises: [
          {
            name: 'Jumping Jacks',
            bodyPart: 'Full Body',
            equipment: 'Bodyweight',
            target: 'Cardiovascular',
            gifUrl: 'https://example.com/jumpingjacks.gif',
            instructions: 'Jump while spreading legs and raising arms.',
            sets: 4,
            reps: 30
          },
          {
            name: 'Plank Jacks',
            bodyPart: 'Core',
            equipment: 'Bodyweight',
            target: 'Cardiovascular',
            gifUrl: 'https://example.com/plankjacks.gif',
            instructions: 'In plank, jump feet in and out.',
            sets: 4,
            reps: 20
          }
        ]
      },
      { day: 'Saturday', focus: 'Rest', exercises: [] },
      { day: 'Sunday', focus: 'Active Recovery', exercises: [] }
    ]
  },
  {
    id: 'flexibility',
    name: 'Flexibility',
    description: 'Improve mobility and reduce injury risk with targeted stretching.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1520&auto=format&fit=crop',
    workoutsPerWeek: 3,
    duration: '6 weeks',
    level: 'All Levels',
    schedule: [
      { 
        day: 'Monday', 
        focus: 'Upper Body Mobility', 
        exercises: [
          {
            name: 'Shoulder Stretch',
            bodyPart: 'Shoulders',
            equipment: 'None',
            target: 'Shoulder Mobility',
            gifUrl: 'https://example.com/shoulderstretch.gif',
            instructions: 'Cross arm across chest, hold for 30 seconds.',
            sets: 2,
            reps: 30
          },
          {
            name: 'Chest Opener',
            bodyPart: 'Chest',
            equipment: 'None',
            target: 'Chest Mobility',
            gifUrl: 'https://example.com/chestopener.gif',
            instructions: 'Interlace fingers behind back, lift arms.',
            sets: 2,
            reps: 30
          }
        ]
      },
      { day: 'Tuesday', focus: 'Rest', exercises: [] },
      { 
        day: 'Wednesday', 
        focus: 'Lower Body Mobility', 
        exercises: [
          {
            name: 'Hamstring Stretch',
            bodyPart: 'Legs',
            equipment: 'None',
            target: 'Hamstring Flexibility',
            gifUrl: 'https://example.com/hamstringstretch.gif',
            instructions: 'Sit with legs straight, reach for toes.',
            sets: 2,
            reps: 30
          },
          {
            name: 'Hip Flexor Stretch',
            bodyPart: 'Hips',
            equipment: 'None',
            target: 'Hip Mobility',
            gifUrl: 'https://example.com/hipflexorstretch.gif',
            instructions: 'Lunge position, push hips forward.',
            sets: 2,
            reps: 30
          }
        ]
      },
      { day: 'Thursday', focus: 'Rest', exercises: [] },
      { 
        day: 'Friday', 
        focus: 'Full Body Stretching', 
        exercises: [
          {
            name: 'Cat-Cow',
            bodyPart: 'Spine',
            equipment: 'None',
            target: 'Spinal Mobility',
            gifUrl: 'https://example.com/catcow.gif',
            instructions: 'Alternate between arching and rounding back.',
            sets: 2,
            reps: 10
          },
          {
            name: 'Child\'s Pose',
            bodyPart: 'Full Body',
            equipment: 'None',
            target: 'Full Body Relaxation',
            gifUrl: 'https://example.com/childspose.gif',
            instructions: 'Sit back on heels, reach arms forward.',
            sets: 2,
            reps: 30
          }
        ]
      },
      { day: 'Saturday', focus: 'Rest', exercises: [] },
      { day: 'Sunday', focus: 'Rest', exercises: [] }
    ]
  },
  {
    id: 'hiit',
    name: 'HIIT Training',
    description: 'High-intensity interval training for maximum calorie burn in minimum time.',
    imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=1474&auto=format&fit=crop',
    workoutsPerWeek: 4,
    duration: '6 weeks',
    level: 'Intermediate',
    schedule: [
      { day: 'Monday', focus: 'HIIT + Upper Body', exercises: [] },
      { day: 'Tuesday', focus: 'Rest', exercises: [] },
      { day: 'Wednesday', focus: 'HIIT + Lower Body', exercises: [] },
      { day: 'Thursday', focus: 'Rest', exercises: [] },
      { day: 'Friday', focus: 'HIIT + Core', exercises: [] },
      { day: 'Saturday', focus: 'Active Recovery', exercises: [] },
      { day: 'Sunday', focus: 'Rest', exercises: [] }
    ]
  },
  {
    id: 'powerlifting',
    name: 'Powerlifting',
    description: 'Focus on the big three lifts: squat, bench press, and deadlift to build maximum strength.',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1469&auto=format&fit=crop',
    workoutsPerWeek: 4,
    duration: '12 weeks',
    level: 'Advanced',
    schedule: [
      { day: 'Monday', focus: 'Squat', exercises: [] },
      { day: 'Tuesday', focus: 'Bench Press', exercises: [] },
      { day: 'Wednesday', focus: 'Rest', exercises: [] },
      { day: 'Thursday', focus: 'Deadlift', exercises: [] },
      { day: 'Friday', focus: 'Accessory Work', exercises: [] },
      { day: 'Saturday', focus: 'Rest', exercises: [] },
      { day: 'Sunday', focus: 'Rest', exercises: [] }
    ]
  },
  {
    id: 'bodyweight',
    name: 'Bodyweight Mastery',
    description: 'Build strength and control using just your body weight with progressive calisthenics.',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop',
    workoutsPerWeek: 3,
    duration: '8 weeks',
    level: 'Beginner',
    schedule: [
      { day: 'Monday', focus: 'Push', exercises: [] },
      { day: 'Tuesday', focus: 'Pull', exercises: [] },
      { day: 'Wednesday', focus: 'Rest', exercises: [] },
      { day: 'Thursday', focus: 'Legs', exercises: [] },
      { day: 'Friday', focus: 'Core', exercises: [] },
      { day: 'Saturday', focus: 'Rest', exercises: [] },
      { day: 'Sunday', focus: 'Rest', exercises: [] }
    ]
  },
  {
    id: 'endurance',
    name: 'Endurance Training',
    description: 'Build stamina and cardiovascular fitness with progressive endurance workouts.',
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1470&auto=format&fit=crop',
    workoutsPerWeek: 5,
    duration: '10 weeks',
    level: 'Intermediate',
    schedule: [
      { day: 'Monday', focus: 'Run', exercises: [] },
      { day: 'Tuesday', focus: 'Bike', exercises: [] },
      { day: 'Wednesday', focus: 'Rest', exercises: [] },
      { day: 'Thursday', focus: 'Swim', exercises: [] },
      { day: 'Friday', focus: 'Run', exercises: [] },
      { day: 'Saturday', focus: 'Rest', exercises: [] },
      { day: 'Sunday', focus: 'Long Run', exercises: [] }
    ]
  },
  {
    id: 'functional',
    name: 'Functional Fitness',
    description: 'Improve everyday movement patterns and build practical strength for daily life.',
    imageUrl: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=1470&auto=format&fit=crop',
    workoutsPerWeek: 4,
    duration: '8 weeks',
    level: 'All Levels',
    schedule: [
      { day: 'Monday', focus: 'Mobility', exercises: [] },
      { day: 'Tuesday', focus: 'Strength', exercises: [] },
      { day: 'Wednesday', focus: 'Rest', exercises: [] },
      { day: 'Thursday', focus: 'Balance', exercises: [] },
      { day: 'Friday', focus: 'Core', exercises: [] },
      { day: 'Saturday', focus: 'Rest', exercises: [] },
      { day: 'Sunday', focus: 'Rest', exercises: [] }
    ]
  }
];

interface CompletionFormExercise {
  exercise_id: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  completed: boolean;
}

interface CompletionForm {
  duration_minutes: number;
  difficulty_rating: number;
  notes: string;
  exercises: CompletionFormExercise[];
}

interface WorkoutExercise {
  exercises: {
    id: string;
    name: string;
    description?: string;
    body_part?: string;
    equipment?: string;
    difficulty_level?: string;
    image_url?: string;
    target?: string;
  };
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  metadata?: any;
}

const Workouts = () => {
  const { user } = useAuth();
  const { refreshProgress } = useProgress();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof workoutPlans[0] | null>(null);
  const [userWorkouts, setUserWorkouts] = useState<any[]>([]);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    description: '',
    exercises: [] as Array<{
      exercise_id: string,
      sets: number,
      reps: number,
      weight?: number,
      duration?: number
    }>
  });
  const [loading, setLoading] = useState(false);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const [activeView, setActiveView] = useState<'all' | 'my'>('all');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Database['public']['Tables']['workouts']['Row'] | null>(null);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [completionForm, setCompletionForm] = useState<CompletionForm>({
    duration_minutes: 30,
    difficulty_rating: 3,
    notes: '',
    exercises: []
  });
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null);
  const [showCompleteBeforeDeleteDialog, setShowCompleteBeforeDeleteDialog] = useState(false);
  const [showCompletionPromptDialog, setShowCompletionPromptDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserWorkouts();
    } else {
      setUserWorkouts([]);
      setLoadingWorkouts(false);
    }
  }, [user, activeView]);

  const fetchUserWorkouts = async () => {
    if (!user) {
      console.log('No user found, skipping workout fetch');
      setUserWorkouts([]);
      setLoadingWorkouts(false);
      return;
    }
    
    try {
      console.log('Fetching workouts for user:', user.id);
      setLoadingWorkouts(true);

      // Check Supabase connection
      const { error: healthCheckError } = await supabase.from('workouts').select('count');
      if (healthCheckError) {
        console.error('Supabase connection error:', healthCheckError);
        throw new Error('Database connection failed');
      }

      const { data: workoutsData, error: workoutsError } = await supabase
        .from('workouts')
        .select(`
          *,
          exercises:user_exercise_logs (count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (workoutsError) {
        console.error('Error fetching workouts:', workoutsError);
        throw workoutsError;
      }
      
      console.log('Fetched workouts:', workoutsData);
      setUserWorkouts(workoutsData || []);
    } catch (error: any) {
      console.error('Error in fetchUserWorkouts:', error);
      const errorMessage = error.message || 'Failed to fetch workouts';
      toast.error(`Error fetching workouts: ${errorMessage}`);
      setUserWorkouts([]); // Reset workouts on error
    } finally {
      setLoadingWorkouts(false);
    }
  };

  // Add a retry mechanism for failed fetches
  const retryFetch = async (attempts = 3) => {
    for (let i = 0; i < attempts; i++) {
      try {
        await fetchUserWorkouts();
        return; // Success, exit the retry loop
      } catch (error) {
        console.error(`Fetch attempt ${i + 1} failed:`, error);
        if (i === attempts - 1) {
          // Last attempt failed
          toast.error('Failed to load workouts after multiple attempts');
        } else {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
    }
  };

  // Add effect to handle tab changes
  useEffect(() => {
    if (activeView === 'my' && user) {
      retryFetch();
    }
  }, [activeView, user]);

  const fetchExercises = async () => {
    try {
      setLoadingExercises(true);
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('name');

      if (error) throw error;
      setExercises(data || []);
    } catch (error: any) {
      toast.error(`Error loading exercises: ${error.message}`);
    } finally {
      setLoadingExercises(false);
    }
  };

  useEffect(() => {
    if (showCreateDialog) {
      fetchExercises();
    }
  }, [showCreateDialog]);

  const handleCreateWorkout = async () => {
    if (!user) {
      toast.error('Please sign in to create a workout');
      return;
    }

    if (!newWorkout.name.trim()) {
      toast.error('Please enter a workout name');
      return;
    }

    try {
      setLoading(true);
      
      // First create the workout
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .insert([
          {
            name: newWorkout.name,
            description: newWorkout.description,
            user_id: user.id
          }
        ])
        .select();

      if (workoutError) throw workoutError;
      
      if (workoutData && workoutData[0] && newWorkout.exercises.length > 0) {
        // Then add the exercises to user_exercise_logs
        const exerciseLogs = newWorkout.exercises.map(exercise => ({
          workout_id: workoutData[0].id,
          exercise_id: exercise.exercise_id,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          duration: exercise.duration,
          user_id: user.id,
          completed_at: new Date().toISOString()
        }));

        const { error: logsError } = await supabase
          .from('user_exercise_logs')
          .insert(exerciseLogs);

        if (logsError) throw logsError;
      }
      
      toast.success('Workout created successfully!');
      setUserWorkouts([...(workoutData || []), ...userWorkouts]);
      setShowCreateDialog(false);
      setNewWorkout({ name: '', description: '', exercises: [] });
    } catch (error: any) {
      toast.error(`Error creating workout: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!user || !selectedPlan) {
      console.log('No user or selected plan:', { user, selectedPlan });
      toast.error('Please sign in to save this plan');
      return;
    }

    try {
      setLoading(true);
      console.log('Saving plan:', selectedPlan);
      // Use week-wise structure: if only 3 days, save only those days
      const weekSchedule = selectedPlan.schedule?.filter(day => (day.exercises && day.exercises.length > 0)) || selectedPlan.schedule || [];
      const { data, error } = await supabase
        .from('workouts')
        .insert([
          {
            name: selectedPlan.name,
            description: selectedPlan.description,
            user_id: user.id,
            metadata: {
              exercise_count: weekSchedule.reduce((acc, day) => acc + (day.exercises ? day.exercises.length : 0), 0),
              last_performed: null,
              total_duration: null,
              workoutsPerWeek: selectedPlan.workoutsPerWeek,
              duration: selectedPlan.duration,
              level: selectedPlan.level,
              imageUrl: selectedPlan.imageUrl,
              schedule: weekSchedule
            }
          }
        ])
        .select();

      if (error) {
        console.error('Error saving plan:', error);
        throw error;
      }

      // Save all exercises for all days in the weekSchedule
      if (data && data[0] && weekSchedule.length > 0) {
        const allExercises = weekSchedule.flatMap((day) =>
          (day.exercises || []).map((exercise) => (
            exercise && typeof exercise === 'object' ? {
              ...exercise,
              day: day.day,
              focus: day.focus
            } : null
          )).filter(Boolean)
        );

        for (const exercise of allExercises) {
          // Check if exercise already exists by name
          const { data: existingExercise } = await supabase
            .from('exercises')
            .select('id')
            .eq('name', exercise.name)
            .single();

          if (!existingExercise) {
            // Generate a new UUID for the exercise
            const exerciseId = crypto.randomUUID();
            const { error: exerciseError } = await supabase
              .from('exercises')
              .insert([{
                id: exerciseId,
                name: exercise.name,
                body_part: exercise.bodyPart || '',
                equipment: exercise.equipment || '',
                difficulty_level: 'intermediate',
                description: typeof exercise.instructions === 'string' ? exercise.instructions : '',
                image_url: exercise.gifUrl || ''
              }]);
            if (exerciseError) throw exerciseError;
            exercise.id = exerciseId;
          } else {
            exercise.id = existingExercise.id;
          }
        }

        // Insert into user_exercise_logs
        const exerciseLogs = allExercises.map(exercise => ({
          workout_id: data[0].id,
          exercise_id: exercise.id,
          sets: exercise.sets || 3,
          reps: exercise.reps || 12,
          user_id: user.id,
          metadata: {
            bodyPart: exercise.bodyPart,
            equipment: exercise.equipment,
            gifUrl: exercise.gifUrl,
            instructions: exercise.instructions,
            day: exercise.day,
            focus: exercise.focus
          }
        }));
        if (exerciseLogs.length > 0) {
          const { error: logsError } = await supabase
            .from('user_exercise_logs')
            .insert(exerciseLogs);
          if (logsError) throw logsError;
        }
      }

      console.log('Plan and exercises saved successfully:', data);
      toast.success(`${selectedPlan.name} plan saved to your workouts!`);
      setUserWorkouts([...(data || []), ...userWorkouts]);
      setShowPlanDialog(false);
      fetchUserWorkouts();
    } catch (error: any) {
      console.error('Error in handleSavePlan:', error);
      toast.error(`Error saving plan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const viewPlan = (plan: typeof workoutPlans[0]) => {
    setSelectedPlan(plan);
    setShowPlanDialog(true);
  };

  const handleAddExercise = () => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, {
        exercise_id: '',
        sets: 3,
        reps: 10,
        weight: undefined,
        duration: undefined
      }]
    }));
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(e => e.exercise_id !== exerciseId)
    }));
  };

  const handleDeleteWorkoutClick = async (workoutId: string) => {
    if (!user) {
      toast.error('Please sign in to delete workouts');
      return;
    }

    try {
      // Check if the workout has any completions
      const { data: completions, error: completionsError } = await supabase
        .from('workout_completions')
        .select('id')
        .eq('workout_id', workoutId)
        .limit(1);

      if (completionsError) throw completionsError;

      if (completions && completions.length > 0) {
        // Workout has been completed, proceed with deletion
        setWorkoutToDelete(workoutId);
        setShowDeleteConfirmDialog(true);
      } else {
        // Workout hasn't been completed, ask user if they want to complete it first
        setWorkoutToDelete(workoutId);
        setShowCompleteBeforeDeleteDialog(true);
      }
    } catch (error: any) {
      console.error('Error checking workout completions:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleDeleteWorkout = async () => {
    if (!user || !workoutToDelete) return;

    try {
      setLoading(true);
      console.log('Starting workout deletion process for workout:', workoutToDelete);

      // Delete the workout - related records will be deleted via ON DELETE CASCADE
      const { error: workoutError } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutToDelete)
        .eq('user_id', user.id);

      if (workoutError) {
        console.error('Error deleting workout:', workoutError);
        throw workoutError;
      }

      console.log('Workout deleted successfully');
      
      // Update local state
      setUserWorkouts(prevWorkouts => prevWorkouts.filter(w => w.id !== workoutToDelete));
      toast.success('Workout deleted successfully');
      
      // Reset states
      setWorkoutToDelete(null);
      setShowDeleteConfirmDialog(false);
      setShowCompleteBeforeDeleteDialog(false);
      
      // Refresh the workouts list to ensure everything is in sync
      await fetchUserWorkouts();
    } catch (error: any) {
      console.error('Error in handleDeleteWorkout:', error);
      toast.error(`Error deleting workout: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteInsteadOfDelete = () => {
    if (!workoutToDelete) return;
    
    // Find the workout details
    const workout = userWorkouts.find(w => w.id === workoutToDelete);
    if (!workout) return;

    // Reset states
    setWorkoutToDelete(null);
    setShowCompleteBeforeDeleteDialog(false);
    
    // Show workout details dialog with completion option
    viewWorkoutDetails(workout);
  };

  const viewWorkoutDetails = async (workout: any) => {
    setSelectedWorkout(workout);
    setShowDetailsDialog(true);
    
    try {
      setLoadingDetails(true);
      // Fetch exercises for this workout with complete information
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('user_exercise_logs')
        .select(`
          exercises (
            id,
            name,
            description,
            body_part,
            equipment,
            difficulty_level,
            image_url,
            target
          ),
          sets,
          reps,
          weight,
          duration,
          metadata
        `)
        .eq('workout_id', workout.id);

      if (exercisesError) throw exercisesError;

      // If no exercises found in user_exercise_logs, try to get them from workout metadata
      if (!exercisesData || exercisesData.length === 0) {
        const { data: workoutData, error: workoutError } = await supabase
          .from('workouts')
          .select('metadata')
          .eq('id', workout.id)
          .single();

        if (workoutError) throw workoutError;

        const metadata = workoutData?.metadata as WorkoutMetadata;
        
        if (metadata?.schedule?.[0]?.exercises) {
          const exercisesFromMetadata = metadata.schedule[0].exercises.map(exercise => ({
            exercises: {
              id: exercise.id || crypto.randomUUID(),
              name: exercise.name,
              body_part: exercise.bodyPart,
              equipment: exercise.equipment,
              target: exercise.target,
              image_url: exercise.gifUrl,
              description: exercise.instructions
            },
            sets: exercise.sets || 3,
            reps: exercise.reps || 12,
            metadata: {
              bodyPart: exercise.bodyPart,
              equipment: exercise.equipment,
              target: exercise.target,
              gifUrl: exercise.gifUrl,
              instructions: exercise.instructions
            }
          }));
          setWorkoutExercises(exercisesFromMetadata);
        } else {
          setWorkoutExercises([]);
        }
      } else {
        setWorkoutExercises(exercisesData);
      }

      // After loading details, check if workout was completed today
      const today = new Date().toISOString().split('T')[0];
      const { data: todayCompletion } = await supabase
        .from('workout_completions')
        .select('id')
        .eq('workout_id', workout.id)
        .eq('user_id', user?.id)
        .gte('completed_at', today)
        .lte('completed_at', today + 'T23:59:59')
        .maybeSingle();

      // If not completed today, ask user after a short delay
      if (!todayCompletion) {
        setTimeout(() => {
          setShowCompletionPromptDialog(true);
        }, 1000);
      }
    } catch (error: any) {
      toast.error(`Error loading workout details: ${error.message}`);
      setWorkoutExercises([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCompleteWorkout = async () => {
    if (!user || !selectedWorkout) return;

    try {
      setLoading(true);

      // First create the workout completion record
      const { data: completionData, error: completionError } = await supabase
        .from('workout_completions')
        .insert({
          user_id: user.id,
          workout_id: selectedWorkout.id,
          duration_minutes: completionForm.duration_minutes,
          difficulty_rating: completionForm.difficulty_rating,
          notes: completionForm.notes || '',
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (completionError) throw completionError;

      // Then log the exercise progress only for completed exercises
      const completedExercises = completionForm.exercises.filter(e => e.completed);
      if (completedExercises.length > 0) {
        const exerciseProgressData = completedExercises.map(exercise => ({
          user_id: user.id,
          exercise_id: exercise.exercise_id,
          workout_completion_id: completionData.id,
          workout_id: selectedWorkout.id,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight || 0,
          duration_seconds: exercise.duration || 0
        }));

        const { error: progressError } = await supabase
          .from('exercise_progress')
          .insert(exerciseProgressData);

        if (progressError) throw progressError;
      }

      // Refresh progress data
      await refreshProgress();

      toast.success('Workout completed successfully!');
      setShowCompletionDialog(false);
      setShowDetailsDialog(false);
    } catch (error: any) {
      toast.error(`Error completing workout: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const initializeCompletionForm = (exercises: WorkoutExercise[]) => {
    setCompletionForm({
      duration_minutes: 30,
      difficulty_rating: 3,
      notes: '',
      exercises: exercises.map(e => ({
        exercise_id: e.exercises.id,
        sets: e.sets,
        reps: e.reps,
        weight: e.weight,
        duration: e.duration,
        completed: true // Default to true, user can uncheck if needed
      }))
    });
  };

  const handleCompletionPromptResponse = (shouldComplete: boolean) => {
    setShowCompletionPromptDialog(false);
    if (shouldComplete) {
      // Initialize completion form with current exercises
      initializeCompletionForm(workoutExercises);
      setShowCompletionDialog(true);
    }
  };

  if (!user) {
  return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Please sign in to access workouts</h2>
          <Button onClick={() => window.location.href = '/auth'}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Workout Programs</h1>
            <p className="text-muted-foreground">Discover and save workout plans or create your own</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </div>
        </div>

      <Tabs defaultValue="all" value={activeView} onValueChange={(v) => setActiveView(v as 'all' | 'my')}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="all">All Programs</TabsTrigger>
          <TabsTrigger value="my">My Workouts</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workoutPlans.map((plan) => (
              <Card key={plan.id} className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={plan.imageUrl} 
                    alt={plan.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {plan.workoutsPerWeek}x/week
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {plan.duration}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Dumbbell className="h-4 w-4 mr-1" />
                      {plan.level}
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => viewPlan(plan)}>
                    View Program
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my">
            {loadingWorkouts ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : userWorkouts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userWorkouts.map((workout) => (
                  <Card key={workout.id}>
                    <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Dumbbell className="h-5 w-5 mr-2" />
                        {workout.name}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteWorkoutClick(workout.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{workout.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Dumbbell className="h-4 w-4 mr-1" />
                        {workout.exercises?.[0]?.count || 0} exercises
                      </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(workout.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    <Button 
                      className="w-full" 
                      onClick={() => viewWorkoutDetails(workout)}
                    >
                      View Details
                    </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-muted/30 rounded-lg">
                <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-bold mb-2">No workouts yet</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Create your own custom workout or save a program to get started on your fitness journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workout
                  </Button>
                  <Button variant="outline" onClick={() => setActiveView('all')}>
                    Browse Programs
                  </Button>
                </div>
              </div>
            )}
        </TabsContent>
      </Tabs>

        {/* Create Workout Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Create New Workout</DialogTitle>
              <DialogDescription>
                Add a new workout to your personal collection.
              </DialogDescription>
            </DialogHeader>
            {/* Make content scrollable */}
            <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-4">
              <div>
                <Label htmlFor="workout-name">Workout Name</Label>
                <Input 
                  id="workout-name" 
                  value={newWorkout.name}
                  onChange={(e) => setNewWorkout({...newWorkout, name: e.target.value})}
                  placeholder="e.g., Upper Body Strength"
                />
              </div>
              
              <div>
                <Label htmlFor="workout-description">Description</Label>
                <Textarea 
                  id="workout-description"
                  value={newWorkout.description}
                  onChange={(e) => setNewWorkout({...newWorkout, description: e.target.value})}
                  placeholder="Describe your workout..."
                  rows={4}
                />
              </div>

            <div>
              <Label>Exercises</Label>
              <div className="mt-2 space-y-4">
                {newWorkout.exercises.map((exercise, index) => (
                  <Card key={index}>
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">Exercise {index + 1}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveExercise(exercise.exercise_id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-4">
                        <div>
                          <Label>Exercise</Label>
                          <Select
                            value={exercise.exercise_id}
                            onValueChange={(value) => {
                              const newExercises = [...newWorkout.exercises];
                              newExercises[index].exercise_id = value;
                              setNewWorkout({...newWorkout, exercises: newExercises});
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an exercise" />
                            </SelectTrigger>
                            <SelectContent>
                              {exercises.map((e) => (
                                <SelectItem key={e.id} value={e.id}>
                                  {e.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Sets</Label>
                            <Input 
                              type="number" 
                              value={exercise.sets}
                              onChange={(e) => {
                                const newExercises = [...newWorkout.exercises];
                                newExercises[index].sets = parseInt(e.target.value);
                                setNewWorkout({...newWorkout, exercises: newExercises});
                              }}
                            />
                          </div>
                          <div>
                            <Label>Reps</Label>
                            <Input 
                              type="number"
                              value={exercise.reps}
                              onChange={(e) => {
                                const newExercises = [...newWorkout.exercises];
                                newExercises[index].reps = parseInt(e.target.value);
                                setNewWorkout({...newWorkout, exercises: newExercises});
                              }}
                            />
                          </div>
                          <div>
                            <Label>Weight (kg)</Label>
                            <Input 
                              type="number"
                              value={exercise.weight || ''}
                              onChange={(e) => {
                                const newExercises = [...newWorkout.exercises];
                                newExercises[index].weight = e.target.value ? parseInt(e.target.value) : undefined;
                                setNewWorkout({...newWorkout, exercises: newExercises});
                              }}
                            />
                          </div>
                          <div>
                            <Label>Duration (seconds)</Label>
                            <Input 
                              type="number"
                              value={exercise.duration || ''}
                              onChange={(e) => {
                                const newExercises = [...newWorkout.exercises];
                                newExercises[index].duration = e.target.value ? parseInt(e.target.value) : undefined;
                                setNewWorkout({...newWorkout, exercises: newExercises});
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleAddExercise}
                >
                  Add Exercise
                </Button>
              </div>
              </div>
            </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateWorkout} 
              disabled={loading || newWorkout.exercises.some(e => !e.exercise_id)}
            >
                {loading ? 'Creating...' : 'Create Workout'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Plan Dialog */}
        <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
            {selectedPlan && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedPlan.name}</DialogTitle>
                  <DialogDescription>
                    {selectedPlan.description}
                  </DialogDescription>
                </DialogHeader>
                {/* Make content scrollable */}
                <div className="flex-1 overflow-y-auto pr-2">
                <div className="space-y-4">
                  <div className="aspect-video w-full overflow-hidden rounded-md">
                    <img 
                      src={selectedPlan.imageUrl} 
                      alt={selectedPlan.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center">
                      <Calendar className="h-6 w-6 mb-2 text-primary" />
                      <span className="text-sm font-medium">{selectedPlan.workoutsPerWeek}x/week</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center">
                      <Clock className="h-6 w-6 mb-2 text-primary" />
                      <span className="text-sm font-medium">{selectedPlan.duration}</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center">
                      <Dumbbell className="h-6 w-6 mb-2 text-primary" />
                      <span className="text-sm font-medium">{selectedPlan.level}</span>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Weekly Schedule</h3>
                    <ul className="space-y-2 text-sm">
                      {selectedPlan.id === 'strength' && (
                        <>
                          <li>Monday: Upper Body</li>
                          <li>Tuesday: Rest</li>
                          <li>Wednesday: Lower Body</li>
                          <li>Thursday: Rest</li>
                          <li>Friday: Full Body</li>
                          <li>Saturday: Active Recovery</li>
                          <li>Sunday: Rest</li>
                        </>
                      )}
                      {selectedPlan.id === 'weight-loss' && (
                        <>
                          <li>Monday: HIIT Cardio</li>
                          <li>Tuesday: Upper Body</li>
                          <li>Wednesday: HIIT Cardio</li>
                          <li>Thursday: Lower Body</li>
                          <li>Friday: HIIT Cardio</li>
                          <li>Saturday: Rest</li>
                          <li>Sunday: Active Recovery</li>
                        </>
                      )}
                      {selectedPlan.id === 'flexibility' && (
                        <>
                          <li>Monday: Upper Body Mobility</li>
                          <li>Tuesday: Rest</li>
                          <li>Wednesday: Lower Body Mobility</li>
                          <li>Thursday: Rest</li>
                          <li>Friday: Full Body Stretching</li>
                          <li>Saturday: Rest</li>
                          <li>Sunday: Rest</li>
                        </>
                      )}
                      {selectedPlan.id === 'hiit' && (
                        <>
                          <li>Monday: HIIT + Upper Body</li>
                          <li>Tuesday: Rest</li>
                          <li>Wednesday: HIIT + Lower Body</li>
                          <li>Thursday: Rest</li>
                          <li>Friday: HIIT + Core</li>
                          <li>Saturday: Active Recovery</li>
                          <li>Sunday: Rest</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowPlanDialog(false)}>Close</Button>
                  <Button onClick={handleSavePlan} disabled={loading || !user}>
                    {loading ? 'Saving...' : 'Save to My Workouts'}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

      {/* Workout Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedWorkout?.name}</DialogTitle>
            <DialogDescription>
              {selectedWorkout?.description || 'No description available'}
            </DialogDescription>
          </DialogHeader>
          {/* Make content scrollable */}
          <div className="flex-1 overflow-y-auto pr-6 -mr-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Exercises:</h4>
              {loadingDetails ? (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
      </div>
              ) :
                (() => {
                  // Group exercises by weekday (metadata.day)
                  const exercisesByDay: { [day: string]: any[] } = {};
                  workoutExercises.forEach((exerciseLog: any) => {
                    const day = exerciseLog.metadata?.day || 'Other';
                    if (!exercisesByDay[day]) exercisesByDay[day] = [];
                    exercisesByDay[day].push(exerciseLog);
                  });
                  const sortedDays = Object.keys(exercisesByDay).sort((a, b) => {
                    // Sort by weekday order if possible
                    const order = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
                    const ia = order.indexOf(a);
                    const ib = order.indexOf(b);
                    if (ia === -1 && ib === -1) return a.localeCompare(b);
                    if (ia === -1) return 1;
                    if (ib === -1) return -1;
                    return ia - ib;
                  });
                  return (
                    <div className="space-y-6">
                      {sortedDays.map(day => (
                        <div key={day}>
                          <h5 className="font-semibold mb-2 text-primary">{day}</h5>
                          <div className="space-y-4">
                            {exercisesByDay[day].map((exerciseLog: any, index: number) => {
                              const exercise = exerciseLog.exercises;
                              if (!exercise) return null;
                              return (
                                <div key={`${exercise.id}-${index}`} className="border rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-semibold">{exercise.name}</h5>
                                    {exercise.image_url && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => window.open(exercise.image_url, '_blank')}
                                      >
                                        View Demo
                                      </Button>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <span className="font-medium">Sets:</span> {exerciseLog.sets || 3}
                                    </div>
                                    <div>
                                      <span className="font-medium">Reps:</span> {exerciseLog.reps || 12}
                                    </div>
                                    {exercise.target && (
                                      <div>
                                        <span className="font-medium">Target:</span> {exercise.target}
                                      </div>
                                    )}
                                    {exercise.equipment && (
                                      <div>
                                        <span className="font-medium">Equipment:</span> {exercise.equipment}
                                      </div>
                                    )}
                                  </div>
                                  {exercise.description && (
                                    <div className="mt-2 text-sm text-muted-foreground">
                                      <span className="font-medium">Instructions:</span>
                                      <p className="mt-1 whitespace-pre-wrap">{exercise.description}</p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()
              }
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 mt-4 border-t">
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
            <Button 
              onClick={() => {
                setShowDetailsDialog(false);
                initializeCompletionForm(workoutExercises);
                setShowCompletionDialog(true);
              }}
              className="bg-primary"
            >
              <Star className="w-4 h-4 mr-2" />
              Complete Workout
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Workout Completion Dialog */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Complete Workout</DialogTitle>
            <DialogDescription>
              Log your completed exercises and rate your workout.
            </DialogDescription>
          </DialogHeader>
          {/* Make content scrollable */}
          <div className="flex-1 overflow-y-auto pr-6 -mr-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Exercises</Label>
                {completionForm.exercises.map((exercise, index) => {
                  const exerciseDetails = workoutExercises.find(
                    e => e.exercises.id === exercise.exercise_id
                  );
                  return (
                    <Card key={`${exercise.exercise_id}-${index}`} className="shadow-sm">
                      <CardHeader className="p-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={exercise.completed}
                            onCheckedChange={(checked) => {
                              const newExercises = [...completionForm.exercises];
                              newExercises[index].completed = checked as boolean;
                              setCompletionForm({
                                ...completionForm,
                                exercises: newExercises
                              });
                            }}
                          />
                          <div>
                            <CardTitle className="text-base">
                              {exerciseDetails?.exercises.name}
                            </CardTitle>
                            <CardDescription>
                              {exercise.sets} sets × {exercise.reps} reps
                              {exercise.weight && ` • ${exercise.weight} kg`}
                              {exercise.duration && ` • ${exercise.duration} sec`}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="mb-2 inline-block">Duration (minutes)</Label>
                  <div className="flex items-center gap-4">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={completionForm.duration_minutes}
                      onChange={(e) => setCompletionForm({
                        ...completionForm,
                        duration_minutes: parseInt(e.target.value)
                      })}
                      min="1"
                      className="w-24"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 inline-block">Difficulty Rating</Label>
                  <div className="flex items-center gap-4">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      value={[completionForm.difficulty_rating]}
                      onValueChange={(value) => setCompletionForm({
                        ...completionForm,
                        difficulty_rating: value[0]
                      })}
                      max={5}
                      min={1}
                      step={1}
                      className="w-[200px]"
                    />
                    <span className="text-sm">{completionForm.difficulty_rating}/5</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={completionForm.notes}
                    onChange={(e) => setCompletionForm({
                      ...completionForm,
                      notes: e.target.value
                    })}
                    placeholder="Add any notes about your workout..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 mt-4 border-t">
            <Button variant="outline" onClick={() => setShowCompletionDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCompleteWorkout}
              disabled={loading || completionForm.exercises.every(e => !e.completed)}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Complete Workout'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Complete Before Delete Dialog */}
      <Dialog open={showCompleteBeforeDeleteDialog} onOpenChange={setShowCompleteBeforeDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Workout?</DialogTitle>
            <DialogDescription>
              This workout hasn't been marked as completed. Would you like to complete it and track your progress before deleting?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleDeleteWorkout()}>
              No, Delete Anyway
            </Button>
            <Button onClick={handleCompleteInsteadOfDelete}>
              Yes, Complete First
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this workout? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteWorkout} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Completion Prompt Dialog */}
      <Dialog open={showCompletionPromptDialog} onOpenChange={setShowCompletionPromptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Did you complete this workout?</DialogTitle>
            <DialogDescription>
              Would you like to log your progress for this workout session?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleCompletionPromptResponse(false)}>
              Not Yet
            </Button>
            <Button onClick={() => handleCompletionPromptResponse(true)}>
              Yes, Log Progress
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Workouts;

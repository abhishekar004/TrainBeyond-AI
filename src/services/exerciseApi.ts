import { toast } from "sonner";

// Custom error types
class APIError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = 'APIError';
  }
}

class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

// API endpoints and keys
console.log('All environment variables:', import.meta.env);
console.log('VITE_RAPIDAPI_KEY value:', import.meta.env.VITE_RAPIDAPI_KEY);
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const EXERCISE_API_URL = "https://exercisedb.p.rapidapi.com/exercises";
const YOUTUBE_API_URL = "https://youtube-v31.p.rapidapi.com";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

// Constants
const MAX_RETRIES = 3;
const TIMEOUT_MS = 10000; // 10 seconds
const RETRY_DELAY_MS = 1000; // 1 second

// Validate environment variables
if (!RAPIDAPI_KEY) {
  throw new Error('RAPIDAPI_KEY is not defined in environment variables');
}

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

// Helper function for timeout
const timeout = (ms: number) => new Promise((_, reject) => 
  setTimeout(() => reject(new TimeoutError(`Request timed out after ${ms}ms`)), ms)
);

// Helper function for retry mechanism
const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delay: number = RETRY_DELAY_MS
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 2);
  }
};

// Helper function for API calls
const fetchWithTimeout = async (url: string, options: RequestInit): Promise<Response> => {
  try {
    const response = await Promise.race([
      fetch(url, options),
      timeout(TIMEOUT_MS)
    ]) as Response;
    
    if (!response.ok) {
      throw new APIError(
        `API request failed with status ${response.status}`,
        response.status,
        response.statusText
      );
    }
    
    return response;
  } catch (error) {
    if (error instanceof TimeoutError) {
      throw error;
    }
    if (!navigator.onLine) {
      throw new NetworkError('No internet connection');
    }
    throw error;
  }
};

// Exercise types
export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
}

// YouTube video type
export interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
    channelTitle: string;
  };
}

// Workout plan type
export interface WorkoutPlan {
  goal: string;
  description: string;
  weeklySchedule: {
    day: string;
    focus: string;
    exercises: Exercise[];
  }[];
  tips: string[];
}

// Fetch exercises from ExerciseDB
export const fetchExercises = async (limit = 10): Promise<Exercise[]> => {
  try {
    const response = await retry(() => 
      fetchWithTimeout(`${EXERCISE_API_URL}?limit=${limit}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      })
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    
    if (error instanceof TimeoutError) {
      toast.error('Request timed out. Please check your connection and try again.');
    } else if (error instanceof NetworkError) {
      toast.error('No internet connection. Please check your network and try again.');
    } else if (error instanceof APIError) {
      toast.error(`Failed to fetch exercises (${error.status}). Please try again later.`);
    } else {
      toast.error('Failed to fetch exercises. Please try again later.');
    }
    
    return [];
  }
};

// Search exercises by body part
export const searchExercisesByBodyPart = async (bodyPart: string, goal?: string): Promise<Exercise[]> => {
  try {
    const response = await retry(() => 
      fetchWithTimeout(`${EXERCISE_API_URL}/bodyPart/${bodyPart}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      })
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching exercises for body part ${bodyPart}:`, error);
    
    if (error instanceof TimeoutError) {
      toast.error('Request timed out. Please check your connection and try again.');
    } else if (error instanceof NetworkError) {
      toast.error('No internet connection. Please check your network and try again.');
    } else if (error instanceof APIError) {
      toast.error(`Failed to fetch exercises for ${bodyPart} (${error.status}). Please try again later.`);
    } else {
      toast.error(`Failed to fetch exercises for ${bodyPart}. Please try again later.`);
    }
    
    return [];
  }
};

// Fetch related videos from YouTube
export const fetchExerciseVideos = async (query: string): Promise<Video[]> => {
  try {
    const response = await retry(() => 
      fetchWithTimeout(`${YOUTUBE_API_URL}/search?q=${query}&part=snippet,id&maxResults=3`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
        }
      })
    );

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching exercise videos:', error);
    
    if (error instanceof TimeoutError) {
      toast.error('Request timed out. Please check your connection and try again.');
    } else if (error instanceof NetworkError) {
      toast.error('No internet connection. Please check your network and try again.');
    } else if (error instanceof APIError) {
      toast.error(`Failed to fetch videos (${error.status}). Please try again later.`);
    } else {
      toast.error('Failed to fetch related videos. Please try again later.');
    }
    
    return [];
  }
};

// Generate workout plan using Gemini AI
export const generateWorkoutPlan = async (
  goal: string, 
  level: string, 
  equipment: string,
  frequency: string,
  preferences: string
): Promise<WorkoutPlan | null> => {
  try {
    const prompt = `
      Create a detailed workout plan for someone with the following parameters:
      - Goal: ${goal}
      - Fitness Level: ${level}
      - Available Equipment: ${equipment}
      - Workout Frequency: ${frequency} days per week
      - Preferences/Limitations: ${preferences}
      
      Format the response as a JSON object with the following structure:
      {
        "goal": "the user's goal",
        "description": "brief description of this plan and why it's effective for the goal",
        "weeklySchedule": [
          {
            "day": "Day 1",
            "focus": "main focus of this day (e.g., Upper Body)",
            "exercises": [
              {
                "name": "exercise name",
                "sets": 3,
                "reps": "8-12",
                "rest": "60 seconds",
                "notes": "form tips or variations"
              }
            ]
          }
        ],
        "tips": ["helpful tips for achieving this goal"]
      }
      
      Focus on exercises that align with the goal, equipment availability, and fitness level.
      Return ONLY the JSON object without ANY additional text or markdown formatting.
    `;

    // Note: The actual implementation would use the Gemini AI API, but for this demo we'll use a simulated response
    // since direct integration isn't possible without proper backend configuration
    const response = await simulateGeminiAPI(goal, level);
    
    if (!response) {
      throw new Error('Failed to generate workout plan');
    }
    
    return response;
  } catch (error) {
    console.error('Error generating workout plan:', error);
    toast.error('Failed to generate workout plan. Please try again later.');
    return null;
  }
};

// Target muscle mappings by workout focus to make plans more specific
const getTargetMusclesByFocus = (focus: string, goal: string): string => {
  // Base mapping for any focus
  const baseMappings: Record<string, string> = {
    'Full Body': 'back',
    'Upper Body': 'upper arms',
    'Lower Body': 'upper legs',
    'Chest & Triceps': 'chest',
    'Back & Biceps': 'back',
    'Shoulders & Arms': 'upper arms',
    'Legs & Core': 'upper legs',
    'Cardio & Core': 'waist',
    'Cardio': 'cardio',
    'Core': 'waist',
    'Mobility & Core': 'waist',
  };
  
  // Goal-specific focus overrides
  if (goal.toLowerCase().includes('weight loss') || goal.toLowerCase().includes('fat loss')) {
    return baseMappings[focus] || 'cardio'; // Default to cardio for weight loss if focus not found
  } else if (goal.toLowerCase().includes('muscle') || goal.toLowerCase().includes('strength')) {
    // For muscle gain, prioritize strength exercises
    const muscleGainMappings: Record<string, string> = {
      'Full Body': 'back',
      'Upper Body': 'chest',
      'Lower Body': 'upper legs',
      'Chest & Triceps': 'chest',
      'Back & Biceps': 'back',
      'Shoulders & Arms': 'upper arms',
      'Legs & Core': 'upper legs',
      'Core': 'waist',
    };
    return muscleGainMappings[focus] || baseMappings[focus] || 'back';
  } else {
    // General fitness - use base mappings
    return baseMappings[focus] || 'back';
  }
};

// This is a simulation of the Gemini AI API response for demo purposes
const simulateGeminiAPI = async (goal: string, level: string): Promise<WorkoutPlan> => {
  // In a real implementation, this would call the Gemini API
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  let plan: WorkoutPlan;
  
  if (goal.toLowerCase().includes('weight loss') || goal.toLowerCase().includes('fat loss')) {
    plan = {
      goal: "Weight Loss",
      description: "This plan combines HIIT (High-Intensity Interval Training) and strength training to maximize calorie burn and boost metabolism, helping you lose fat while preserving muscle mass.",
      weeklySchedule: [
        {
          day: "Monday",
          focus: "Full Body HIIT",
          exercises: []
        },
        {
          day: "Tuesday",
          focus: "Lower Body Strength",
          exercises: []
        },
        {
          day: "Wednesday",
          focus: "Active Recovery",
          exercises: []
        },
        {
          day: "Thursday",
          focus: "Upper Body Strength",
          exercises: []
        },
        {
          day: "Friday",
          focus: "Cardio & Core",
          exercises: []
        }
      ],
      tips: [
        "Maintain a caloric deficit through diet and exercise",
        "Stay hydrated throughout the day",
        "Ensure you're getting adequate protein (1.6-2g per kg of bodyweight)",
        "Focus on sleep quality and stress management",
        "Track your workouts to ensure progressive overload"
      ]
    };
  } else if (goal.toLowerCase().includes('muscle') || goal.toLowerCase().includes('strength')) {
    plan = {
      goal: "Muscle Gain",
      description: "This hypertrophy-focused plan emphasizes progressive overload and adequate volume, targeting all major muscle groups with sufficient frequency to stimulate muscle growth while allowing for recovery.",
      weeklySchedule: [
        {
          day: "Monday",
          focus: "Chest & Triceps",
          exercises: []
        },
        {
          day: "Tuesday",
          focus: "Back & Biceps",
          exercises: []
        },
        {
          day: "Wednesday",
          focus: "Rest Day",
          exercises: []
        },
        {
          day: "Thursday",
          focus: "Legs & Core",
          exercises: []
        },
        {
          day: "Friday",
          focus: "Shoulders & Arms",
          exercises: []
        }
      ],
      tips: [
        "Eat in a caloric surplus (200-300 calories above maintenance)",
        "Consume 1.6-2.2g of protein per kg of bodyweight",
        "Focus on progressive overload by increasing weight or reps",
        "Get 7-9 hours of quality sleep for recovery",
        "Stay hydrated and consider creatine supplementation",
        "Rest at least 48 hours before training the same muscle group again"
      ]
    };
  } else {
    plan = {
      goal: "General Fitness",
      description: "This balanced plan improves overall fitness by incorporating cardio, strength training, and flexibility work. It's designed to enhance cardiovascular health, build functional strength, and improve mobility.",
      weeklySchedule: [
        {
          day: "Monday",
          focus: "Full Body Strength",
          exercises: []
        },
        {
          day: "Tuesday",
          focus: "Cardio",
          exercises: []
        },
        {
          day: "Wednesday",
          focus: "Mobility & Core",
          exercises: []
        },
        {
          day: "Thursday",
          focus: "Upper Body Focus",
          exercises: []
        },
        {
          day: "Friday",
          focus: "Lower Body Focus",
          exercises: []
        }
      ],
      tips: [
        "Focus on form and technique over lifting heavy weights",
        "Aim for balanced nutrition with adequate protein (1.2-1.6g per kg)",
        "Stay consistent with your workout schedule",
        "Incorporate both strength and mobility work",
        "Track your progress to stay motivated",
        "Ensure you're getting adequate sleep and recovery"
      ]
    };
  }
  
  return plan;
};

// Export the getTargetMusclesByFocus function for use in other components
export { getTargetMusclesByFocus };

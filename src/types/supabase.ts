export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          fitness_level: string | null
          weight: number | null
          height: number | null
          age: number | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          fitness_level?: string | null
          weight?: number | null
          height?: number | null
          age?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          fitness_level?: string | null
          weight?: number | null
          height?: number | null
          age?: number | null
        }
      }
      workouts: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          user_id: string
          metadata: {
            exercise_count?: number
            last_performed?: string
            total_duration?: number
            [key: string]: any
          } | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          user_id: string
          metadata?: { [key: string]: any } | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          user_id?: string
          metadata?: { [key: string]: any } | null
        }
      }
      workout_completions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          workout_id: string
          completed_at: string
          duration_minutes: number
          difficulty_rating: number
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          workout_id: string
          completed_at?: string
          duration_minutes: number
          difficulty_rating: number
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          workout_id?: string
          completed_at?: string
          duration_minutes?: number
          difficulty_rating?: number
          notes?: string | null
        }
      }
      exercise_progress: {
        Row: {
          id: string
          created_at: string
          user_id: string
          exercise_id: string
          workout_completion_id: string
          sets: number
          reps: number
          weight: number | null
          duration_seconds: number | null
          recorded_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          exercise_id: string
          workout_completion_id: string
          sets: number
          reps: number
          weight?: number | null
          duration_seconds?: number | null
          recorded_at?: string
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          exercise_id?: string
          workout_completion_id?: string
          sets?: number
          reps?: number
          weight?: number | null
          duration_seconds?: number | null
          recorded_at?: string
          notes?: string | null
        }
      }
      user_exercise_logs: {
        Row: {
          id: string
          workout_id: string
          exercise_id: string
          user_id: string
          sets: number
          reps: number
          weight: number | null
          duration: number | null
          metadata: {
            bodyPart?: string
            equipment?: string
            gifUrl?: string
            instructions?: string[]
            [key: string]: any
          } | null
        }
        Insert: {
          id?: string
          workout_id: string
          exercise_id: string
          user_id: string
          sets: number
          reps: number
          weight?: number | null
          duration?: number | null
          metadata?: {
            bodyPart?: string
            equipment?: string
            gifUrl?: string
            instructions?: string[]
            [key: string]: any
          } | null
        }
        Update: {
          id?: string
          workout_id?: string
          exercise_id?: string
          user_id?: string
          sets?: number
          reps?: number
          weight?: number | null
          duration?: number | null
          metadata?: {
            bodyPart?: string
            equipment?: string
            gifUrl?: string
            instructions?: string[]
            [key: string]: any
          } | null
        }
      }
      exercises: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          body_part: string
          equipment: string | null
          difficulty_level: string
          image_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          body_part: string
          equipment?: string | null
          difficulty_level: string
          image_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          body_part?: string
          equipment?: string | null
          difficulty_level?: string
          image_url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 
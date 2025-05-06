import React, { useState } from 'react';
import { generateWorkoutPlan, WorkoutPlan as WorkoutPlanType } from '@/services/exerciseApi';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { GoalSelection } from '@/components/GoalSelection';
import { PlanOptions } from '@/components/PlanOptions';
import WorkoutPlan from '@/components/WorkoutPlan';
import { Dumbbell } from 'lucide-react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'goal' | 'options' | 'plan'>('goal');
  const [goal, setGoal] = useState<string>('');
  const [plan, setPlan] = useState<WorkoutPlanType | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoalSelect = (selectedGoal: string) => {
    setGoal(selectedGoal);
    setStep('options');
  };

  const handleBack = () => {
    if (step === 'options') {
      setStep('goal');
    } else if (step === 'plan') {
      setStep('options');
    }
  };

  const handleOptionsSubmit = async (options: { 
    level: string; 
    equipment: string; 
    frequency: string; 
    preferences: string;
  }) => {
    setLoading(true);
    try {
      const workoutPlan = await generateWorkoutPlan(
        goal, 
        options.level, 
        options.equipment, 
        options.frequency, 
        options.preferences
      );
      
      if (workoutPlan) {
        setPlan(workoutPlan);
        setStep('plan');
        toast.success("Your personalized workout plan is ready!");
      }
    } catch (error) {
      console.error("Error generating workout plan:", error);
      toast.error("Failed to generate your workout plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSaved = () => {
    toast.success("Plan saved! You can view it in your workouts.");
    navigate('/workouts');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section - Only show on the first step */}
        {step === 'goal' && (
          <div className="workout-gradient text-white py-16 px-4">
            <div className="container mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Your AI-Powered <br className="md:hidden" />Fitness Journey
              </h1>
              <p className="text-xl md:text-2xl max-w-2xl mx-auto">
                Get personalized workout plans designed specifically for your goals, fitness level, and preferences.
              </p>
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl flex flex-col items-center">
              <Dumbbell className="h-12 w-12 text-fitness-primary animate-pulse-slow mb-4" />
              <h3 className="text-xl font-bold mb-2">Creating Your Plan</h3>
              <p className="text-center text-muted-foreground mb-4">
                Our AI is designing your personalized workout routine. This may take a moment...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="workout-gradient h-2.5 rounded-full animate-pulse" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content Based on Step */}
        <div className="py-8">
          {step === 'goal' && (
            <GoalSelection onSelect={handleGoalSelect} />
          )}
          
          {step === 'options' && (
            <div className="flex flex-col items-center">
              <button
                className="mb-4 self-start px-4 py-2 rounded bg-muted hover:bg-muted/70 text-primary font-medium border border-primary transition"
                onClick={handleBack}
                type="button"
              >
                ← Back
              </button>
              <PlanOptions onSelect={handleOptionsSubmit} />
              {loading && (
                <div className="mt-8 flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 animate-bounce" />
                  <span>Generating your personalized plan...</span>
                </div>
              )}
            </div>
          )}
          
          {step === 'plan' && plan && (
            <WorkoutPlan 
              plan={plan} 
              onBack={handleBack}
              onSaved={handlePlanSaved}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

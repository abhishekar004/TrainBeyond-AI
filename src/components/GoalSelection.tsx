import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Scale, Timer, Target } from 'lucide-react';

interface GoalSelectionProps {
  onSelect: (goal: string) => void;
}

const goals = [
  {
    id: 'weight-loss',
    title: 'Weight Loss',
    description: 'Burn fat and improve body composition through cardio and strength training.',
    icon: Scale
  },
  {
    id: 'muscle-gain',
    title: 'Muscle Gain',
    description: 'Build muscle mass and strength through progressive overload training.',
    icon: Dumbbell
  },
  {
    id: 'endurance',
    title: 'Endurance',
    description: 'Improve cardiovascular fitness and stamina through endurance training.',
    icon: Timer
  },
  {
    id: 'general-fitness',
    title: 'General Fitness',
    description: 'Enhance overall fitness and well-being with balanced workouts.',
    icon: Target
  }
];

export function GoalSelection({ onSelect }: GoalSelectionProps) {
  const [selectedGoal, setSelectedGoal] = React.useState<string>("");

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Select Your Goal</h2>
        <p className="text-muted-foreground mb-6">Choose your primary fitness goal to get a personalized workout plan.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const Icon = goal.icon;
            const isSelected = selectedGoal === goal.id;
            
            return (
              <Card 
                key={goal.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  isSelected 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  setSelectedGoal(goal.id);
                  onSelect(goal.id);
                }}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {goal.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

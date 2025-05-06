import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PlanOptionsProps {
  onSelect: (options: { 
    level: string; 
    equipment: string; 
    frequency: string; 
    preferences: string;
  }) => void;
}

export function PlanOptions({ onSelect }: PlanOptionsProps) {
  const [selectedLevel, setSelectedLevel] = React.useState<string>("");
  const [selectedEquipment, setSelectedEquipment] = React.useState<string>("");
  const [selectedFrequency, setSelectedFrequency] = React.useState<string>("");
  const [selectedPreferences, setSelectedPreferences] = React.useState<string>("");

  const handleSubmit = () => {
    if (selectedLevel && selectedEquipment && selectedFrequency && selectedPreferences) {
      onSelect({
        level: selectedLevel,
        equipment: selectedEquipment,
        frequency: selectedFrequency,
        preferences: selectedPreferences
      });
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Choose Your Plan Options</CardTitle>
        <CardDescription>Select your preferences to get a personalized workout plan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Fitness Level</h3>
          <RadioGroup value={selectedLevel} onValueChange={setSelectedLevel}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="beginner" id="beginner" />
              <Label htmlFor="beginner">Beginner</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="intermediate" id="intermediate" />
              <Label htmlFor="intermediate">Intermediate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="advanced" id="advanced" />
              <Label htmlFor="advanced">Advanced</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h3 className="font-medium mb-2">Equipment Available</h3>
          <RadioGroup value={selectedEquipment} onValueChange={setSelectedEquipment}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bodyweight" id="bodyweight" />
              <Label htmlFor="bodyweight">Bodyweight Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="basic" id="basic" />
              <Label htmlFor="basic">Basic Equipment (Dumbbells, Resistance Bands)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="full" id="full" />
              <Label htmlFor="full">Full Gym Access</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h3 className="font-medium mb-2">Workout Frequency</h3>
          <RadioGroup value={selectedFrequency} onValueChange={setSelectedFrequency}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="3" />
              <Label htmlFor="3">3 Days per Week</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="4" />
              <Label htmlFor="4">4 Days per Week</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5" id="5" />
              <Label htmlFor="5">5 Days per Week</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h3 className="font-medium mb-2">Preferences</h3>
          <RadioGroup value={selectedPreferences} onValueChange={setSelectedPreferences}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="strength" id="strength" />
              <Label htmlFor="strength">Strength Focus</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cardio" id="cardio" />
              <Label htmlFor="cardio">Cardio Focus</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="balanced" id="balanced" />
              <Label htmlFor="balanced">Balanced Approach</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedLevel || !selectedEquipment || !selectedFrequency || !selectedPreferences}
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}

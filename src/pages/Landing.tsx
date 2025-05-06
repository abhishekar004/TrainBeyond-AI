import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Dumbbell, Target, LineChart, Brain } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-emerald-500">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 text-center text-white">
        <h1 className="text-5xl font-bold mb-6">Welcome to TrainBeyond AI</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Transcend Your Limits with AI-Powered Fitness Evolution
        </p>
        <Button 
          size="lg" 
          className="bg-white text-blue-600 hover:bg-blue-50"
          onClick={() => navigate('/auth')}
        >
          Get Started <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/10 border-none text-white">
            <CardHeader>
              <Brain className="h-12 w-12 mb-4" />
              <CardTitle>AI-Powered Plans</CardTitle>
            </CardHeader>
            <CardContent>
              Smart workout plans that adapt to your progress and preferences
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-none text-white">
            <CardHeader>
              <Target className="h-12 w-12 mb-4" />
              <CardTitle>Goal-Focused</CardTitle>
            </CardHeader>
            <CardContent>
              Customized workouts aligned with your specific fitness goals
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-none text-white">
            <CardHeader>
              <LineChart className="h-12 w-12 mb-4" />
              <CardTitle>Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              Monitor your improvements and stay motivated with detailed analytics
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-none text-white">
            <CardHeader>
              <Dumbbell className="h-12 w-12 mb-4" />
              <CardTitle>Expert Guidance</CardTitle>
            </CardHeader>
            <CardContent>
              Professional workout techniques and form guidance
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16 text-center text-white">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Fitness Journey?</h2>
        <p className="text-xl mb-8">
          Join TrainBeyond AI today and experience the future of personalized fitness training.
        </p>
        <Button 
          size="lg" 
          variant="outline"
          className="border-white text-white hover:bg-white hover:text-blue-600"
          onClick={() => navigate('/auth')}
        >
          Start Your Journey
        </Button>
      </div>
    </div>
  );
};

export default Landing; 
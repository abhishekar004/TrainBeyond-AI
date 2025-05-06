import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Brain, Sparkles, Target, Zap, Swords, Rocket } from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About TrainBeyond AI</h1>
      
      <div className="text-lg mb-8 space-y-4">
        <p>
          TrainBeyond AI is more than just a fitness app—it's your gateway to transcending limits. 
          We combine cutting-edge AI technology with the spirit of continuous evolution, inspiring you 
          to push beyond conventional boundaries and unlock your true potential.
        </p>
        <p className="text-xl font-semibold italic text-primary">
          Train with Purpose. Powered by AI. Inspired by You.
          </p>
        </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle>The Story Behind Our Name</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Our name draws inspiration from iconic moments in anime and the limitless potential of human evolution:
            </p>
            <ul className="space-y-6 text-muted-foreground">
              <li className="flex items-start space-x-3">
                <Zap className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <span className="font-semibold text-primary">Plus Ultra Spirit</span>
                  <p>Like All Might's "Plus Ultra" from My Hero Academia, we believe in going beyond your perceived limits.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Swords className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <span className="font-semibold text-primary">Surpass Your Limits</span>
                  <p>Inspired by Black Clover's core message, we encourage you to break through every barrier in your fitness journey.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Brain className="h-5 w-5 text-purple-500 flex-shrink-0 mt-1" />
                <div>
                  <span className="font-semibold text-primary">AI-Powered Evolution</span>
                  <p>The fusion of mind and muscle, powered by cutting-edge AI technology to evolve your training experience.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Rocket className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <span className="font-semibold text-primary">Beyond Limitations</span>
                  <p>The word "Beyond" embodies our commitment to helping you achieve what lies past your current horizons.</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle>What Makes Us Special</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                <span><strong>Train</strong> - Focused, purposeful workouts tailored to your journey</span>
              </li>
              <li className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <span><strong>Beyond</strong> - Push past limits, achieve the extraordinary</span>
              </li>
              <li className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <span><strong>AI</strong> - Cutting-edge technology adapting to your progress</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To empower individuals to surpass their limits through AI-powered personalized fitness guidance. 
              Like the spirit of "Plus Ultra" and the determination to "Surpass Your Limits," 
              we believe in the extraordinary potential within every person.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 text-muted-foreground">
              <li>• Share your aspirations and current limits</li>
              <li>• Receive an AI-crafted path to transcendence</li>
              <li>• Track your evolution and adapt your journey</li>
              <li>• Break through barriers with intelligent guidance</li>
          </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;

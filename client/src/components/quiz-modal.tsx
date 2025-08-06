import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timer, Brain, Shuffle, X } from "lucide-react";
import { useLocation } from "wouter";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  grade: string;
}

const quizModes = [
  {
    id: "timed",
    name: "Timed Quiz",
    description: "Race against the clock!",
    icon: Timer,
    color: "from-coral to-pink",
    timeLimit: "5 minutes",
    features: ["Fast-paced", "Score multiplier", "Leaderboard"]
  },
  {
    id: "untimed",
    name: "Practice Quiz", 
    description: "Take your time to learn",
    icon: Brain,
    color: "from-turquoise to-mint",
    timeLimit: "No limit",
    features: ["No pressure", "Instant feedback", "Learn mode"]
  },
  {
    id: "mixed",
    name: "Mixed Review",
    description: "Questions from all subjects",
    icon: Shuffle,
    color: "from-sky to-blue-500",
    timeLimit: "10 minutes",
    features: ["All subjects", "Adaptive difficulty", "Comprehensive"]
  }
];

export default function QuizModal({ isOpen, onClose, grade }: QuizModalProps) {
  const [, setLocation] = useLocation();

  const handleQuizStart = (mode: string) => {
    onClose();
    setLocation(`/quiz?mode=${mode}&grade=${grade}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-gray-800">
              Choose Quiz Mode
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center mb-4">
            <Badge variant="outline" className="text-sm text-gray-800 border-gray-300">
              Grade {grade} • Ready to test your knowledge?
            </Badge>
          </div>

          {quizModes.map((mode) => {
            const IconComponent = mode.icon;
            
            return (
              <Card
                key={mode.id}
                className={`cursor-pointer transform hover:scale-105 transition-all duration-300 bg-gradient-to-r ${mode.color} text-white shadow-lg hover:shadow-xl`}
                onClick={() => handleQuizStart(mode.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{mode.name}</h3>
                      <p className="text-sm opacity-90">{mode.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Time Limit:</span>
                      <Badge variant="secondary" className="bg-white bg-opacity-20 text-white">
                        {mode.timeLimit}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {mode.features.map((feature, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Recent Quiz Scores */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Quiz Scores</h4>
            <div className="space-y-2">
              {[
                { subject: "Math", score: 92, grade: grade },
                { subject: "Science", score: 88, grade: grade },
                { subject: "Vocabulary", score: 95, grade: grade }
              ].map((quiz, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{quiz.subject} • Grade {quiz.grade}</span>
                  <Badge 
                    variant="outline"
                    className={quiz.score >= 90 ? 'border-green-500 text-green-600' : 'border-blue-500 text-blue-600'}
                  >
                    {quiz.score}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

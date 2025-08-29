import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Brain, BookOpen, Lightbulb, MessageCircle } from "lucide-react";
import { StudyBuddyChat } from "@/components/study-buddy-chat";
import { PremiumGate } from "@/components/premium-gate";
import { motion } from "framer-motion";

export function StudyBuddyPage() {
  const [, setLocation] = useLocation();
  const [currentSubject, setCurrentSubject] = useState<string>("math");
  const [currentGrade, setCurrentGrade] = useState<string>("3");
  const [showChat, setShowChat] = useState(false);

  const subjects = [
    { id: "math", name: "Math", icon: "🔢", color: "from-blue-400 to-blue-600" },
    { id: "vocabulary", name: "Vocabulary", icon: "📚", color: "from-green-400 to-green-600" },
    { id: "science", name: "Science", icon: "🔬", color: "from-purple-400 to-purple-600" },
    { id: "geography", name: "Geography", icon: "🌍", color: "from-orange-400 to-orange-600" },
    { id: "history", name: "History", icon: "📜", color: "from-red-400 to-red-600" },
  ];

  const grades = ["K", "1", "2", "3", "4", "5", "6", "7", "8"];

  if (showChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <PremiumGate feature="ai_study_buddy">
            <StudyBuddyChat
              currentSubject={currentSubject}
              currentGrade={currentGrade}
              onClose={() => setShowChat(false)}
            />
          </PremiumGate>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Main Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src="/attached_assets/FlashTastic Icon_1754739615841.jpg"
              alt="FlashTastic Icon" 
              className="w-16 h-16 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IiMwMEQ0RkYiLz4KPHR5ZXh0IHg9IjMyIiB5PSI0NCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZUPC90ZXh0Pgo8L3N2Zz4K';
              }}
            />
            <img 
              src="/attached_assets/FlashTastic Logo-1_1754739615840.jpg"
              alt="FlashTastic Logo" 
              className="h-12 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjQ4IiB2aWV3Qm94PSIwIDAgMjAwIDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8dGV4dCB4PSIxMDAiIHk9IjM2IiBmb250LWZhbWlseT0iQXJpYWwgQmxhY2siIGZvbnQtc2l6ZT0iMzIiIGZvbnQtd2VpZ2h0PSI5MDAiIGZpbGw9IiMwMEQ0RkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZsYXNoVGFzdGljPC90ZXh0Pgo8L3N2Zz4K';
              }}
            />
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-700 to-purple-600 rounded-full text-white">
              <Brain className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">AI Study Buddy</h1>
              <p className="text-gray-600">Your personal learning companion</p>
            </div>
          </div>
        </motion.div>

        {/* Setup Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Subject Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Choose Your Subject
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {subjects.map((subject) => (
                <Button
                  key={subject.id}
                  variant={currentSubject === subject.id ? "default" : "outline"}
                  className={`w-full justify-start gap-3 ${
                    currentSubject === subject.id
                      ? `bg-gradient-to-r ${subject.color} text-white`
                      : ""
                  }`}
                  onClick={() => setCurrentSubject(subject.id)}
                >
                  <span className="text-lg">{subject.icon}</span>
                  {subject.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Grade Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Select Your Grade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {grades.map((grade) => (
                  <Button
                    key={grade}
                    variant={currentGrade === grade ? "default" : "outline"}
                    className={
                      currentGrade === grade
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : ""
                    }
                    onClick={() => setCurrentGrade(grade)}
                  >
                    Grade {grade}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Ask Questions</h3>
              <p className="text-sm text-gray-600">
                Get instant explanations for any concept you're learning
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Practice Together</h3>
              <p className="text-sm text-gray-600">
                Work through problems step-by-step with AI guidance
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lightbulb className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Study Tips</h3>
              <p className="text-sm text-gray-600">
                Get personalized tips to improve your learning
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Start Chat Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={() => setShowChat(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg"
          >
            <Brain className="h-6 w-6 mr-2" />
            Start Learning with AI Buddy
          </Button>
          <p className="text-sm text-gray-600 mt-2">
            Ready to chat about {subjects.find(s => s.id === currentSubject)?.name} for Grade {currentGrade}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
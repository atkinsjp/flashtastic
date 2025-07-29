import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Timer, Clock, Zap, Brain, RotateCcw } from "lucide-react";
import GradeSelector from "@/components/grade-selector";
import type { FlashCard } from "@shared/schema";

type QuizMode = "timed" | "untimed" | "mixed" | null;

export default function Quiz() {
  const [selectedGrade, setSelectedGrade] = useState("2");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [quizMode, setQuizMode] = useState<QuizMode>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes for timed quiz
  const [quizCompleted, setQuizCompleted] = useState(false);

  const { data: flashCards = [] } = useQuery<FlashCard[]>({
    queryKey: ["/api/flashcards", selectedGrade, selectedSubject || "mixed"],
    enabled: !!selectedSubject || quizMode === "mixed",
  });

  const subjects = [
    { id: "vocabulary", name: "Vocabulary", icon: "📚", color: "bg-coral" },
    { id: "math", name: "Math", icon: "🔢", color: "bg-turquoise" },
    { id: "science", name: "Science", icon: "🔬", color: "bg-sky" },
    { id: "geography", name: "Geography", icon: "🌍", color: "bg-golden" },
    { id: "history", name: "History", icon: "🏛️", color: "bg-purple-500" },
    { id: "biology", name: "Biology", icon: "🌱", color: "bg-green-500" },
    { id: "health", name: "Health", icon: "❤️", color: "bg-red-500" },
    { id: "music", name: "Music", icon: "🎵", color: "bg-indigo-500" },
  ];

  const quizModes = [
    {
      id: "timed",
      name: "Timed Quiz",
      description: "Race against the clock!",
      icon: Timer,
      color: "from-coral to-pink",
      timeLimit: "5 minutes"
    },
    {
      id: "untimed",
      name: "Practice Quiz", 
      description: "Take your time to learn",
      icon: Brain,
      color: "from-turquoise to-mint",
      timeLimit: "No limit"
    },
    {
      id: "mixed",
      name: "Mixed Review",
      description: "Questions from all subjects",
      icon: RotateCcw,
      color: "from-sky to-blue-500",
      timeLimit: "10 minutes"
    }
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (!flashCards || flashCards.length === 0) return;
    
    // Check if answer is correct (simplified logic)
    const currentCard = flashCards[currentQuestion];
    if (selectedAnswer === currentCard?.answer) {
      setScore(score + 1);
    }

    if (currentQuestion < flashCards.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(300);
    setQuizCompleted(false);
    setQuizMode(null);
    setSelectedSubject(null);
  };

  // Mode selection screen
  if (!quizMode) {
    return (
      <div className="min-h-screen p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Mode</h1>
            <p className="text-gray-600">Choose your quiz type to get started</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {quizModes.map((mode) => {
              const IconComponent = mode.icon;
              return (
                <Card
                  key={mode.id}
                  className={`cursor-pointer transform hover:scale-105 transition-all duration-300 bg-gradient-to-br ${mode.color} text-white shadow-lg hover:shadow-xl`}
                  onClick={() => setQuizMode(mode.id as QuizMode)}
                >
                  <CardContent className="p-8 text-center bg-[#9c4af77d]">
                    <IconComponent className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-[#000000]">{mode.name}</h3>
                    <p className="text-sm opacity-90 mb-4 text-[#000000]">{mode.description}</p>
                    <Badge variant="secondary" className="text-[#000000] bg-[#f5d4ff9e]">
                      {mode.timeLimit}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Quiz Scores</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-turquoise to-mint text-white">
                <CardContent className="p-4 text-[#000000] bg-[#3b97d9d1]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#000000]">Math Quiz</p>
                      <p className="text-sm opacity-80 text-[#000000]">Grade 2</p>
                    </div>
                    <Badge className="text-[#000000] bg-[#ffffff80]">92%</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-sky to-blue-500 text-white">
                <CardContent className="p-4 bg-[#41d14196] text-[#000000]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#000000]">Science Quiz</p>
                      <p className="text-sm opacity-80 text-[#000000]">Grade 2</p>
                    </div>
                    <Badge className="text-[#000000] bg-[#b8ffc6d6]">88%</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-coral to-pink text-white">
                <CardContent className="p-4 bg-[#ff001d91]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#000000]">Vocabulary</p>
                      <p className="text-sm opacity-80 text-[#000000]">Grade 2</p>
                    </div>
                    <Badge className="text-[#000000] bg-[#ffa8a8c2]">95%</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Subject selection for non-mixed quizzes
  if (quizMode && quizMode !== "mixed" && !selectedSubject) {
    return (
      <div className="min-h-screen p-4">
        <div className="container mx-auto max-w-4xl">
          <Button 
            variant="outline" 
            onClick={() => setQuizMode(null)}
            className="mb-6"
          >
            ← Back to Quiz Modes
          </Button>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {quizModes.find(m => m.id === quizMode)?.name}
            </h1>
            <p className="text-gray-600">Select your grade level and subject</p>
          </div>

          <GradeSelector
            selectedGrade={selectedGrade}
            onGradeSelect={setSelectedGrade}
          />

          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Choose Your Subject</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {subjects.map((subject) => (
                <Card
                  key={subject.id}
                  className={`cursor-pointer transform hover:scale-105 transition-all duration-300 ${subject.color} text-white shadow-lg hover:shadow-xl`}
                  onClick={() => setSelectedSubject(subject.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-2">{subject.icon}</div>
                    <h4 className="font-bold">{subject.name}</h4>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz completed screen
  if (quizCompleted) {
    const percentage = flashCards.length > 0 ? Math.round((score / flashCards.length) * 100) : 0;
    const isGoodScore = percentage >= 80;

    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Quiz Complete! 🎉</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className={`text-6xl font-bold ${isGoodScore ? 'text-green-500' : 'text-orange-500'}`}>
              {percentage}%
            </div>
            
            <div className="space-y-2">
              <p className="text-lg">
                You got <span className="font-bold text-green-600">{score}</span> out of{" "}
                <span className="font-bold">{flashCards.length}</span> correct!
              </p>
              
              {isGoodScore ? (
                <p className="text-green-600 font-semibold">Excellent work! 🌟</p>
              ) : (
                <p className="text-orange-600 font-semibold">Keep practicing! 💪</p>
              )}
            </div>

            <div className="space-y-3">
              <Button onClick={resetQuiz} className="w-full bg-coral hover:bg-coral/90">
                Take Another Quiz
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/study"} className="w-full">
                Study More Cards
              </Button>
            </div>

            <div className="text-sm text-gray-600">
              <p>+{score * 10} points earned!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active quiz screen
  const currentCard = flashCards[currentQuestion] || null;
  const progress = flashCards.length > 0 ? ((currentQuestion + 1) / flashCards.length) * 100 : 0;

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Quiz Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">
              Question {currentQuestion + 1} of {flashCards.length}
            </Badge>
            
            {quizMode === "timed" && (
              <div className="flex items-center space-x-2 bg-red-100 text-red-700 px-3 py-1 rounded-full">
                <Clock className="h-4 w-4" />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
          
          <Progress value={progress} className="w-full mb-4" />
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Score: {score}/{currentQuestion + 1}</span>
            <span>{Math.round((score / (currentQuestion + 1)) * 100) || 0}% correct</span>
          </div>
        </div>

        {/* Question Card */}
        {currentCard && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">{currentCard.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentCard.imageUrl && (
                <img 
                  src={currentCard.imageUrl}
                  alt="Question illustration"
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              
              {/* Answer options (simplified - in real app would have multiple choice) */}
              <div className="space-y-3">
                <Button
                  variant={selectedAnswer === currentCard.answer ? "default" : "outline"}
                  className="w-full text-left justify-start"
                  onClick={() => handleAnswerSelect(currentCard.answer)}
                >
                  A) {currentCard.answer}
                </Button>
                
                {/* Add more dummy options for multiple choice */}
                <Button
                  variant={selectedAnswer === "wrong1" ? "default" : "outline"}
                  className="w-full text-left justify-start"
                  onClick={() => handleAnswerSelect("wrong1")}
                >
                  B) Alternative answer
                </Button>
                
                <Button
                  variant={selectedAnswer === "wrong2" ? "default" : "outline"}
                  className="w-full text-left justify-start"
                  onClick={() => handleAnswerSelect("wrong2")}
                >
                  C) Another option
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Button */}
        <Button 
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
          className="w-full bg-turquoise hover:bg-turquoise/90 text-lg py-3"
        >
          {currentQuestion === (flashCards.length || 1) - 1 ? "Finish Quiz" : "Next Question"} →
        </Button>
      </div>
    </div>
  );
}

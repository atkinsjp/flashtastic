import { useState, useEffect } from "react";
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
  const [quizStarted, setQuizStarted] = useState(false);
  const [questionChoices, setQuestionChoices] = useState<Record<number, string[]>>({});

  const { data: flashCards = [], isLoading, isError } = useQuery<FlashCard[]>({
    queryKey: [`/api/flashcards?grade=${selectedGrade}&subject=${selectedSubject || "mixed"}`],
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

  const generateChoices = (correctAnswer: string, allCards: FlashCard[]) => {
    // Get 3 random wrong answers from other cards
    const wrongAnswers = allCards
      .filter(card => card.answer !== correctAnswer)
      .map(card => card.answer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    // Combine correct and wrong answers, then shuffle
    const allChoices = [correctAnswer, ...wrongAnswers];
    return allChoices.sort(() => Math.random() - 0.5);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (!flashCards || flashCards.length === 0) return;
    
    // Check if answer is correct
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
    setQuizStarted(false);
    setQuizMode(null);
    setSelectedSubject(null);
    setQuestionChoices({});
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
    
    // Pre-generate all answer choices to prevent randomization during quiz
    const choices: Record<number, string[]> = {};
    flashCards.forEach((card, index) => {
      choices[index] = generateChoices(card.answer, flashCards);
    });
    setQuestionChoices(choices);
    
    // Set appropriate time limit based on quiz mode
    if (quizMode === "timed") {
      setTimeLeft(300); // 5 minutes
    } else if (quizMode === "mixed") {
      setTimeLeft(600); // 10 minutes
    }
  };

  // Timer effect for timed quizzes
  useEffect(() => {
    if (quizStarted && !quizCompleted && (quizMode === "timed" || quizMode === "mixed")) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setQuizCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, quizCompleted, quizMode]);

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
                  onClick={() => {
                    setQuizMode(mode.id as QuizMode);
                    if (mode.id === "mixed") {
                      setSelectedSubject("mixed");
                    }
                  }}
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

  // Loading state for mixed quiz or when fetching flashcards
  if ((selectedSubject || quizMode === "mixed") && isLoading && !quizStarted && !quizCompleted) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Quiz...</h3>
            <p className="text-gray-600">Preparing your {quizMode === "mixed" ? "mixed review" : "quiz"} questions</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state 
  if ((selectedSubject || quizMode === "mixed") && isError && !quizStarted && !quizCompleted) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Quiz</h3>
            <p className="text-gray-600 mb-4">Unable to load flashcards for this quiz.</p>
            <Button onClick={() => {
              setQuizMode(null);
              setSelectedSubject(null);
            }} className="w-full">
              ← Back to Selection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No flashcards available
  if ((selectedSubject || quizMode === "mixed") && !isLoading && !isError && flashCards.length === 0 && !quizStarted && !quizCompleted) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold text-yellow-600 mb-2">No Questions Available</h3>
            <p className="text-gray-600 mb-4">
              No flashcards found for {quizMode === "mixed" ? "mixed review" : `${subjects.find(s => s.id === selectedSubject)?.name} in grade ${selectedGrade}`}.
            </p>
            <Button onClick={() => {
              if (quizMode === "mixed") {
                setQuizMode(null);
                setSelectedSubject(null);
              } else {
                setSelectedSubject(null);
              }
            }} className="w-full">
              ← Back to Selection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz start screen (when cards are loaded but quiz hasn't started)
  if ((selectedSubject || quizMode === "mixed") && flashCards.length > 0 && !quizStarted && !quizCompleted) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ready to Start Quiz! 🎯</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {quizModes.find(m => m.id === quizMode)?.name}
                </h3>
                <p className="text-gray-600">
                  {quizMode === "mixed" ? "All subjects" : subjects.find(s => s.id === selectedSubject)?.name} • Grade {selectedGrade}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">Quiz Details:</p>
                <div className="space-y-1 text-sm">
                  <p>📝 {flashCards.length} questions</p>
                  <p>⏱️ {quizMode === "timed" ? "5 minutes" : quizMode === "mixed" ? "10 minutes" : "No time limit"}</p>
                  <p>🎯 Get 80%+ for an excellent score!</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={startQuiz} className="w-full bg-coral hover:bg-coral/90 text-lg py-3">
                Start Quiz 🚀
              </Button>
              <Button variant="outline" onClick={() => {
                if (quizMode === "mixed") {
                  setQuizMode(null);
                } else {
                  setSelectedSubject(null);
                }
              }} className="w-full">
                ← Back to Selection
              </Button>
            </div>
          </CardContent>
        </Card>
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

  // Active quiz screen (only show if quiz has started and we have flashcards)
  if (quizStarted && flashCards.length > 0) {
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
          <Card className="mb-6 bg-white border-2 border-gray-300 shadow-lg">
            <CardHeader className="bg-red-500 text-white p-6">
              <CardTitle className="text-xl font-bold text-white">{currentCard.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white p-6">
              {currentCard.imageUrl && (
                <img 
                  src={currentCard.imageUrl}
                  alt="Question illustration"
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              
              {/* Multiple choice options with stable correct answer position */}
              <div className="space-y-3">
                {(questionChoices[currentQuestion] || []).map((choice, index) => (
                  <Button
                    key={`${currentQuestion}-${index}`}
                    variant="outline"
                    className={`w-full text-left justify-start p-4 text-lg font-semibold border-2 transition-all duration-200 ${
                      selectedAnswer === choice 
                        ? "!bg-red-500 !text-white !border-red-500 hover:!bg-red-600" 
                        : "!bg-gray-100 !text-black !border-gray-400 hover:!bg-gray-200"
                    }`}
                    onClick={() => handleAnswerSelect(choice)}
                  >
                    <span className={`font-bold mr-3 ${selectedAnswer === choice ? "!text-white" : "!text-black"}`}>
                      {String.fromCharCode(65 + index)})
                    </span>
                    <span className={selectedAnswer === choice ? "!text-white" : "!text-black"}>{choice}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Button */}
        <Button 
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
          className="w-full bg-turquoise hover:bg-turquoise/90 text-white font-bold text-lg py-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestion === (flashCards.length || 1) - 1 ? "Finish Quiz" : "Next Question"} →
        </Button>
      </div>
    </div>
    );
  }

  // Default fallback - should not reach here
  return null;
}

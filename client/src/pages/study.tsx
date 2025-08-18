import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import FlashCard from "@/components/flash-card";
import LearningPath from "@/components/learning-path";
import GradeSelector from "@/components/grade-selector";
import AvatarProgressWidget from "@/components/avatar-progress-widget";
import { useMilestoneTracker } from "@/hooks/use-milestone-tracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Target, Map, Brain, Zap } from "lucide-react";

// Mock user data for study session
const mockStudentData = {
  points: 1247,
  level: 5,
  streak: 7,
  avatarGrowth: {
    stage: 3,
    experience: 324,
    unlocks: ["glasses", "hat"],
    accessories: ["glasses"],
    mood: "focused"
  }
};

export default function Study() {
  const [, setLocation] = useLocation();
  const [selectedGrade, setSelectedGrade] = useState("2");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [avatarGrowth, setAvatarGrowth] = useState(mockStudentData.avatarGrowth);
  const [studyMode, setStudyMode] = useState<'flashcard' | 'quiz' | 'review' | 'learning-path'>('flashcard');
  const [learningStyle, setLearningStyle] = useState<'self-paced' | 'interactive' | 'visual'>('self-paced');
  const [isInLearningPath, setIsInLearningPath] = useState(false);
  const [studySession, setStudySession] = useState({ startTime: Date.now(), cardsCompleted: 0 });
  const { checkForMilestones } = useMilestoneTracker();

  const { data: flashCards, isLoading } = useQuery({
    queryKey: [`/api/flashcards?grade=${selectedGrade}&subject=${selectedSubject}`],
    enabled: !!selectedSubject,
  });

  // Ensure flashCards is properly typed as an array
  const cardArray = Array.isArray(flashCards) ? flashCards : [];

  const subjects = [
    { id: "vocabulary", name: "Vocabulary", icon: "📚", color: "from-coral to-pink" },
    { id: "math", name: "Math", icon: "🔢", color: "from-turquoise to-mint" },
    { id: "science", name: "Science", icon: "🔬", color: "from-sky to-blue-500" },
    { id: "geography", name: "Geography", icon: "🌍", color: "from-golden to-yellow-500" },
    { id: "history", name: "History", icon: "🏛️", color: "from-purple-500 to-pink" },
    { id: "biology", name: "Biology", icon: "🌱", color: "from-green-500 to-mint" },
    { id: "health", name: "Health", icon: "❤️", color: "from-red-500 to-coral" },
    { id: "music", name: "Music", icon: "🎵", color: "from-indigo-500 to-purple-600" },
  ];

  const handleCardComplete = async (correct: boolean) => {
    const newCardsCompleted = studySession.cardsCompleted + 1;
    setStudySession(prev => ({ ...prev, cardsCompleted: newCardsCompleted }));
    
    // Trigger milestone check for flashcard practice
    await checkForMilestones({
      type: 'flashcard_practice',
      subject: selectedSubject || 'mixed',
      grade: selectedGrade,
      pointsEarned: correct ? 10 : 5,
      correctAnswers: correct ? 1 : 0,
      totalQuestions: 1,
    });
    
    if (cardArray.length > 0 && currentCardIndex < cardArray.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // Session complete - trigger study session milestone
      const sessionDuration = Math.round((Date.now() - studySession.startTime) / 60000); // minutes
      await checkForMilestones({
        type: 'study_session',
        subject: selectedSubject || 'mixed',
        grade: selectedGrade,
        pointsEarned: newCardsCompleted * 8,
        timeSpent: sessionDuration,
        correctAnswers: newCardsCompleted, // Approximate
        totalQuestions: newCardsCompleted,
      });
      
      setCurrentCardIndex(0);
      setSelectedSubject(null);
      setStudySession({ startTime: Date.now(), cardsCompleted: 0 });
    }
  };

  const handleLearningPathComplete = async (score: number) => {
    // Trigger milestone for learning path completion
    await checkForMilestones({
      type: 'study_session',
      subject: selectedSubject || 'mixed',
      grade: selectedGrade,
      score: score,
      pointsEarned: Math.round(score * 2),
      timeSpent: Math.round((Date.now() - studySession.startTime) / 60000),
    });
    
    setIsInLearningPath(false);
    setSelectedSubject(null);
    setCurrentCardIndex(0);
    setStudySession({ startTime: Date.now(), cardsCompleted: 0 });
  };

  const handleExitLearningPath = () => {
    setIsInLearningPath(false);
    setSelectedSubject(null);
  };

  // If user is in learning path mode, render the learning path component
  if (isInLearningPath && selectedSubject && cardArray.length > 0) {
    return (
      <LearningPath
        flashCards={cardArray}
        onComplete={handleLearningPathComplete}
        onExit={handleExitLearningPath}
      />
    );
  }

  if (!selectedSubject) {
    return (
      <div className="min-h-screen p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Study Mode</h1>
            <p className="text-gray-600">Choose your grade level and subject to start studying</p>
          </div>

          <GradeSelector
            selectedGrade={selectedGrade}
            onGradeSelect={setSelectedGrade}
          />

          {/* Study Mode Selection */}
          <div className="mt-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Choose Your Study Experience</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card 
                className="cursor-pointer transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl border-4 border-transparent hover:border-white"
                onClick={() => {
                  setStudyMode('learning-path');
                }}
              >
                <CardContent className="p-6 text-center">
                  <Map className="h-12 w-12 mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-2">Interactive Learning Path</h4>
                  <p className="text-blue-100 mb-4">
                    Follow a guided journey through Foundation → Practice → Challenge → Mastery
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <Brain className="h-4 w-4" />
                    <span>Adaptive</span>
                    <Zap className="h-4 w-4 ml-2" />
                    <span>Animated</span>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-500 to-teal-600 text-white shadow-lg hover:shadow-xl border-4 border-transparent hover:border-white"
                onClick={() => {
                  setStudyMode('flashcard');
                }}
              >
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-2">Traditional Flash Cards</h4>
                  <p className="text-green-100 mb-4">
                    Classic flashcard experience with flip animations and progress tracking
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Self-paced</span>
                    <Target className="h-4 w-4 ml-2" />
                    <span>Focus</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Choose Your Subject</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subjects.map((subject) => (
                <Card
                  key={subject.id}
                  className={`cursor-pointer transform hover:scale-105 transition-all duration-300 bg-gradient-to-br ${subject.color} text-white shadow-lg hover:shadow-xl`}
                  onClick={() => {
                    setSelectedSubject(subject.id);
                    if (studyMode === 'learning-path') {
                      setIsInLearningPath(true);
                    }
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{subject.icon}</div>
                    <h4 className="text-lg font-bold mb-2 text-[#000000] drop-shadow-md">{subject.name}</h4>
                    <Badge variant="secondary" className="bg-white/90 text-[#000000] font-bold border border-gray-800/20">
                      Grade {selectedGrade}
                    </Badge>
                    {studyMode === 'learning-path' && (
                      <Badge className="mt-2 bg-purple-600 text-white">
                        Learning Path Mode
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flash cards...</p>
        </div>
      </div>
    );
  }

  const currentCard = cardArray[currentCardIndex] || null;
  const progress = cardArray.length > 0 ? ((currentCardIndex + 1) / cardArray.length) * 100 : 0;

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="outline" 
              onClick={() => setSelectedSubject(null)}
              className="mb-2"
            >
              ← Back to Subjects
            </Button>
            <Badge variant="secondary">
              {currentCardIndex + 1} of {cardArray.length}
            </Badge>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {subjects.find(s => s.id === selectedSubject)?.name} - Grade {selectedGrade}
          </h1>
          
          <Progress value={progress} className="w-full mb-4" />
        </div>

        {/* Study Session Stats with Avatar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="h-6 w-6 mx-auto mb-2 text-coral" />
              <div className="text-sm text-gray-600">Cards Left</div>
              <div className="text-lg font-bold">{cardArray.length - currentCardIndex}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 mx-auto mb-2 text-turquoise" />
              <div className="text-sm text-gray-600">Accuracy</div>
              <div className="text-lg font-bold">85%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-sky" />
              <div className="text-sm text-gray-600">Time</div>
              <div className="text-lg font-bold">12:34</div>
            </CardContent>
          </Card>

          {/* Learning Avatar Widget */}
          <Card>
            <CardContent className="p-2 text-center">
              <AvatarProgressWidget
                points={mockStudentData.points}
                level={mockStudentData.level}
                streak={mockStudentData.streak}
                avatarGrowth={avatarGrowth}
                onGrowthUpdate={setAvatarGrowth}
                size="sm"
                showDetails={false}
              />
              <div className="text-xs text-gray-600 mt-1">Companion</div>
            </CardContent>
          </Card>
        </div>

        {/* Flash Card */}
        {currentCard && (
          <FlashCard
            card={currentCard}
            onComplete={handleCardComplete}
          />
        )}

        {/* Study Mode Options */}
        <div className="mt-8">
          <Tabs value={studyMode} onValueChange={(value) => setStudyMode(value as 'flashcard' | 'quiz' | 'review')} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="flashcard">Flash Cards</TabsTrigger>
              <TabsTrigger value="quiz">Quick Quiz</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>
            
            <TabsContent value="flashcard" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Flash Card Mode</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Study at your own pace with interactive flash cards. Tap to flip and see the answer.
                  </p>
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={learningStyle === 'self-paced' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLearningStyle('self-paced')}
                      className={learningStyle === 'self-paced' ? 'bg-coral hover:bg-coral/90 text-white' : 'border-coral text-coral hover:bg-coral hover:text-white'}
                    >
                      Self-paced
                    </Button>
                    <Button
                      variant={learningStyle === 'interactive' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLearningStyle('interactive')}
                      className={learningStyle === 'interactive' ? 'bg-turquoise hover:bg-turquoise/90 text-white' : 'border-turquoise text-turquoise hover:bg-turquoise hover:text-white'}
                    >
                      Interactive
                    </Button>
                    <Button
                      variant={learningStyle === 'visual' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLearningStyle('visual')}
                      className={learningStyle === 'visual' ? 'bg-sky hover:bg-sky/90 text-white' : 'border-sky text-sky hover:bg-sky hover:text-white'}
                    >
                      Visual learning
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {learningStyle === 'self-paced' && 'Study at your own comfortable pace'}
                    {learningStyle === 'interactive' && 'Engage with dynamic content and immediate feedback'}
                    {learningStyle === 'visual' && 'Focus on images, colors, and visual cues'}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="quiz" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Quiz Mode</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Test your knowledge with multiple choice questions based on the current subject.
                  </p>
                  <Button 
                    className="w-full bg-turquoise hover:bg-turquoise/90 text-white"
                    onClick={() => {
                      // Navigate to quiz page with current subject and grade
                      if (selectedSubject) {
                        // Use proper client-side navigation
                        setLocation(`/quiz?mode=untimed&grade=${selectedGrade}&subject=${selectedSubject}`);
                      } else {
                        console.log('No subject selected for quiz');
                      }
                    }}
                  >
                    Start Quick Quiz
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="review" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Review Mode</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Review cards you've marked as difficult or incorrect in previous sessions.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-300 text-gray-800 hover:bg-gray-50"
                    onClick={() => {
                      // Filter for difficult cards and restart current session
                      if (cardArray && cardArray.length > 0) {
                        setCurrentCardIndex(0);
                        console.log('Starting review mode with difficult cards for', selectedSubject);
                        // Reset to beginning of current deck instead of reloading page
                      } else {
                        console.log('No cards available for review');
                      }
                    }}
                  >
                    Review Difficult Cards
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

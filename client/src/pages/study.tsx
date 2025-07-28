import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import FlashCard from "@/components/flash-card";
import GradeSelector from "@/components/grade-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Target } from "lucide-react";

export default function Study() {
  const [selectedGrade, setSelectedGrade] = useState("2");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const { data: flashCards, isLoading } = useQuery({
    queryKey: ["/api/flashcards", selectedGrade, selectedSubject],
    enabled: !!selectedSubject,
  });

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

  const handleCardComplete = (correct: boolean) => {
    // TODO: Update progress API
    if (flashCards && Array.isArray(flashCards) && currentCardIndex < flashCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // Session complete
      setCurrentCardIndex(0);
      setSelectedSubject(null);
    }
  };

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

          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Choose Your Subject</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subjects.map((subject) => (
                <Card
                  key={subject.id}
                  className={`cursor-pointer transform hover:scale-105 transition-all duration-300 bg-gradient-to-br ${subject.color} text-white shadow-lg hover:shadow-xl`}
                  onClick={() => setSelectedSubject(subject.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{subject.icon}</div>
                    <h4 className="text-lg font-bold mb-2">{subject.name}</h4>
                    <Badge variant="secondary" className="bg-white bg-opacity-20 text-white">
                      Grade {selectedGrade}
                    </Badge>
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

  const currentCard = Array.isArray(flashCards) ? flashCards[currentCardIndex] : null;
  const progress = Array.isArray(flashCards) ? ((currentCardIndex + 1) / flashCards.length) * 100 : 0;

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
              {currentCardIndex + 1} of {flashCards?.length || 0}
            </Badge>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {subjects.find(s => s.id === selectedSubject)?.name} - Grade {selectedGrade}
          </h1>
          
          <Progress value={progress} className="w-full mb-4" />
        </div>

        {/* Study Session Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="h-6 w-6 mx-auto mb-2 text-coral" />
              <div className="text-sm text-gray-600">Cards Left</div>
              <div className="text-lg font-bold">{(flashCards?.length || 0) - currentCardIndex}</div>
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
          <Tabs defaultValue="flashcard" className="w-full">
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
                  <div className="flex gap-2">
                    <Badge variant="outline">Self-paced</Badge>
                    <Badge variant="outline">Interactive</Badge>
                    <Badge variant="outline">Visual learning</Badge>
                  </div>
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
                  <Button className="w-full bg-turquoise hover:bg-turquoise/90">
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
                  <Button variant="outline" className="w-full">
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

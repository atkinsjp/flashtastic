import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  CheckCircle, 
  Circle, 
  Trophy, 
  Target, 
  Book, 
  Brain,
  Zap,
  Award,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import type { FlashCard } from "@shared/schema";

interface LearningPathProps {
  flashCards: FlashCard[];
  onComplete: (score: number) => void;
  onExit: () => void;
}

interface PathNode {
  id: string;
  title: string;
  description: string;
  icon: typeof Star;
  color: string;
  cards: FlashCard[];
  completed: boolean;
  score?: number;
}

export default function LearningPath({ flashCards, onComplete, onExit }: LearningPathProps) {
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [nodeScores, setNodeScores] = useState<Record<string, number>>({});
  const [totalScore, setTotalScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [pathNodes, setPathNodes] = useState<PathNode[]>([]);

  // Create learning path nodes from flashcards
  useEffect(() => {
    if (flashCards.length === 0) return;

    // Group cards into learning stages
    const cardsPerNode = Math.ceil(flashCards.length / 4);
    const nodes: PathNode[] = [
      {
        id: "foundation",
        title: "Foundation",
        description: "Build your basics",
        icon: Book,
        color: "from-blue-400 to-blue-600",
        cards: flashCards.slice(0, cardsPerNode),
        completed: false
      },
      {
        id: "practice",
        title: "Practice",
        description: "Strengthen your skills",
        icon: Brain,
        color: "from-green-400 to-green-600",
        cards: flashCards.slice(cardsPerNode, cardsPerNode * 2),
        completed: false
      },
      {
        id: "challenge",
        title: "Challenge",
        description: "Test your knowledge",
        icon: Zap,
        color: "from-orange-400 to-orange-600",
        cards: flashCards.slice(cardsPerNode * 2, cardsPerNode * 3),
        completed: false
      },
      {
        id: "mastery",
        title: "Mastery",
        description: "Achieve excellence",
        icon: Trophy,
        color: "from-purple-400 to-purple-600",
        cards: flashCards.slice(cardsPerNode * 3),
        completed: false
      }
    ].filter(node => node.cards.length > 0);

    setPathNodes(nodes);
  }, [flashCards]);

  const currentNode = pathNodes[currentNodeIndex];
  const currentCard = currentNode?.cards[currentCardIndex];
  const totalCards = pathNodes.reduce((sum, node) => sum + node.cards.length, 0);
  const completedCards = pathNodes.slice(0, currentNodeIndex).reduce((sum, node) => sum + node.cards.length, 0) + currentCardIndex;
  const progress = totalCards > 0 ? (completedCards / totalCards) * 100 : 0;

  const generateChoices = (correctAnswer: string, allCards: FlashCard[]) => {
    const wrongAnswers = allCards
      .filter(card => card.answer !== correctAnswer)
      .map(card => card.answer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const choices = [correctAnswer, ...wrongAnswers];
    return choices.sort(() => Math.random() - 0.5);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
  };

  const handleNextCard = () => {
    const isCorrect = selectedAnswer === currentCard?.answer;
    if (isCorrect) {
      setTotalScore(prev => prev + 1);
      setNodeScores(prev => ({
        ...prev,
        [currentNode.id]: (prev[currentNode.id] || 0) + 1
      }));
    }

    // Move to next card
    if (currentCardIndex < currentNode.cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // Complete current node and move to next
      const updatedNodes = [...pathNodes];
      updatedNodes[currentNodeIndex] = {
        ...currentNode,
        completed: true,
        score: nodeScores[currentNode.id] || 0
      };
      setPathNodes(updatedNodes);

      if (currentNodeIndex < pathNodes.length - 1) {
        setCurrentNodeIndex(prev => prev + 1);
        setCurrentCardIndex(0);
      } else {
        // All nodes completed
        setIsCompleted(true);
        onComplete(totalScore);
      }
    }

    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const restartPath = () => {
    setCurrentNodeIndex(0);
    setCurrentCardIndex(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setNodeScores({});
    setTotalScore(0);
    setIsCompleted(false);
    setPathNodes(prev => prev.map(node => ({ ...node, completed: false, score: undefined })));
  };

  if (!currentNode || isCompleted) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Card className="p-8 max-w-md mx-auto">
            <CardContent className="space-y-6">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
              >
                <Trophy className="h-8 w-8 text-white" />
              </motion.div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Learning Path Complete!</h2>
                <p className="text-gray-600">You scored {totalScore} out of {totalCards} questions</p>
              </div>

              <div className="space-y-2">
                {pathNodes.map((node, index) => {
                  const IconComponent = node.icon;
                  const nodeScore = nodeScores[node.id] || 0;
                  const nodeTotal = node.cards.length;
                  const percentage = nodeTotal > 0 ? Math.round((nodeScore / nodeTotal) * 100) : 0;
                  
                  return (
                    <div key={node.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full bg-gradient-to-r ${node.color}`}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">{node.title}</span>
                      </div>
                      <Badge variant={percentage >= 80 ? "default" : "secondary"}>
                        {percentage}%
                      </Badge>
                    </div>
                  );
                })}
              </div>

              <div className="flex space-x-3">
                <Button onClick={restartPath} variant="outline" className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restart Path
                </Button>
                <Button onClick={onExit} className="flex-1">
                  Exit
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const choices = currentCard ? generateChoices(currentCard.answer, flashCards) : [];

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto max-w-6xl">
        {/* Learning Path Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Interactive Learning Path</h1>
            <Button variant="outline" onClick={onExit}>
              Exit Path
            </Button>
          </div>
          
          <Progress value={progress} className="w-full mb-4" />
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Progress: {completedCards}/{totalCards} questions</span>
            <span>Score: {totalScore} correct</span>
          </div>
        </div>

        {/* Animated Learning Path Visualization */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {pathNodes.map((node, index) => {
              const IconComponent = node.icon;
              const isActive = index === currentNodeIndex;
              const isCompleted = node.completed;
              const isPending = index > currentNodeIndex;

              return (
                <motion.div
                  key={node.id}
                  className="flex flex-col items-center relative"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: isActive ? 1.1 : 1, 
                    opacity: 1 
                  }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Connection Line */}
                  {index < pathNodes.length - 1 && (
                    <div className="absolute top-6 left-12 w-24 h-0.5 bg-gray-300">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ width: "0%" }}
                        animate={{ width: isCompleted ? "100%" : "0%" }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}

                  {/* Node Circle */}
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center relative ${
                      isCompleted 
                        ? `bg-gradient-to-r ${node.color}` 
                        : isActive 
                        ? "bg-white border-4 border-blue-500 shadow-lg" 
                        : "bg-gray-200"
                    }`}
                    animate={isActive ? { 
                      boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0.4)", "0 0 0 10px rgba(59, 130, 246, 0)"],
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6 text-white" />
                    ) : (
                      <IconComponent className={`h-6 w-6 ${isActive ? "text-blue-500" : "text-gray-400"}`} />
                    )}
                  </motion.div>

                  {/* Node Info */}
                  <div className="mt-2 text-center">
                    <h3 className={`text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-600"}`}>
                      {node.title}
                    </h3>
                    <p className="text-xs text-gray-500">{node.description}</p>
                    {isCompleted && node.score !== undefined && (
                      <Badge className="mt-1" variant="secondary">
                        {node.score}/{node.cards.length}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Current Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentNodeIndex}-${currentCardIndex}`}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6 bg-white shadow-lg border-2 border-gray-200">
              <div className={`h-2 bg-gradient-to-r ${currentNode.color}`} />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge className={`bg-gradient-to-r ${currentNode.color} text-white`}>
                    {currentNode.title} - Question {currentCardIndex + 1}/{currentNode.cards.length}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Node Progress: {currentCardIndex}/{currentNode.cards.length}</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-6">{currentCard?.question}</h2>

                {!showAnswer ? (
                  <div className="space-y-3">
                    {choices.map((choice, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full text-left justify-start p-4 h-auto"
                          onClick={() => handleAnswerSelect(choice)}
                        >
                          <span className="font-bold mr-3">{String.fromCharCode(65 + index)})</span>
                          {choice}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className={`p-4 rounded-lg ${
                      selectedAnswer === currentCard?.answer 
                        ? "bg-green-100 border-2 border-green-300" 
                        : "bg-red-100 border-2 border-red-300"
                    }`}>
                      <div className="flex items-center space-x-2">
                        {selectedAnswer === currentCard?.answer ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-red-600" />
                        )}
                        <span className="font-medium">
                          {selectedAnswer === currentCard?.answer ? "Correct!" : "Incorrect"}
                        </span>
                      </div>
                      {selectedAnswer !== currentCard?.answer && (
                        <p className="mt-2 text-sm">
                          The correct answer is: <strong>{currentCard?.answer}</strong>
                        </p>
                      )}
                    </div>

                    <Button onClick={handleNextCard} className="w-full">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      {currentCardIndex < currentNode.cards.length - 1 
                        ? "Next Question" 
                        : currentNodeIndex < pathNodes.length - 1 
                        ? "Complete Node & Continue" 
                        : "Complete Learning Path"
                      }
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
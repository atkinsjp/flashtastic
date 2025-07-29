import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { FlashCard as FlashCardType } from "@shared/schema";

interface FlashCardProps {
  card: FlashCardType;
  onComplete: (correct: boolean) => void;
}

export default function FlashCard({ card, onComplete }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      setShowButtons(true);
    }
  };

  const handleAnswer = (correct: boolean) => {
    // Add celebration animation
    if (correct) {
      const cardElement = document.querySelector('.flip-card');
      cardElement?.classList.add('celebration');
      setTimeout(() => cardElement?.classList.remove('celebration'), 800);
    }
    
    setTimeout(() => {
      onComplete(correct);
      setIsFlipped(false);
      setShowButtons(false);
    }, correct ? 1000 : 500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <Badge className="text-sm bg-blue-600 text-white border-0 hover:bg-blue-700">
          {card.subject} • Grade {card.grade}
        </Badge>
        <Badge 
          variant="secondary" 
          className={`text-sm ${
            (card.difficulty || 1) <= 2 ? 'bg-green-100 text-green-700' :
            (card.difficulty || 1) <= 4 ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}
        >
          {(card.difficulty || 1) <= 2 ? 'Easy' : (card.difficulty || 1) <= 4 ? 'Medium' : 'Hard'}
        </Badge>
      </div>

      <div 
        className={`flip-card h-80 mb-6 cursor-pointer ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flip-card-inner h-full">
          {/* Front of card */}
          <Card className="flip-card-front bg-gradient-to-br from-coral to-pink text-white h-full">
            <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
              {card.imageUrl && (
                <img 
                  src={card.imageUrl}
                  alt="Question illustration"
                  className="w-32 h-24 object-cover rounded-lg mb-4 shadow-lg"
                />
              )}
              
              <h3 className="text-xl font-bold mb-4 leading-relaxed">
                {card.question}
              </h3>
              
              {!isFlipped && (
                <p className="text-sm opacity-80 mt-auto">
                  Tap to reveal answer ✨
                </p>
              )}
            </CardContent>
          </Card>

          {/* Back of card */}
          <Card className="flip-card-back bg-gradient-to-br from-turquoise to-mint text-white h-full">
            <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="text-4xl font-bold mb-4">
                {card.answer}
              </div>
              
              {card.type === "image" && (
                <div className="text-4xl mb-4">
                  {card.subject === "vocabulary" && card.answer.toLowerCase().includes("cat") ? "🐱" :
                   card.subject === "vocabulary" && card.answer.toLowerCase().includes("red") ? "🔴" :
                   card.subject === "math" ? "🔢" :
                   card.subject === "science" ? "🔬" : "✨"}
                </div>
              )}
              
              <p className="text-sm opacity-80">
                {card.type === "image" ? "Great job! 🎉" : "Did you get it right? 🤔"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Answer buttons */}
      {showButtons && (
        <div className="flex gap-3 justify-center">
          <Button 
            onClick={() => handleAnswer(false)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 text-lg font-semibold"
          >
            <span className="mr-2">❌</span>
            Need Practice
          </Button>
          
          <Button 
            onClick={() => handleAnswer(true)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 text-lg font-semibold"
          >
            <span className="mr-2">✅</span>
            Got It!
          </Button>
        </div>
      )}

      {!showButtons && (
        <div className="text-center text-gray-500">
          <p className="text-sm">Tap the card to see the answer</p>
        </div>
      )}
    </div>
  );
}

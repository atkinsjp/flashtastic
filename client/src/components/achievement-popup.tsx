import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Achievement {
  name: string;
  description: string;
  icon: string;
  rarity?: string;
}

interface AchievementPopupProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: Achievement;
}

export default function AchievementPopup({ 
  isOpen, 
  onClose, 
  achievement 
}: AchievementPopupProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Auto close after 4 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const getBadgeImage = (rarity?: string) => {
    // Use different badge images based on rarity
    switch (rarity) {
      case 'gold':
        return "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120";
      case 'silver':
        return "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120";
      case 'bronze':
        return "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120";
      default:
        return "https://images.unsplash.com/photo-1569025743873-ea3a9ade89f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-4 text-center p-8 border-0 shadow-2xl">
        <div className={`space-y-6 ${showConfetti ? 'celebration' : ''}`}>
          {/* Celebration Emojis */}
          <div className="text-6xl animate-bounce">🎉</div>
          
          {/* Title */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Congratulations!
            </h3>
            <p className="text-gray-600">You earned a new achievement!</p>
          </div>
          
          {/* Achievement Badge */}
          <div className="relative">
            <img 
              src={getBadgeImage(achievement.rarity)}
              alt="Achievement badge"
              className="w-20 h-20 mx-auto rounded-full shadow-lg achievement-badge"
            />
            {/* Icon overlay */}
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">{achievement.icon}</span>
            </div>
          </div>
          
          {/* Achievement Details */}
          <div>
            <h4 className="text-lg font-bold text-golden mb-2">
              {achievement.name}
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              {achievement.description}
            </p>
            {achievement.rarity && (
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                achievement.rarity === 'gold' ? 'bg-yellow-100 text-yellow-700' :
                achievement.rarity === 'silver' ? 'bg-gray-100 text-gray-700' :
                achievement.rarity === 'bronze' ? 'bg-orange-100 text-orange-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {achievement.rarity.toUpperCase()}
              </div>
            )}
          </div>
          
          {/* Points Earned */}
          <div className="text-sm text-gray-600">
            <p>+50 points earned! ⭐</p>
          </div>
          
          {/* Close Button */}
          <Button 
            onClick={onClose}
            className="bg-coral hover:bg-coral/90 text-white py-3 px-6 rounded-xl font-semibold transform transition-all duration-200 hover:scale-105"
          >
            Awesome!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

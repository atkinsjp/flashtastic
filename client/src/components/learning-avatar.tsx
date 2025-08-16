import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles, Star, Award, Gift } from "lucide-react";

interface AvatarGrowth {
  stage: number;
  experience: number;
  unlocks: string[];
  accessories: string[];
  mood: string;
}

interface LearningAvatarProps {
  points: number;
  level: number;
  streak: number;
  avatarGrowth: AvatarGrowth;
  onGrowthUpdate?: (growth: AvatarGrowth) => void;
  className?: string;
}

const AVATAR_STAGES = {
  1: {
    name: "Seedling",
    description: "Just starting to learn!",
    emoji: "🌱",
    color: "from-green-200 to-green-300",
    requiredExp: 0
  },
  2: {
    name: "Sprout",
    description: "Growing with knowledge!",
    emoji: "🌿",
    color: "from-green-300 to-green-400",
    requiredExp: 100
  },
  3: {
    name: "Young Plant",
    description: "Developing strong skills!",
    emoji: "🪴",
    color: "from-green-400 to-green-500",
    requiredExp: 300
  },
  4: {
    name: "Mature Plant",
    description: "Confident learner!",
    emoji: "🌳",
    color: "from-green-500 to-green-600",
    requiredExp: 600
  },
  5: {
    name: "Flowering Scholar",
    description: "Mastering everything!",
    emoji: "🌺",
    color: "from-pink-400 to-purple-500",
    requiredExp: 1000
  }
};

const MOOD_EMOJIS = {
  happy: "😊",
  excited: "🤩", 
  proud: "😌",
  focused: "🧐",
  sleepy: "😴"
};

const ACCESSORIES = {
  glasses: { emoji: "👓", name: "Smart Glasses", requiredLevel: 5 },
  hat: { emoji: "🎓", name: "Graduation Cap", requiredLevel: 10 },
  medal: { emoji: "🏅", name: "Achievement Medal", requiredLevel: 15 },
  crown: { emoji: "👑", name: "Knowledge Crown", requiredLevel: 20 }
};

export default function LearningAvatar({ 
  points, 
  level, 
  streak, 
  avatarGrowth, 
  onGrowthUpdate,
  className = ""
}: LearningAvatarProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showGrowthAnimation, setShowGrowthAnimation] = useState(false);
  const [lastPoints, setLastPoints] = useState(points);

  // Calculate experience based on points and achievements
  const calculateExperience = () => {
    return Math.floor(points / 10) + (streak * 5) + (level * 20);
  };

  // Determine current stage based on experience
  const getCurrentStage = (experience: number) => {
    for (let stage = 5; stage >= 1; stage--) {
      if (experience >= AVATAR_STAGES[stage as keyof typeof AVATAR_STAGES].requiredExp) {
        return stage;
      }
    }
    return 1;
  };

  // Check for growth when points change
  useEffect(() => {
    const newExperience = calculateExperience();
    const newStage = getCurrentStage(newExperience);
    
    if (newStage > avatarGrowth.stage || newExperience > avatarGrowth.experience) {
      const wasGrowth = newStage > avatarGrowth.stage;
      
      const updatedGrowth = {
        ...avatarGrowth,
        stage: newStage,
        experience: newExperience,
        mood: wasGrowth ? "excited" : avatarGrowth.mood
      };

      // Check for new accessory unlocks
      Object.entries(ACCESSORIES).forEach(([key, accessory]) => {
        if (level >= accessory.requiredLevel && !updatedGrowth.unlocks.includes(key)) {
          updatedGrowth.unlocks.push(key);
        }
      });

      onGrowthUpdate?.(updatedGrowth);
      
      if (wasGrowth) {
        setShowGrowthAnimation(true);
        setTimeout(() => setShowGrowthAnimation(false), 3000);
      }
    }
    
    setLastPoints(points);
  }, [points, level, streak]);

  const currentStage = AVATAR_STAGES[avatarGrowth.stage as keyof typeof AVATAR_STAGES];
  const nextStage = AVATAR_STAGES[(avatarGrowth.stage + 1) as keyof typeof AVATAR_STAGES];
  const progressToNext = nextStage ? 
    ((avatarGrowth.experience - currentStage.requiredExp) / (nextStage.requiredExp - currentStage.requiredExp)) * 100 : 100;

  return (
    <>
      <Card className={`relative overflow-hidden ${className}`}>
        <CardContent className="p-4">
          <div className="text-center space-y-3">
            {/* Avatar Display */}
            <div 
              className={`relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${currentStage.color} 
                         flex items-center justify-center text-4xl cursor-pointer transition-all duration-300
                         ${showGrowthAnimation ? 'animate-bounce scale-110' : 'hover:scale-105'}`}
              onClick={() => setShowDetails(true)}
            >
              <img 
                src="/avatars/avatar-1.svg" 
                alt="Learning Avatar" 
                className="w-16 h-16 rounded-full bg-white/30 p-1 relative z-10"
                style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}
              />
              <span className="absolute -top-1 -right-1 text-lg z-20">
                {MOOD_EMOJIS[avatarGrowth.mood as keyof typeof MOOD_EMOJIS]}
              </span>
              
              {/* Accessories */}
              {avatarGrowth.accessories.map((accessory, index) => (
                <span 
                  key={accessory}
                  className={`absolute text-sm cursor-pointer hover:scale-110 transition-transform z-30 ${index === 0 ? 'top-0 right-0' : 'bottom-0 left-0'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const newAccessories = avatarGrowth.accessories.filter(a => a !== accessory);
                    onGrowthUpdate?.({
                      ...avatarGrowth,
                      accessories: newAccessories
                    });
                  }}
                  title={`Remove ${ACCESSORIES[accessory as keyof typeof ACCESSORIES]?.name}`}
                >
                  {ACCESSORIES[accessory as keyof typeof ACCESSORIES]?.emoji}
                </span>
              ))}
              
              {/* Growth sparkles */}
              {showGrowthAnimation && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-yellow-400 animate-spin" />
                </div>
              )}
            </div>

            {/* Stage Info */}
            <div>
              <Badge variant="secondary" className="text-xs">
                {currentStage.name}
              </Badge>
              <p className="text-xs text-gray-600 mt-1">
                Level {level} • {streak} day streak
              </p>
            </div>

            {/* Progress Bar */}
            {nextStage && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-coral to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progressToNext, 100)}%` }}
                />
              </div>
            )}

            {/* Quick Stats */}
            <div className="flex justify-center space-x-3 text-xs">
              <span className="flex items-center">
                <Star className="h-3 w-3 text-yellow-500 mr-1" />
                {points}
              </span>
              <span className="flex items-center">
                <Award className="h-3 w-3 text-purple-500 mr-1" />
                {avatarGrowth.unlocks.length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growth Animation Popup */}
      {showGrowthAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-xl p-6 shadow-2xl animate-pulse">
            <div className="text-center">
              <div className="text-6xl mb-2">{currentStage.emoji}</div>
              <h3 className="text-xl font-bold text-gray-800">Level Up!</h3>
              <p className="text-gray-600">Your avatar grew to {currentStage.name}!</p>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Avatar Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Your Learning Companion</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Avatar Display */}
            <div className="text-center">
              <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${currentStage.color} 
                             flex items-center justify-center relative p-2`}>
                <img 
                  src="/avatars/avatar-1.svg" 
                  alt="Learning Avatar" 
                  className="w-20 h-20 rounded-full bg-white/30"
                  style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}
                />
                <span className="absolute -top-2 -right-2 text-xl">
                  {MOOD_EMOJIS[avatarGrowth.mood as keyof typeof MOOD_EMOJIS]}
                </span>
              </div>
              <h3 className="text-xl font-bold mt-2">{currentStage.name}</h3>
              <p className="text-gray-600">{currentStage.description}</p>
            </div>

            {/* Progress to Next Stage */}
            {nextStage && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to {nextStage.name}</span>
                  <span>{Math.round(progressToNext)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-coral to-pink-500 h-3 rounded-full"
                    style={{ width: `${Math.min(progressToNext, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {nextStage.requiredExp - avatarGrowth.experience} exp needed
                </p>
              </div>
            )}

            {/* Unlocked Accessories */}
            {avatarGrowth.unlocks.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Unlocked Accessories</h4>
                <div className="grid grid-cols-2 gap-2">
                  {avatarGrowth.unlocks.map((unlock) => {
                    const accessory = ACCESSORIES[unlock as keyof typeof ACCESSORIES];
                    const isEquipped = avatarGrowth.accessories.includes(unlock);
                    return (
                      <Button
                        key={unlock}
                        variant={isEquipped ? "default" : "outline"}
                        size="sm"
                        className={`h-auto p-3 transition-all ${isEquipped ? 'bg-coral hover:bg-coral/90 text-white' : 'hover:bg-gray-50'}`}
                        onClick={() => {
                          const newAccessories = isEquipped
                            ? avatarGrowth.accessories.filter(a => a !== unlock)
                            : [...avatarGrowth.accessories, unlock];
                          
                          onGrowthUpdate?.({
                            ...avatarGrowth,
                            accessories: newAccessories
                          });
                        }}
                      >
                        <div className="text-center">
                          <div className="text-lg">{accessory?.emoji}</div>
                          <div className="text-xs">{accessory?.name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {isEquipped ? 'Equipped' : 'Click to equip'}
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mood Selector */}
            <div>
              <h4 className="font-semibold mb-2">Avatar Mood</h4>
              <div className="flex justify-center space-x-2">
                {Object.entries(MOOD_EMOJIS).map(([mood, emoji]) => (
                  <Button
                    key={mood}
                    variant={avatarGrowth.mood === mood ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      onGrowthUpdate?.({
                        ...avatarGrowth,
                        mood
                      });
                    }}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
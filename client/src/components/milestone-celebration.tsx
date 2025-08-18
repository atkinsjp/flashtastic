import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share2, X, Trophy, Star, Zap, Target, Crown, Sparkles } from 'lucide-react';
import { SocialSharing, useSocialSharing } from './social-sharing';

interface MilestoneData {
  id: string;
  type: 'streak' | 'achievement' | 'level' | 'mastery' | 'quiz_score';
  title: string;
  description: string;
  value: number;
  icon: string;
  color: string;
  date: Date;
  subject?: string;
  grade?: string;
  points?: number;
}

interface MilestoneCelebrationProps {
  milestone: MilestoneData | null;
  open: boolean;
  onClose: () => void;
  onShare?: (milestone: MilestoneData) => void;
  userName?: string;
}

export function MilestoneCelebration({ 
  milestone, 
  open, 
  onClose, 
  onShare,
  userName = "Student" 
}: MilestoneCelebrationProps) {
  const { shareMilestone, isOpen: shareOpen, closeSharingModal, currentMilestone } = useSocialSharing();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (open && milestone) {
      setShowConfetti(true);
      // Auto-hide confetti after animation
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [open, milestone]);

  if (!milestone) return null;

  const getMilestoneIcon = () => {
    switch (milestone.type) {
      case 'streak': return <Zap className="h-16 w-16 text-yellow-500" />;
      case 'achievement': return <Trophy className="h-16 w-16 text-purple-500" />;
      case 'level': return <Star className="h-16 w-16 text-blue-500" />;
      case 'mastery': return <Target className="h-16 w-16 text-green-500" />;
      case 'quiz_score': return <Crown className="h-16 w-16 text-orange-500" />;
      default: return <Trophy className="h-16 w-16 text-purple-500" />;
    }
  };

  const getMilestoneColorClass = () => {
    switch (milestone.type) {
      case 'streak': return 'from-yellow-400 to-orange-500';
      case 'achievement': return 'from-purple-500 to-pink-500';
      case 'level': return 'from-blue-500 to-cyan-500';
      case 'mastery': return 'from-green-500 to-emerald-500';
      case 'quiz_score': return 'from-orange-500 to-red-500';
      default: return 'from-purple-500 to-pink-500';
    }
  };

  const getCelebrationMessage = () => {
    switch (milestone.type) {
      case 'streak':
        return `Amazing! You've built a ${milestone.value}-day learning streak!`;
      case 'achievement':
        return `Congratulations! You've unlocked a new achievement!`;
      case 'level':
        return `Level Up! You've reached Level ${milestone.value}!`;
      case 'mastery':
        return `Mastery Achieved! You've mastered this topic!`;
      case 'quiz_score':
        return `Perfect Score! You got ${milestone.value}% on your quiz!`;
      default:
        return `Great job! You've achieved something special!`;
    }
  };

  const handleShare = () => {
    shareMilestone(milestone);
    onShare?.(milestone);
  };

  // Confetti particles
  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10,
    color: ['#f59e0b', '#ef4444', '#8b5cf6', '#10b981', '#3b82f6'][Math.floor(Math.random() * 5)],
    delay: Math.random() * 2,
  }));

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Confetti Animation */}
            {showConfetti && (
              <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {confettiParticles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    className="absolute w-2 h-2 rounded"
                    style={{
                      backgroundColor: particle.color,
                      left: `${particle.x}%`,
                    }}
                    initial={{ y: -20, rotate: 0, scale: 1 }}
                    animate={{ 
                      y: window.innerHeight + 20, 
                      rotate: 360,
                      scale: [1, 1.5, 1]
                    }}
                    transition={{
                      duration: 3,
                      delay: particle.delay,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="relative overflow-hidden">
                {/* Close button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="absolute top-2 right-2 z-10 rounded-full"
                  data-testid="close-celebration-modal"
                >
                  <X className="h-4 w-4" />
                </Button>

                {/* Animated background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getMilestoneColorClass()} opacity-10`}>
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                    style={{
                      backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px',
                    }}
                  />
                </div>

                <CardContent className="p-8 text-center relative">
                  {/* Sparkle decorations */}
                  <div className="absolute top-4 left-4">
                    <motion.div
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="h-6 w-6 text-yellow-400" />
                    </motion.div>
                  </div>
                  <div className="absolute top-4 right-12">
                    <motion.div
                      animate={{ rotate: -360, scale: [1, 1.3, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <Sparkles className="h-4 w-4 text-pink-400" />
                    </motion.div>
                  </div>

                  <div className="space-y-6">
                    {/* Achievement Icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring", 
                        delay: 0.2,
                        duration: 0.6
                      }}
                      className="flex justify-center"
                    >
                      <motion.div
                        animate={{ 
                          rotate: [0, -10, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 1,
                          repeat: Infinity,
                          repeatDelay: 2
                        }}
                        className="p-4 bg-white rounded-full shadow-lg"
                      >
                        {getMilestoneIcon()}
                      </motion.div>
                    </motion.div>

                    {/* Celebration Message */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {getCelebrationMessage()}
                      </h2>
                      <h3 className="text-lg font-semibold text-gray-700 mb-1">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {milestone.description}
                      </p>
                    </motion.div>

                    {/* Badges */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex flex-wrap justify-center gap-2"
                    >
                      {milestone.subject && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {milestone.subject}
                        </Badge>
                      )}
                      {milestone.grade && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Grade {milestone.grade}
                        </Badge>
                      )}
                      {milestone.points && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          +{milestone.points} points
                        </Badge>
                      )}
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="flex gap-3 justify-center"
                    >
                      <Button
                        onClick={handleShare}
                        className={`bg-gradient-to-r ${getMilestoneColorClass()} hover:opacity-90 text-white`}
                        data-testid="share-milestone-button"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Achievement
                      </Button>
                      <Button
                        variant="outline"
                        onClick={onClose}
                        data-testid="continue-learning-button"
                      >
                        Continue Learning
                      </Button>
                    </motion.div>

                    {/* Motivational Message */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-center"
                    >
                      <p className="text-sm text-gray-500 italic">
                        "Every achievement is a step closer to your goals. Keep up the amazing work, {userName}!"
                      </p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Sharing Modal */}
      <SocialSharing
        milestone={currentMilestone}
        open={shareOpen}
        onClose={closeSharingModal}
        userName={userName}
      />
    </>
  );
}

// Hook for managing milestone celebrations
export function useMilestoneCelebration() {
  const [currentMilestone, setCurrentMilestone] = useState<MilestoneData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const celebrateMilestone = (milestone: MilestoneData) => {
    setCurrentMilestone(milestone);
    setIsOpen(true);
  };

  const closeCelebration = () => {
    setIsOpen(false);
    setCurrentMilestone(null);
  };

  return {
    currentMilestone,
    isOpen,
    celebrateMilestone,
    closeCelebration,
  };
}
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share2, Copy, Check, Trophy, Star, Zap, Target, Crown, Download, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface Milestone {
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
}

interface SocialSharingProps {
  milestone: Milestone | null;
  open: boolean;
  onClose: () => void;
  userName?: string;
  avatarUrl?: string;
}

export function SocialSharing({ milestone, open, onClose, userName = "Student", avatarUrl }: SocialSharingProps) {
  const [shareMethod, setShareMethod] = useState<'image' | 'text'>('image');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  if (!milestone) return null;

  const getMilestoneIcon = () => {
    switch (milestone.type) {
      case 'streak': return <Zap className="h-8 w-8 text-yellow-500" />;
      case 'achievement': return <Trophy className="h-8 w-8 text-purple-500" />;
      case 'level': return <Star className="h-8 w-8 text-blue-500" />;
      case 'mastery': return <Target className="h-8 w-8 text-green-500" />;
      case 'quiz_score': return <Crown className="h-8 w-8 text-orange-500" />;
      default: return <Trophy className="h-8 w-8 text-purple-500" />;
    }
  };

  const getMilestoneEmoji = () => {
    switch (milestone.type) {
      case 'streak': return '⚡';
      case 'achievement': return '🏆';
      case 'level': return '⭐';
      case 'mastery': return '🎯';
      case 'quiz_score': return '👑';
      default: return '🏆';
    }
  };

  const getShareText = () => {
    const emoji = getMilestoneEmoji();
    const subject = milestone.subject ? ` in ${milestone.subject}` : '';
    const grade = milestone.grade ? ` (Grade ${milestone.grade})` : '';
    
    switch (milestone.type) {
      case 'streak':
        return `${emoji} Just hit a ${milestone.value}-day learning streak on FlashTastic!${subject}${grade} #LearningSucess #FlashTastic #Education`;
      case 'achievement':
        return `${emoji} Unlocked "${milestone.title}" achievement on FlashTastic!${subject}${grade} #Achievement #Learning #FlashTastic`;
      case 'level':
        return `${emoji} Level up! Just reached Level ${milestone.value} on FlashTastic!${subject}${grade} #LevelUp #Learning #FlashTastic`;
      case 'mastery':
        return `${emoji} Mastered ${milestone.title} on FlashTastic!${subject}${grade} Perfect understanding achieved! #Mastery #Education #FlashTastic`;
      case 'quiz_score':
        return `${emoji} Scored ${milestone.value}% on my FlashTastic quiz!${subject}${grade} #QuizMaster #Learning #FlashTastic`;
      default:
        return `${emoji} Great progress on FlashTastic! ${milestone.description} #Learning #FlashTastic`;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to clipboard!",
        description: "Share your achievement anywhere!",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the text manually.",
        variant: "destructive",
      });
    }
  };

  const downloadShareImage = async () => {
    // Create a canvas element for the share image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, milestone.color || '#6366f1');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // FlashTastic logo area
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, 800, 100);

    // FlashTastic text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('FlashTastic', 400, 60);

    // Achievement card background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.roundRect(100, 150, 600, 300, 20);
    ctx.fill();

    // Achievement icon (simplified as emoji)
    ctx.font = '80px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = milestone.color || '#6366f1';
    ctx.fillText(getMilestoneEmoji(), 400, 260);

    // Achievement title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 32px Arial';
    ctx.fillText(milestone.title, 400, 330);

    // Achievement description
    ctx.font = '24px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(milestone.description, 400, 370);

    // User name
    if (userName) {
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = '#1f2937';
      ctx.fillText(`Achieved by ${userName}`, 400, 420);
    }

    // Date
    ctx.font = '20px Arial';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(milestone.date.toLocaleDateString(), 400, 450);

    // Download the image
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `flashtastic-achievement-${milestone.id}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });

    toast({
      title: "Image downloaded!",
      description: "Share your achievement image on social media!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share Your Achievement
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="close-share-modal">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Achievement Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className={`bg-gradient-to-br ${milestone.color || 'from-purple-500 to-pink-500'} text-white`}>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-3">
                  {getMilestoneIcon()}
                  <h3 className="text-xl font-bold">{milestone.title}</h3>
                  <p className="text-sm opacity-90">{milestone.description}</p>
                  <div className="flex items-center gap-2">
                    {milestone.subject && (
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {milestone.subject}
                      </Badge>
                    )}
                    {milestone.grade && (
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        Grade {milestone.grade}
                      </Badge>
                    )}
                  </div>
                  {userName && (
                    <p className="text-sm font-medium">Achieved by {userName}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Share Method Toggle */}
          <div className="flex bg-muted p-1 rounded-lg">
            <Button
              variant={shareMethod === 'image' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setShareMethod('image')}
              className="flex-1"
              data-testid="share-image-tab"
            >
              <Download className="h-4 w-4 mr-2" />
              Share Image
            </Button>
            <Button
              variant={shareMethod === 'text' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setShareMethod('text')}
              className="flex-1"
              data-testid="share-text-tab"
            >
              <Copy className="h-4 w-4 mr-2" />
              Share Text
            </Button>
          </div>

          {/* Share Content */}
          {shareMethod === 'image' ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Download a beautiful image to share on social media
              </p>
              <Button
                onClick={downloadShareImage}
                className="w-full"
                size="lg"
                data-testid="download-image-button"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Achievement Image
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">{getShareText()}</p>
              </div>
              <Button
                onClick={() => copyToClipboard(getShareText())}
                variant="outline"
                className="w-full"
                data-testid="copy-text-button"
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </Button>
            </div>
          )}

          {/* Social Platform Quick Actions */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-center">Share directly to:</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const text = encodeURIComponent(getShareText());
                  window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
                }}
                className="flex items-center gap-2"
                data-testid="share-twitter"
              >
                <div className="w-4 h-4 bg-blue-400 rounded" />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const text = encodeURIComponent(getShareText());
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${text}`, '_blank');
                }}
                className="flex items-center gap-2"
                data-testid="share-facebook"
              >
                <div className="w-4 h-4 bg-blue-600 rounded" />
                Facebook
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook for triggering social sharing
export function useSocialSharing() {
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const shareMilestone = (milestone: Milestone) => {
    setCurrentMilestone(milestone);
    setIsOpen(true);
  };

  const closeSharingModal = () => {
    setIsOpen(false);
    setCurrentMilestone(null);
  };

  return {
    currentMilestone,
    isOpen,
    shareMilestone,
    closeSharingModal,
  };
}
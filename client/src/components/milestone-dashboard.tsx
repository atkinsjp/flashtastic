import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Star, Zap, Target, Crown, Share2, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMilestoneTracker } from '@/hooks/use-milestone-tracker';
import { SocialSharing, useSocialSharing } from './social-sharing';
import { useAuth } from '@/contexts/auth-context';

export function MilestoneDashboard() {
  const { progress, getRecentMilestones } = useMilestoneTracker();
  const { shareMilestone, isOpen: shareOpen, closeSharingModal, currentMilestone } = useSocialSharing();
  const { user } = useAuth();
  
  const recentMilestones = getRecentMilestones();

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'streak': return <Zap className="h-5 w-5 text-yellow-500" />;
      case 'achievement': return <Trophy className="h-5 w-5 text-purple-500" />;
      case 'level': return <Star className="h-5 w-5 text-blue-500" />;
      case 'mastery': return <Target className="h-5 w-5 text-green-500" />;
      case 'quiz_score': return <Crown className="h-5 w-5 text-orange-500" />;
      default: return <Trophy className="h-5 w-5 text-purple-500" />;
    }
  };

  const getNextLevelProgress = () => {
    const pointsForCurrentLevel = (progress.currentLevel - 1) * 1000;
    const pointsForNextLevel = progress.currentLevel * 1000;
    const progressPoints = progress.totalPoints - pointsForCurrentLevel;
    const neededPoints = pointsForNextLevel - pointsForCurrentLevel;
    return (progressPoints / neededPoints) * 100;
  };

  const getSubjectMasteryAverage = () => {
    const masteries = Object.values(progress.subjectMasteries);
    if (masteries.length === 0) return 0;
    return masteries.reduce((sum, mastery) => sum + mastery, 0) / masteries.length;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-yellow-600">{progress.streakDays}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{progress.currentLevel}</div>
              <div className="text-xs text-muted-foreground">Level</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-6 w-6 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{progress.totalPoints}</div>
              <div className="text-xs text-muted-foreground">Points</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-6 w-6 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(getSubjectMasteryAverage())}%
              </div>
              <div className="text-xs text-muted-foreground">Avg Mastery</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Level Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Level {progress.currentLevel} Progress</span>
                <span className="text-sm text-muted-foreground">
                  {progress.totalPoints} / {progress.currentLevel * 1000} points
                </span>
              </div>
              <Progress value={getNextLevelProgress()} className="h-2" />
            </div>

            {/* Subject Masteries */}
            {Object.entries(progress.subjectMasteries).map(([subject, mastery]) => (
              <div key={subject}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium capitalize">{subject.replace('_', ' ')}</span>
                  <span className="text-sm text-muted-foreground">{Math.round(mastery)}%</span>
                </div>
                <Progress value={mastery} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements and Recent Activity */}
      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recent">Recent Milestones</TabsTrigger>
          <TabsTrigger value="achievements">All Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentMilestones.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No milestones yet. Keep learning to unlock achievements!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentMilestones.slice(0, 10).map((milestone, index) => (
                      <motion.div
                        key={milestone.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {getMilestoneIcon(milestone.type)}
                          <div>
                            <h4 className="font-semibold text-sm">{milestone.title}</h4>
                            <p className="text-xs text-muted-foreground">{milestone.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {milestone.date.toLocaleDateString()}
                              </span>
                              {milestone.subject && (
                                <Badge variant="secondary" className="text-xs">
                                  {milestone.subject}
                                </Badge>
                              )}
                              {milestone.points && (
                                <Badge variant="outline" className="text-xs">
                                  +{milestone.points} pts
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => shareMilestone(milestone)}
                          data-testid={`share-milestone-${index}`}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievement Collection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Streak Achievements */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-yellow-600 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Streak Master
                    </h4>
                    {[3, 7, 14, 30, 60, 100].map(days => {
                      const isUnlocked = progress.achievementsUnlocked.includes(`streak_${days}`);
                      return (
                        <div
                          key={days}
                          className={`flex items-center gap-2 p-2 rounded ${
                            isUnlocked ? 'bg-yellow-50' : 'bg-gray-50'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isUnlocked ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {isUnlocked ? '✓' : '○'}
                          </div>
                          <span className={`text-sm ${isUnlocked ? 'font-medium' : 'text-muted-foreground'}`}>
                            {days}-Day Streak
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Points Achievements */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-purple-600 flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Points Club
                    </h4>
                    {[100, 500, 1000, 2500, 5000, 10000].map(points => {
                      const isUnlocked = progress.achievementsUnlocked.includes(`points_${points}`);
                      return (
                        <div
                          key={points}
                          className={`flex items-center gap-2 p-2 rounded ${
                            isUnlocked ? 'bg-purple-50' : 'bg-gray-50'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isUnlocked ? 'bg-purple-200 text-purple-800' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {isUnlocked ? '✓' : '○'}
                          </div>
                          <span className={`text-sm ${isUnlocked ? 'font-medium' : 'text-muted-foreground'}`}>
                            {points.toLocaleString()} Points
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Social Sharing Modal */}
      <SocialSharing
        milestone={currentMilestone}
        open={shareOpen}
        onClose={closeSharingModal}
        userName={user?.username}
      />
    </div>
  );
}
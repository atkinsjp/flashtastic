import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { MilestoneCelebration, useMilestoneCelebration } from '@/components/milestone-celebration';

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

interface MilestoneProgress {
  streakDays: number;
  totalPoints: number;
  currentLevel: number;
  subjectMasteries: Record<string, number>; // subject -> mastery percentage
  quizStreaks: Record<string, number>; // subject -> consecutive perfect scores
  achievementsUnlocked: string[];
  lastActivityDate: Date | null;
}

interface MilestoneContextType {
  progress: MilestoneProgress;
  checkForMilestones: (activity: ActivityData) => Promise<MilestoneData[]>;
  resetProgress: () => void;
  getRecentMilestones: () => MilestoneData[];
  updateProgress: (updates: Partial<MilestoneProgress>) => void;
}

interface ActivityData {
  type: 'quiz_completed' | 'study_session' | 'flashcard_practice' | 'ai_question';
  subject: string;
  grade: string;
  score?: number; // percentage for quizzes
  pointsEarned: number;
  timeSpent?: number; // minutes
  correctAnswers?: number;
  totalQuestions?: number;
}

const MilestoneContext = createContext<MilestoneContextType | undefined>(undefined);

export function MilestoneProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { celebrateMilestone, isOpen, closeCelebration, currentMilestone } = useMilestoneCelebration();
  
  const [progress, setProgress] = useState<MilestoneProgress>({
    streakDays: 0,
    totalPoints: 0,
    currentLevel: 1,
    subjectMasteries: {},
    quizStreaks: {},
    achievementsUnlocked: [],
    lastActivityDate: null,
  });

  const [recentMilestones, setRecentMilestones] = useState<MilestoneData[]>([]);

  // Load progress from localStorage on mount  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedProgress = localStorage.getItem(`milestone-progress-${user?.id || 'guest'}`);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        if (parsed.lastActivityDate) {
          parsed.lastActivityDate = new Date(parsed.lastActivityDate);
        }
        setProgress(parsed);
      }

      const savedMilestones = localStorage.getItem(`recent-milestones-${user?.id || 'guest'}`);
      if (savedMilestones) {
        const parsed = JSON.parse(savedMilestones).map((m: any) => ({
          ...m,
          date: new Date(m.date)
        }));
        setRecentMilestones(parsed);
      }
    } catch (error) {
      console.warn('Failed to load milestone data:', error);
    }
  }, [user?.id]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(`milestone-progress-${user?.id || 'guest'}`, JSON.stringify(progress));
    } catch (error) {
      console.warn('Failed to save milestone progress:', error);
    }
  }, [progress, user?.id]);

  // Save recent milestones to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(`recent-milestones-${user?.id || 'guest'}`, JSON.stringify(recentMilestones));
    } catch (error) {
      console.warn('Failed to save milestones:', error);
    }
  }, [recentMilestones, user?.id]);

  const updateProgress = (updates: Partial<MilestoneProgress>) => {
    setProgress(prev => ({ ...prev, ...updates }));
  };

  const checkStreakMilestone = (newProgress: MilestoneProgress): MilestoneData[] => {
    const milestones: MilestoneData[] = [];
    const streakDays = newProgress.streakDays;

    // Check for streak milestones
    const streakMilestoneValues = [3, 7, 14, 30, 60, 100];
    for (const value of streakMilestoneValues) {
      if (streakDays === value && !progress.achievementsUnlocked.includes(`streak_${value}`)) {
        milestones.push({
          id: `streak_${value}_${Date.now()}`,
          type: 'streak',
          title: `${value}-Day Streak Master!`,
          description: `You've maintained a learning streak for ${value} consecutive days!`,
          value,
          icon: '⚡',
          color: 'from-yellow-400 to-orange-500',
          date: new Date(),
          points: value * 10,
        });
        
        // Mark achievement as unlocked
        newProgress.achievementsUnlocked.push(`streak_${value}`);
      }
    }

    return milestones;
  };

  const checkLevelMilestone = (newProgress: MilestoneProgress): MilestoneData[] => {
    const milestones: MilestoneData[] = [];
    const newLevel = Math.floor(newProgress.totalPoints / 1000) + 1;
    
    if (newLevel > progress.currentLevel) {
      milestones.push({
        id: `level_${newLevel}_${Date.now()}`,
        type: 'level',
        title: `Level ${newLevel} Achieved!`,
        description: `You've reached level ${newLevel}! Your dedication to learning is paying off!`,
        value: newLevel,
        icon: '⭐',
        color: 'from-blue-500 to-cyan-500',
        date: new Date(),
        points: newLevel * 50,
      });
      
      newProgress.currentLevel = newLevel;
    }

    return milestones;
  };

  const checkQuizMilestones = (activity: ActivityData, newProgress: MilestoneProgress): MilestoneData[] => {
    const milestones: MilestoneData[] = [];
    
    if (activity.type === 'quiz_completed' && activity.score !== undefined) {
      // Perfect score achievement
      if (activity.score === 100) {
        const streakKey = `${activity.subject}_${activity.grade}`;
        const currentStreak = (newProgress.quizStreaks[streakKey] || 0) + 1;
        newProgress.quizStreaks[streakKey] = currentStreak;

        milestones.push({
          id: `perfect_quiz_${Date.now()}`,
          type: 'quiz_score',
          title: 'Perfect Score!',
          description: `Scored 100% on your ${activity.subject} quiz!`,
          value: 100,
          icon: '👑',
          color: 'from-orange-500 to-red-500',
          date: new Date(),
          subject: activity.subject,
          grade: activity.grade,
          points: 100,
        });

        // Check for perfect streak milestones
        if (currentStreak >= 3 && !progress.achievementsUnlocked.includes(`perfect_streak_3_${streakKey}`)) {
          milestones.push({
            id: `perfect_streak_${currentStreak}_${Date.now()}`,
            type: 'achievement',
            title: 'Quiz Master!',
            description: `${currentStreak} perfect scores in a row in ${activity.subject}!`,
            value: currentStreak,
            icon: '🏆',
            color: 'from-purple-500 to-pink-500',
            date: new Date(),
            subject: activity.subject,
            grade: activity.grade,
            points: currentStreak * 50,
          });
          
          newProgress.achievementsUnlocked.push(`perfect_streak_3_${streakKey}`);
        }
      } else {
        // Reset streak if not perfect
        const streakKey = `${activity.subject}_${activity.grade}`;
        newProgress.quizStreaks[streakKey] = 0;
      }
    }

    return milestones;
  };

  const checkMasteryMilestones = (activity: ActivityData, newProgress: MilestoneProgress): MilestoneData[] => {
    const milestones: MilestoneData[] = [];
    
    // Simulate mastery progress based on consistent high performance
    if (activity.score !== undefined && activity.score >= 90) {
      const masteryKey = `${activity.subject}_${activity.grade}`;
      const currentMastery = newProgress.subjectMasteries[masteryKey] || 0;
      const newMastery = Math.min(100, currentMastery + 10);
      newProgress.subjectMasteries[masteryKey] = newMastery;

      if (newMastery === 100 && currentMastery < 100) {
        milestones.push({
          id: `mastery_${masteryKey}_${Date.now()}`,
          type: 'mastery',
          title: `${activity.subject} Master!`,
          description: `You've mastered ${activity.subject} for Grade ${activity.grade}!`,
          value: 100,
          icon: '🎯',
          color: 'from-green-500 to-emerald-500',
          date: new Date(),
          subject: activity.subject,
          grade: activity.grade,
          points: 200,
        });
      }
    }

    return milestones;
  };

  const checkSpecialAchievements = (activity: ActivityData, newProgress: MilestoneProgress): MilestoneData[] => {
    const milestones: MilestoneData[] = [];
    
    // First time achievements
    if (activity.type === 'ai_question' && !progress.achievementsUnlocked.includes('first_ai_question')) {
      milestones.push({
        id: `first_ai_question_${Date.now()}`,
        type: 'achievement',
        title: 'AI Buddy Activated!',
        description: 'You asked your first question to the AI study buddy!',
        value: 1,
        icon: '🤖',
        color: 'from-purple-500 to-pink-500',
        date: new Date(),
        points: 25,
      });
      
      newProgress.achievementsUnlocked.push('first_ai_question');
    }

    // Points milestones
    const pointsMilestones = [100, 500, 1000, 2500, 5000, 10000];
    for (const milestone of pointsMilestones) {
      if (newProgress.totalPoints >= milestone && 
          progress.totalPoints < milestone && 
          !progress.achievementsUnlocked.includes(`points_${milestone}`)) {
        milestones.push({
          id: `points_${milestone}_${Date.now()}`,
          type: 'achievement',
          title: `${milestone} Points Club!`,
          description: `You've earned ${milestone} total points! Keep up the great work!`,
          value: milestone,
          icon: '💎',
          color: 'from-indigo-500 to-purple-500',
          date: new Date(),
          points: milestone / 10,
        });
        
        newProgress.achievementsUnlocked.push(`points_${milestone}`);
      }
    }

    return milestones;
  };

  const checkForMilestones = async (activity: ActivityData): Promise<MilestoneData[]> => {
    const now = new Date();
    const today = now.toDateString();
    const lastActivity = progress.lastActivityDate?.toDateString();
    
    // Create new progress object
    const newProgress = { ...progress };
    
    // Update points
    newProgress.totalPoints += activity.pointsEarned;
    
    // Update streak
    if (lastActivity !== today) {
      if (lastActivity && 
          new Date(lastActivity).getTime() === new Date(today).getTime() - 24 * 60 * 60 * 1000) {
        // Consecutive day
        newProgress.streakDays += 1;
      } else if (lastActivity !== today) {
        // Streak broken or first activity
        newProgress.streakDays = 1;
      }
      newProgress.lastActivityDate = now;
    }

    // Check all milestone types
    const allMilestones: MilestoneData[] = [
      ...checkStreakMilestone(newProgress),
      ...checkLevelMilestone(newProgress),
      ...checkQuizMilestones(activity, newProgress),
      ...checkMasteryMilestones(activity, newProgress),
      ...checkSpecialAchievements(activity, newProgress),
    ];

    // Update progress
    setProgress(newProgress);

    // Add to recent milestones
    if (allMilestones.length > 0) {
      setRecentMilestones(prev => [...allMilestones, ...prev].slice(0, 20)); // Keep last 20
      
      // Celebrate the first milestone
      if (allMilestones[0]) {
        setTimeout(() => celebrateMilestone(allMilestones[0]), 500);
      }
    }

    return allMilestones;
  };

  const resetProgress = () => {
    const defaultProgress: MilestoneProgress = {
      streakDays: 0,
      totalPoints: 0,
      currentLevel: 1,
      subjectMasteries: {},
      quizStreaks: {},
      achievementsUnlocked: [],
      lastActivityDate: null,
    };
    setProgress(defaultProgress);
    setRecentMilestones([]);
  };

  const getRecentMilestones = () => {
    return recentMilestones;
  };

  const contextValue: MilestoneContextType = {
    progress,
    checkForMilestones,
    resetProgress,
    getRecentMilestones,
    updateProgress,
  };

  return (
    <MilestoneContext.Provider value={contextValue}>
      {children}
      <MilestoneCelebration
        milestone={currentMilestone}
        open={isOpen}
        onClose={closeCelebration}
        userName={user?.username}
      />
    </MilestoneContext.Provider>
  );
}

export function useMilestoneTracker() {
  const context = useContext(MilestoneContext);
  if (!context) {
    throw new Error('useMilestoneTracker must be used within a MilestoneProvider');
  }
  return context;
}
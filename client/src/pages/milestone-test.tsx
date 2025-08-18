import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMilestoneTracker } from '@/hooks/use-milestone-tracker';
import { MilestoneDashboard } from '@/components/milestone-dashboard';

export default function MilestoneTest() {
  const { checkForMilestones, progress } = useMilestoneTracker();
  const [testResults, setTestResults] = useState<string[]>([]);

  const triggerTestMilestone = async (type: 'quiz' | 'study' | 'streak' | 'ai') => {
    const activities = {
      quiz: {
        type: 'quiz_completed' as const,
        subject: 'math',
        grade: '2',
        score: 100,
        pointsEarned: 100,
        correctAnswers: 10,
        totalQuestions: 10,
      },
      study: {
        type: 'study_session' as const,
        subject: 'science',
        grade: '3',
        pointsEarned: 150,
        timeSpent: 20,
      },
      streak: {
        type: 'flashcard_practice' as const,
        subject: 'vocabulary',
        grade: '1',
        pointsEarned: 50,
      },
      ai: {
        type: 'ai_question' as const,
        subject: 'history',
        grade: '4',
        pointsEarned: 25,
      }
    };

    try {
      const milestones = await checkForMilestones(activities[type]);
      const result = milestones.length > 0 
        ? `✅ Triggered ${milestones.length} milestone(s): ${milestones.map(m => m.title).join(', ')}`
        : `ℹ️ No milestones triggered for ${type}`;
      
      setTestResults(prev => [result, ...prev.slice(0, 4)]);
    } catch (error) {
      setTestResults(prev => [`❌ Error: ${error}`, ...prev.slice(0, 4)]);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Milestone System Test</h1>
          <p className="text-gray-600">Test the gamified milestone and social sharing system</p>
        </div>

        {/* Current Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Current Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{progress.streakDays}</div>
                <div className="text-sm text-gray-600">Streak Days</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{progress.currentLevel}</div>
                <div className="text-sm text-gray-600">Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{progress.totalPoints}</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{progress.achievementsUnlocked.length}</div>
                <div className="text-sm text-gray-600">Achievements</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Triggers */}
        <Card>
          <CardHeader>
            <CardTitle>Test Milestone Triggers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => triggerTestMilestone('quiz')}
                className="bg-orange-500 hover:bg-orange-600"
                data-testid="test-quiz-milestone"
              >
                Perfect Quiz Score
              </Button>
              <Button 
                onClick={() => triggerTestMilestone('study')}
                className="bg-green-500 hover:bg-green-600"
                data-testid="test-study-milestone"
              >
                Study Session
              </Button>
              <Button 
                onClick={() => triggerTestMilestone('streak')}
                className="bg-yellow-500 hover:bg-yellow-600"
                data-testid="test-streak-milestone"
              >
                Daily Activity
              </Button>
              <Button 
                onClick={() => triggerTestMilestone('ai')}
                className="bg-purple-500 hover:bg-purple-600"
                data-testid="test-ai-milestone"
              >
                AI Question
              </Button>
            </div>
            
            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="mt-6 space-y-2">
                <h4 className="font-semibold">Test Results:</h4>
                {testResults.map((result, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-sm font-mono">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Milestone Dashboard */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Milestone Dashboard</h2>
          <MilestoneDashboard />
        </div>
      </div>
    </div>
  );
}
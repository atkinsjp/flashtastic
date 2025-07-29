import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Target, TrendingUp, Clock, Flame, Trophy, Star, BookOpen } from "lucide-react";

// Mock data
const mockProgress = {
  overallProgress: 67,
  todayStudyTime: 45,
  weeklyGoal: 300,
  currentStreak: 7,
  totalPoints: 1247,
  badges: 12,
  subjects: [
    { name: "Math", progress: 85, cardsLearned: 42, color: "bg-turquoise" },
    { name: "Vocabulary", progress: 72, cardsLearned: 38, color: "bg-coral" },
    { name: "Science", progress: 91, cardsLearned: 29, color: "bg-sky" },
    { name: "Geography", progress: 56, cardsLearned: 22, color: "bg-golden" },
    { name: "History", progress: 68, cardsLearned: 31, color: "bg-purple-500" },
    { name: "Biology", progress: 43, cardsLearned: 18, color: "bg-green-500" },
  ],
  recentSessions: [
    { date: "Today", subject: "Math", duration: 15, score: 92, cards: 12 },
    { date: "Yesterday", subject: "Science", duration: 20, score: 88, cards: 15 },
    { date: "Yesterday", subject: "Vocabulary", duration: 10, score: 95, cards: 8 },
    { date: "2 days ago", subject: "Geography", duration: 18, score: 76, cards: 10 },
  ],
  weeklyActivity: [
    { day: "Mon", minutes: 25 },
    { day: "Tue", minutes: 30 },
    { day: "Wed", minutes: 15 },
    { day: "Thu", minutes: 45 },
    { day: "Fri", minutes: 35 },
    { day: "Sat", minutes: 40 },
    { day: "Sun", minutes: 20 },
  ]
};

export default function Progress() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");

  return (
    <div className="min-h-screen p-4 bg-[#5b5dcf57]">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Progress</h1>
          <p className="text-gray-600">Track your learning journey and achievements</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-coral bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Flame className="h-6 w-6 text-coral" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{mockProgress.currentStreak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-turquoise bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="h-6 w-6 text-turquoise" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{mockProgress.totalPoints.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-sky bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="h-6 w-6 text-sky" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{mockProgress.badges}</div>
              <div className="text-sm text-gray-600">Badges Earned</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-mint bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="h-6 w-6 text-mint" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{mockProgress.todayStudyTime}m</div>
              <div className="text-sm text-gray-600">Today</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overall Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-coral" />
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Learning Progress</span>
                    <span className="text-sm text-gray-600">{mockProgress.overallProgress}%</span>
                  </div>
                  <ProgressBar value={mockProgress.overallProgress} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Weekly Goal</span>
                    <span className="text-sm text-gray-600">
                      {mockProgress.todayStudyTime * 7}/{mockProgress.weeklyGoal} min
                    </span>
                  </div>
                  <ProgressBar value={(mockProgress.todayStudyTime * 7 / mockProgress.weeklyGoal) * 100} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Weekly Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-sky" />
                  Weekly Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between space-x-2 h-32">
                  {mockProgress.weeklyActivity.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-sky rounded-t-md min-h-[4px]"
                        style={{ height: `${(day.minutes / 50) * 100}%` }}
                      ></div>
                      <span className="text-xs text-gray-600 mt-2">{day.day}</span>
                      <span className="text-xs font-bold">{day.minutes}m</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-mint" />
                  Recent Study Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockProgress.recentSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-turquoise bg-opacity-20 rounded-full flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-turquoise" />
                      </div>
                      <div>
                        <p className="font-semibold">{session.subject}</p>
                        <p className="text-sm text-gray-600">{session.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={session.score >= 90 ? "default" : "secondary"}>
                        {session.score}%
                      </Badge>
                      <p className="text-sm text-gray-600">
                        {session.duration}m • {session.cards} cards
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {mockProgress.subjects.map((subject, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{subject.name}</span>
                      <Badge variant="outline">{subject.cardsLearned} cards</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-gray-600">{subject.progress}%</span>
                      </div>
                      <ProgressBar value={subject.progress} className="h-3" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-gray-800">{subject.cardsLearned}</div>
                        <div className="text-xs text-gray-600">Cards Learned</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">
                          {Math.round((subject.cardsLearned / 50) * 100)}%
                        </div>
                        <div className="text-xs text-gray-600">Accuracy</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => (
                    <div 
                      key={i} 
                      className={`h-8 rounded ${
                        i % 7 === 0 || i % 7 === 6 ? 'bg-green-200' : 
                        i % 3 === 0 ? 'bg-green-400' : 'bg-gray-100'
                      }`}
                    ></div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                  <span>Less</span>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-gray-100 rounded"></div>
                    <div className="w-3 h-3 bg-green-200 rounded"></div>
                    <div className="w-3 h-3 bg-green-400 rounded"></div>
                    <div className="w-3 h-3 bg-green-600 rounded"></div>
                  </div>
                  <span>More</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Recent Achievements */}
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: "Math Master", icon: "🔢", rarity: "gold" },
                      { name: "Word Wizard", icon: "📚", rarity: "silver" },
                      { name: "Science Star", icon: "🔬", rarity: "bronze" },
                      { name: "Geography Guru", icon: "🌍", rarity: "gold" }
                    ].map((achievement, index) => (
                      <div key={index} className="text-center p-4 border rounded-lg">
                        <div className="text-4xl mb-2">{achievement.icon}</div>
                        <p className="font-semibold text-sm">{achievement.name}</p>
                        <Badge 
                          variant="outline" 
                          className={`mt-1 ${
                            achievement.rarity === 'gold' ? 'border-yellow-500 text-yellow-600' :
                            achievement.rarity === 'silver' ? 'border-gray-400 text-gray-600' :
                            'border-orange-500 text-orange-600'
                          }`}
                        >
                          {achievement.rarity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

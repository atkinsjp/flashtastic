import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar as CalendarIcon, 
  Clock, 
  Target, 
  Award, 
  BookOpen, 
  Brain,
  Star,
  Users,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  Trophy
} from "lucide-react";

// Mock data for parent dashboard
const mockChildren = [
  {
    id: "student-1",
    name: "Emma Johnson",
    avatar: "1",
    grade: "2",
    points: 1247,
    level: 5,
    streak: 7,
    lastActive: "2025-01-04T18:30:00Z",
    weeklyGoal: 300, // minutes
    weeklyProgress: 245,
    strongSubjects: ["Math", "Science"],
    needsWork: ["Geography"],
    recentAchievements: 3
  },
  {
    id: "student-2", 
    name: "Alex Johnson",
    avatar: "2",
    grade: "5",
    points: 890,
    level: 3,
    streak: 4,
    lastActive: "2025-01-04T16:15:00Z",
    weeklyGoal: 240,
    weeklyProgress: 180,
    strongSubjects: ["Vocabulary", "History"],
    needsWork: ["Math", "Science"],
    recentAchievements: 1
  }
];

const mockWeeklyData = [
  { day: "Mon", Emma: 45, Alex: 30, target: 40 },
  { day: "Tue", Emma: 52, Alex: 25, target: 40 },
  { day: "Wed", Emma: 38, Alex: 42, target: 40 },
  { day: "Thu", Emma: 41, Alex: 35, target: 40 },
  { day: "Fri", Emma: 55, Alex: 28, target: 40 },
  { day: "Sat", Emma: 28, Alex: 20, target: 40 },
  { day: "Sun", Emma: 35, Alex: 0, target: 40 }
];

const mockSubjectProgress = [
  { subject: "Math", Emma: 85, Alex: 62 },
  { subject: "Science", Emma: 92, Alex: 58 },
  { subject: "Vocabulary", Emma: 78, Alex: 88 },
  { subject: "Geography", Emma: 65, Alex: 75 },
  { subject: "History", Emma: 82, Alex: 91 }
];

const mockMonthlyTrend = [
  { month: "Oct", studyTime: 180, achievements: 8, accuracy: 78 },
  { month: "Nov", studyTime: 220, achievements: 12, accuracy: 82 },
  { month: "Dec", studyTime: 195, achievements: 15, accuracy: 85 },
  { month: "Jan", studyTime: 245, achievements: 18, accuracy: 88 }
];

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

export default function ParentDashboard() {
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("week");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Filter data based on selected child
  const getChildData = () => {
    if (selectedChild === "all") return mockChildren;
    return mockChildren.filter(child => child.id === selectedChild);
  };

  const selectedChildData = mockChildren.find(child => child.id === selectedChild);

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="container mx-auto max-w-7xl">
        {/* Header with Family Photo */}
        <div className="mb-6">
          {/* Family Learning Hero Section */}
          <div className="relative mb-6 rounded-xl overflow-hidden shadow-lg">
            <img 
              src="/attached_assets/Father_Kids_Studying_1757029276280.png"
              alt="Father helping children with educational app"
              className="w-full h-48 md:h-56 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
              <div className="text-white p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Parent Dashboard</h1>
                <p className="text-lg opacity-90">Monitor your children's learning progress and achievements</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Learning Analytics & Insights</h2>
              <p className="text-gray-600 text-sm">Track progress, celebrate achievements, and guide your children's educational journey</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select child" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Children</SelectItem>
                  {mockChildren.map(child => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name} (Grade {child.grade})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Study Time</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {getChildData().reduce((acc, child) => acc + child.weeklyProgress, 0)} min
                  </p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% this week
                  </p>
                </div>
                <div className="w-12 h-12 bg-coral bg-opacity-20 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-coral" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Achievements</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {getChildData().reduce((acc, child) => acc + child.recentAchievements, 0)}
                  </p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <Award className="h-3 w-3 mr-1" />
                    New this week
                  </p>
                </div>
                <div className="w-12 h-12 bg-golden bg-opacity-20 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-golden" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Accuracy</p>
                  <p className="text-2xl font-bold text-gray-800">85%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <Target className="h-3 w-3 mr-1" />
                    +3% improvement
                  </p>
                </div>
                <div className="w-12 h-12 bg-turquoise bg-opacity-20 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-turquoise" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Learning Streak</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {Math.max(...getChildData().map(child => child.streak))} days
                  </p>
                  <p className="text-xs text-coral flex items-center mt-1">
                    <Activity className="h-3 w-3 mr-1" />
                    Best streak
                  </p>
                </div>
                <div className="w-12 h-12 bg-mint bg-opacity-20 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-mint" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Children Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Children Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockChildren.map((child) => (
                    <div key={child.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={`/avatars/avatar-${child.avatar}.svg`}
                          alt={child.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-800">{child.name}</h4>
                          <p className="text-sm text-gray-600">Grade {child.grade} • Level {child.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <Star className="h-4 w-4 text-golden" />
                          <span className="font-semibold">{child.points}</span>
                        </div>
                        <Badge variant={child.streak >= 5 ? "default" : "secondary"} className="text-xs">
                          {child.streak} day streak
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Weekly Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Weekly Study Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockWeeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="Emma" fill="#FF6B6B" name="Emma" />
                      <Bar dataKey="Alex" fill="#4ECDC4" name="Alex" />
                      <Bar dataKey="target" fill="#E0E0E0" name="Daily Goal" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border-l-4 border-green-500 rounded">
                    <div className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Emma earned "Math Master" achievement</p>
                        <p className="text-sm text-gray-600">Completed 50 math problems correctly</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">2 hours ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Alex completed Science quiz</p>
                        <p className="text-sm text-gray-600">Scored 85% on Grade 5 Biology</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">5 hours ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 border-l-4 border-purple-500 rounded">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Emma's learning companion evolved</p>
                        <p className="text-sm text-gray-600">Advanced to Young Plant stage</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">1 day ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Learning Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={mockMonthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="studyTime" stroke="#FF6B6B" fill="#FF6B6B" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Accuracy Improvement */}
              <Card>
                <CardHeader>
                  <CardTitle>Accuracy Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockMonthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="accuracy" stroke="#4ECDC4" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Individual Progress */}
            {selectedChild !== "all" && selectedChildData && (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedChildData.name}'s Weekly Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Study Time Goal</span>
                        <span>{selectedChildData.weeklyProgress} / {selectedChildData.weeklyGoal} min</span>
                      </div>
                      <Progress value={(selectedChildData.weeklyProgress / selectedChildData.weeklyGoal) * 100} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-700">Strong Subjects</h4>
                        <div className="mt-2">
                          {selectedChildData.strongSubjects.map((subject) => (
                            <Badge key={subject} variant="secondary" className="m-1 bg-green-100 text-green-700">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <h4 className="font-semibold text-yellow-700">Needs Practice</h4>
                        <div className="mt-2">
                          {selectedChildData.needsWork.map((subject) => (
                            <Badge key={subject} variant="secondary" className="m-1 bg-yellow-100 text-yellow-700">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-700">Recent Achievements</h4>
                        <div className="text-2xl font-bold text-blue-700 mt-2">
                          {selectedChildData.recentAchievements}
                        </div>
                        <p className="text-sm text-blue-600">This week</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={mockSubjectProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="Emma" fill="#FF6B6B" name="Emma" />
                    <Bar dataKey="Alex" fill="#4ECDC4" name="Alex" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Peak Learning Hours</h4>
                      <p className="text-blue-700">Emma learns best between 4-6 PM with 92% accuracy</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Consistency Improvement</h4>
                      <p className="text-green-700">Alex has maintained a 4-day streak, up from 2 days last week</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Subject Preference</h4>
                      <p className="text-purple-700">Both children prefer interactive quiz formats over flashcards</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border-l-4 border-coral rounded-lg bg-red-50">
                      <h4 className="font-semibold text-coral mb-2">For Emma</h4>
                      <p className="text-gray-700 text-sm">Focus on geography practice - consider visual learning tools and maps</p>
                    </div>
                    <div className="p-4 border-l-4 border-turquoise rounded-lg bg-teal-50">
                      <h4 className="font-semibold text-turquoise mb-2">For Alex</h4>
                      <p className="text-gray-700 text-sm">Math improvement needed - try gamified math exercises and visual problems</p>
                    </div>
                    <div className="p-4 border-l-4 border-golden rounded-lg bg-yellow-50">
                      <h4 className="font-semibold text-golden mb-2">Family Goal</h4>
                      <p className="text-gray-700 text-sm">Set up study buddy sessions where Emma helps Alex with science</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Family Learning Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockChildren.map((child) => (
                    <div key={child.id} className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-4">{child.name}'s Goals</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Weekly Study Time</span>
                            <span>{child.weeklyProgress}/{child.weeklyGoal} min</span>
                          </div>
                          <Progress value={(child.weeklyProgress / child.weeklyGoal) * 100} />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Learning Streak</span>
                            <span>{child.streak}/7 days</span>
                          </div>
                          <Progress value={(child.streak / 7) * 100} />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Next Level Progress</span>
                            <span>Level {child.level}</span>
                          </div>
                          <Progress value={75} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
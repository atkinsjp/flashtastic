import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Trophy,
  Medal,
  Crown,
  Zap,
  Target,
  Clock,
  Users,
  Star,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  Plus,
  Swords,
  Flag,
  Award,
  Calendar,
  Flame
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

// Mock data for sibling competitions
const mockSiblings = [
  {
    id: "sibling-1",
    name: "Emma",
    avatar: "1",
    points: 1247,
    level: 5,
    streak: 7,
    weeklyPoints: 245,
    monthlyPoints: 980,
    strongSubjects: ["Math", "Science"],
    rank: 1,
    badges: ["Speed Demon", "Accuracy Master", "Streak Champion"]
  },
  {
    id: "sibling-2", 
    name: "Alex",
    avatar: "2",
    points: 890,
    level: 3,
    streak: 4,
    weeklyPoints: 180,
    monthlyPoints: 720,
    strongSubjects: ["Vocabulary", "History"], 
    rank: 2,
    badges: ["Word Wizard", "History Buff"]
  }
];

const mockChallenges = [
  {
    id: "challenge-1",
    challengerId: "sibling-1",
    challengedId: "sibling-2",
    challengerName: "Emma",
    challengedName: "Alex",
    type: "speed_round",
    subject: "math",
    status: "active",
    targetScore: 20,
    challengerScore: 15,
    challengedScore: 12,
    timeRemaining: 3600, // 1 hour in seconds
    reward: { points: 100, badge: "Speed Demon" },
    createdAt: "2025-01-04T18:00:00Z"
  },
  {
    id: "challenge-2",
    challengerId: "sibling-2", 
    challengedId: "sibling-1",
    challengerName: "Alex",
    challengedName: "Emma",
    type: "accuracy_battle",
    subject: "vocabulary",
    status: "pending",
    targetScore: 15,
    challengerScore: 0,
    challengedScore: 0,
    timeRemaining: 7200, // 2 hours
    reward: { points: 150, badge: "Precision Pro" },
    createdAt: "2025-01-04T19:30:00Z"
  }
];

const mockLeaderboards = [
  {
    type: "weekly_points",
    title: "Weekly Champions",
    rankings: [
      { id: "sibling-1", name: "Emma", score: 245, rank: 1, change: 0, avatar: "1" },
      { id: "sibling-2", name: "Alex", score: 180, rank: 2, change: 0, avatar: "2" }
    ]
  },
  {
    type: "monthly_streak",
    title: "Streak Masters",
    rankings: [
      { id: "sibling-1", name: "Emma", score: 7, rank: 1, change: 1, avatar: "1" },
      { id: "sibling-2", name: "Alex", score: 4, rank: 2, change: -1, avatar: "2" }
    ]
  },
  {
    type: "subject_accuracy",
    title: "Accuracy Kings",
    rankings: [
      { id: "sibling-1", name: "Emma", score: 92, rank: 1, change: 0, avatar: "1" },
      { id: "sibling-2", name: "Alex", score: 88, rank: 2, change: 1, avatar: "2" }
    ]
  }
];

const mockCollaborativeGoals = [
  {
    id: "goal-1",
    title: "Family Math Masters",
    description: "Together earn 1000 points in Math this month",
    targetValue: 1000,
    currentValue: 650,
    participantIds: ["sibling-1", "sibling-2"],
    participants: ["Emma", "Alex"],
    status: "active",
    reward: { points: 200, badge: "Team Player" },
    dueDate: "2025-01-31T23:59:59Z"
  },
  {
    id: "goal-2",
    title: "7-Day Study Streak",
    description: "Both siblings maintain study streaks for 7 consecutive days",
    targetValue: 7,
    currentValue: 4,
    participantIds: ["sibling-1", "sibling-2"],
    participants: ["Emma", "Alex"],
    status: "active", 
    reward: { points: 300, badge: "Consistency Champions" },
    dueDate: "2025-01-11T23:59:59Z"
  }
];

const challengeTypes = [
  {
    id: "speed_round",
    name: "Speed Round",
    description: "First to answer 20 questions correctly wins",
    icon: <Zap className="h-5 w-5" />,
    duration: 30,
    color: "text-yellow-600"
  },
  {
    id: "accuracy_battle", 
    name: "Accuracy Battle",
    description: "Highest accuracy percentage after 15 questions",
    icon: <Target className="h-5 w-5" />,
    duration: 60,
    color: "text-green-600"
  },
  {
    id: "streak_challenge",
    name: "Streak Challenge",
    description: "Who can maintain the longest correct answer streak",
    icon: <Flame className="h-5 w-5" />,
    duration: 45,
    color: "text-red-600"
  },
  {
    id: "subject_mastery",
    name: "Subject Mastery",
    description: "Complete all flashcards in a subject first",
    icon: <Crown className="h-5 w-5" />,
    duration: 120,
    color: "text-purple-600"
  }
];

export default function Competitions() {
  const [selectedChallenge, setSelectedChallenge] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [challengeTarget, setChallengeTarget] = useState("");
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const { toast } = useToast();

  // Format time remaining
  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Create challenge mutation
  const createChallengeMutation = useMutation({
    mutationFn: async (challengeData: any) => {
      // Mock API call - in real app would post to /api/challenges
      await new Promise(resolve => setTimeout(resolve, 1000));
      return challengeData;
    },
    onSuccess: () => {
      toast({ title: "Challenge sent!", description: "Your sibling will be notified" });
      queryClient.invalidateQueries({ queryKey: ["/api/challenges"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send challenge", variant: "destructive" });
    }
  });

  // Accept challenge mutation  
  const acceptChallengeMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return challengeId;
    },
    onSuccess: () => {
      toast({ title: "Challenge accepted!", description: "Let the battle begin!" });
    }
  });

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            <Swords className="h-8 w-8 mr-3 text-orange-500" />
            Sibling Competitions
          </h1>
          <p className="text-gray-600">Challenge your siblings and compete to become the ultimate learner!</p>
        </div>

        <Tabs defaultValue="challenges" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="challenges">Active Challenges</TabsTrigger>
            <TabsTrigger value="leaderboards">Leaderboards</TabsTrigger>
            <TabsTrigger value="goals">Team Goals</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Active Challenges */}
          <TabsContent value="challenges" className="space-y-6">
            {/* Create New Challenge */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Challenge
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        <Swords className="h-4 w-4 mr-2" />
                        Challenge Sibling
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Sibling Challenge</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Challenge Type</Label>
                          <Select value={selectedChallenge} onValueChange={setSelectedChallenge}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select challenge type" />
                            </SelectTrigger>
                            <SelectContent>
                              {challengeTypes.map(type => (
                                <SelectItem key={type.id} value={type.id}>
                                  <div className="flex items-center space-x-2">
                                    <span className={type.color}>{type.icon}</span>
                                    <span>{type.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Subject</Label>
                          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="math">Math</SelectItem>
                              <SelectItem value="science">Science</SelectItem>
                              <SelectItem value="vocabulary">Vocabulary</SelectItem>
                              <SelectItem value="geography">Geography</SelectItem>
                              <SelectItem value="history">History</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Target Score</Label>
                          <Input 
                            type="number" 
                            placeholder="e.g. 20" 
                            value={challengeTarget}
                            onChange={(e) => setChallengeTarget(e.target.value)}
                          />
                        </div>

                        <Button 
                          className="w-full bg-orange-500 hover:bg-orange-600"
                          onClick={() => createChallengeMutation.mutate({
                            type: selectedChallenge,
                            subject: selectedSubject,
                            target: challengeTarget
                          })}
                          disabled={createChallengeMutation.isPending}
                        >
                          {createChallengeMutation.isPending ? "Sending..." : "Send Challenge"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
            </Card>

            {/* Active Challenges List */}
            <div className="grid gap-4">
              {mockChallenges.map((challenge) => {
                const challengeType = challengeTypes.find(t => t.id === challenge.type);
                const isWinning = challenge.challengerScore > challenge.challengedScore;
                
                return (
                  <Card key={challenge.id} className="border-l-4 border-orange-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-full ${challengeType?.color === "text-yellow-600" ? "bg-yellow-100" : 
                                         challengeType?.color === "text-green-600" ? "bg-green-100" :
                                         challengeType?.color === "text-red-600" ? "bg-red-100" : "bg-purple-100"}`}>
                            {challengeType?.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{challengeType?.name}</h3>
                            <p className="text-gray-600 text-sm">{challenge.subject.charAt(0).toUpperCase() + challenge.subject.slice(1)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={challenge.status === "active" ? "default" : "secondary"}>
                            {challenge.status}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            <Clock className="h-4 w-4 inline mr-1" />
                            {formatTimeRemaining(challenge.timeRemaining)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 mb-4">
                        <div className="text-center">
                          <img 
                            src={`/avatars/avatar-1.svg`}
                            alt={challenge.challengerName}
                            className="w-12 h-12 rounded-full mx-auto mb-2"
                          />
                          <h4 className="font-semibold">{challenge.challengerName}</h4>
                          <div className="text-2xl font-bold text-orange-500">
                            {challenge.challengerScore}
                          </div>
                          <Progress 
                            value={(challenge.challengerScore / challenge.targetScore) * 100} 
                            className="mt-2"
                          />
                        </div>

                        <div className="text-center">
                          <img 
                            src={`/avatars/avatar-2.svg`}
                            alt={challenge.challengedName}
                            className="w-12 h-12 rounded-full mx-auto mb-2"
                          />
                          <h4 className="font-semibold">{challenge.challengedName}</h4>
                          <div className="text-2xl font-bold text-turquoise">
                            {challenge.challengedScore}
                          </div>
                          <Progress 
                            value={(challenge.challengedScore / challenge.targetScore) * 100} 
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Target: {challenge.targetScore} • Reward: {challenge.reward.points} points
                        </div>
                        <div className="space-x-2">
                          {challenge.status === "pending" && (
                            <Button 
                              size="sm" 
                              className="bg-green-500 hover:bg-green-600"
                              onClick={() => acceptChallengeMutation.mutate(challenge.id)}
                              disabled={acceptChallengeMutation.isPending}
                            >
                              Accept Challenge
                            </Button>
                          )}
                          {challenge.status === "active" && (
                            <Button size="sm" variant="outline">
                              Continue Battle
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Leaderboards */}
          <TabsContent value="leaderboards" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {mockLeaderboards.map((leaderboard, index) => (
                <Card key={leaderboard.type}>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      {index === 0 ? <Trophy className="h-5 w-5 mr-2 text-yellow-500" /> :
                       index === 1 ? <Flame className="h-5 w-5 mr-2 text-red-500" /> :
                       <Target className="h-5 w-5 mr-2 text-green-500" />}
                      {leaderboard.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {leaderboard.rankings.map((player, playerIndex) => (
                        <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <span className={`text-lg font-bold ${
                                playerIndex === 0 ? "text-yellow-500" : 
                                playerIndex === 1 ? "text-gray-400" : "text-orange-500"
                              }`}>
                                #{player.rank}
                              </span>
                              {playerIndex === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                            </div>
                            <img 
                              src={`/avatars/avatar-${player.avatar}.svg`}
                              alt={player.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="font-semibold">{player.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold">{player.score}</span>
                            {player.change > 0 && <ChevronUp className="h-4 w-4 text-green-500" />}
                            {player.change < 0 && <ChevronDown className="h-4 w-4 text-red-500" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Collaborative Goals */}
          <TabsContent value="goals" className="space-y-6">
            {/* Create Goal */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Family Team Goals
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-500 hover:bg-blue-600">
                        <Flag className="h-4 w-4 mr-2" />
                        Create Goal
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Family Goal</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Goal Title</Label>
                          <Input 
                            placeholder="e.g. Math Masters Challenge"
                            value={newGoalTitle}
                            onChange={(e) => setNewGoalTitle(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea 
                            placeholder="Describe the team goal..."
                            value={newGoalDescription}
                            onChange={(e) => setNewGoalDescription(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Target Value</Label>
                          <Input 
                            type="number"
                            placeholder="e.g. 1000"
                            value={newGoalTarget}
                            onChange={(e) => setNewGoalTarget(e.target.value)}
                          />
                        </div>
                        <Button className="w-full bg-blue-500 hover:bg-blue-600">
                          Create Team Goal
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
            </Card>

            {/* Active Goals */}
            <div className="grid gap-4">
              {mockCollaborativeGoals.map((goal) => (
                <Card key={goal.id} className="border-l-4 border-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{goal.title}</h3>
                        <p className="text-gray-600">{goal.description}</p>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Team Goal
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{goal.currentValue} / {goal.targetValue}</span>
                      </div>
                      <Progress value={(goal.currentValue / goal.targetValue) * 100} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Team:</span>
                        {goal.participants.map((participant, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {participant}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Due {new Date(goal.dueDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-800">Reward</span>
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-bold">{goal.reward.points} points</span>
                          <Award className="h-4 w-4 text-purple-500" />
                          <span className="text-sm">{goal.reward.badge}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* History */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Competition History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border-l-4 border-green-500 rounded">
                    <div className="flex items-center space-x-3">
                      <Trophy className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Emma won Speed Round - Science</p>
                        <p className="text-sm text-gray-600">Score: 18-12 • Earned 150 points</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">2 days ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Completed "Vocabulary Voyage" team goal</p>
                        <p className="text-sm text-gray-600">Both siblings earned 200 points</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">1 week ago</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                    <div className="flex items-center space-x-3">
                      <Medal className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium">Alex achieved "Streak Master" badge</p>
                        <p className="text-sm text-gray-600">5-day learning streak maintained</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">2 weeks ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
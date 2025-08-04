import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, Bell, Shield, Star, Award, Edit3 } from "lucide-react";
import AvatarCustomizer from "@/components/avatar-customizer";
import LearningAvatar from "@/components/learning-avatar";

// Mock user data with avatar growth
const mockUser = {
  id: "user-1",
  name: "Emma Johnson",
  username: "emma_learner",
  grade: "2",
  avatar: "1",
  points: 1247,
  level: 5,
  streak: 7,
  badges: 12,
  joinedDate: "September 2024",
  favoriteSubjects: ["Math", "Science", "Vocabulary"],
  avatarGrowth: {
    stage: 3,
    experience: 324,
    unlocks: ["glasses", "hat"],
    accessories: ["glasses"],
    mood: "happy"
  },
  achievements: [
    { id: "math-master", name: "Math Master", icon: "🔢", description: "Completed 50 math problems", rarity: "gold" },
    { id: "word-wizard", name: "Word Wizard", icon: "📚", description: "Learned 100 vocabulary words", rarity: "silver" },
    { id: "science-star", name: "Science Star", icon: "🔬", description: "Mastered 25 science facts", rarity: "bronze" },
    { id: "geography-guru", name: "Geography Guru", icon: "🌍", description: "Learned 30 geography facts", rarity: "gold" },
  ]
};

const mockSettings = {
  notifications: true,
  sounds: true,
  darkMode: false,
  studyReminders: true,
  weeklyGoal: 300, // minutes
  reminderTime: "18:00"
};

export default function Profile() {
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState(mockSettings);
  const [userInfo, setUserInfo] = useState({
    name: mockUser.name,
    grade: mockUser.grade
  });
  const [avatarGrowth, setAvatarGrowth] = useState(mockUser.avatarGrowth);

  const handleSettingChange = (key: string, value: boolean | string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveProfile = () => {
    setIsEditing(false);
    // TODO: Save to API
    console.log("Saving profile:", userInfo);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-6">
                  {/* Traditional Avatar */}
                  <div 
                    className="relative cursor-pointer flex-shrink-0"
                    onClick={() => setShowAvatarModal(true)}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120" 
                      alt="Profile Avatar" 
                      className="w-20 h-20 rounded-full border-4 border-coral"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                      <Edit3 className="h-3 w-3 text-gray-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-800">{mockUser.name}</h2>
                      <Badge className="bg-coral">Grade {mockUser.grade}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">@{mockUser.username}</p>
                    
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-golden" />
                        <span className="font-semibold">{mockUser.points.toLocaleString()} points</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="h-5 w-5 text-turquoise" />
                        <span className="font-semibold">{mockUser.badges} badges</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Learning Companion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-2">🌱</span>
                  Your Learning Companion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6">
                  <LearningAvatar
                    points={mockUser.points}
                    level={mockUser.level}
                    streak={mockUser.streak}
                    avatarGrowth={avatarGrowth}
                    onGrowthUpdate={setAvatarGrowth}
                    className="flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-gray-600 mb-2">
                      Your learning companion grows as you study and earn achievements! 
                      Keep learning to unlock new stages and accessories.
                    </p>
                    <div className="text-sm text-gray-500">
                      Click your companion to customize its mood and accessories!
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name"
                          value={userInfo.name}
                          onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="grade">Grade Level</Label>
                        <select 
                          id="grade"
                          value={userInfo.grade}
                          onChange={(e) => setUserInfo(prev => ({ ...prev, grade: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          {['K', '1', '2', '3', '4', '5', '6', '7', '8'].map(grade => (
                            <option key={grade} value={grade}>Grade {grade}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <Button onClick={saveProfile} className="bg-coral hover:bg-coral/90">
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Full Name</Label>
                      <p className="font-semibold">{userInfo.name}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Grade Level</Label>
                      <p className="font-semibold">Grade {userInfo.grade}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Member Since</Label>
                      <p className="font-semibold">{mockUser.joinedDate}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Current Streak</Label>
                      <p className="font-semibold">{mockUser.streak} days 🔥</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Favorite Subjects */}
            <Card>
              <CardHeader>
                <CardTitle>Favorite Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockUser.favoriteSubjects.map((subject, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Achievement Collection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {mockUser.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="text-4xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-bold">{achievement.name}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
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
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Push Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications for achievements and reminders</p>
                  </div>
                  <Switch 
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sounds">Sound Effects</Label>
                    <p className="text-sm text-gray-600">Play sounds for correct answers and achievements</p>
                  </div>
                  <Switch 
                    id="sounds"
                    checked={settings.sounds}
                    onCheckedChange={(checked) => handleSettingChange('sounds', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reminders">Study Reminders</Label>
                    <p className="text-sm text-gray-600">Daily reminders to practice</p>
                  </div>
                  <Switch 
                    id="reminders"
                    checked={settings.studyReminders}
                    onCheckedChange={(checked) => handleSettingChange('studyReminders', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* App Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  App Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="weekly-goal">Weekly Study Goal (minutes)</Label>
                  <Input 
                    id="weekly-goal"
                    type="number"
                    value={settings.weeklyGoal}
                    onChange={(e) => handleSettingChange('weeklyGoal', parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="reminder-time">Daily Reminder Time</Label>
                  <Input 
                    id="reminder-time"
                    type="time"
                    value={settings.reminderTime}
                    onChange={(e) => handleSettingChange('reminderTime', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Export My Data
                </Button>
                <Button variant="outline" className="w-full">
                  Reset Progress
                </Button>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Study Time</span>
                    <span className="font-bold">127 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cards Mastered</span>
                    <span className="font-bold">234</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quizzes Taken</span>
                    <span className="font-bold">52</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Score</span>
                    <span className="font-bold">87%</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Milestones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Longest Streak</span>
                    <span className="font-bold">14 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best Subject</span>
                    <span className="font-bold">Science (91%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Level Reached</span>
                    <span className="font-bold">Level {mockUser.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Level</span>
                    <span className="font-bold">153 points</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <AvatarCustomizer 
          isOpen={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
          currentAvatar={mockUser.avatar}
          onAvatarChange={(avatar) => {
            console.log("Avatar changed to:", avatar);
            setShowAvatarModal(false);
          }}
        />
      </div>
    </div>
  );
}

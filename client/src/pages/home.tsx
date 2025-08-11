import { useState, useEffect } from "react";
import { GraduationCap, Flame, Trophy, Brain, Clock, User, LogOut, MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import GradeSelector from "@/components/grade-selector";
import SubjectGrid from "@/components/subject-grid";
import AvatarCustomizer from "@/components/avatar-customizer";
import AchievementPopup from "@/components/achievement-popup";
import QuizModal from "@/components/quiz-modal";
import AuthGate from "@/components/auth-gate";
import LearningAvatar from "@/components/learning-avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth, createGuestUser } from "@/contexts/auth-context";

// Mock user data - in real app this would come from API
const mockUser = {
  id: "user-1",
  name: "Emma",
  username: "emma_learner",
  grade: "2",
  avatar: "1",
  points: 1247,
  level: 5,
  streak: 7,
  badges: 12,
  cardsLearned: 234,
  studyTime: "2.5h",
  avatarGrowth: {
    stage: 3,
    experience: 324,
    unlocks: ["glasses", "hat"],
    accessories: ["glasses"],
    mood: "happy"
  }
};

const mockRecentAwards = [
  {
    id: "math-master",
    name: "Math Master",
    icon: "🔢",
    unlockedAt: "2 days ago"
  },
  {
    id: "word-wizard", 
    name: "Word Wizard",
    icon: "📚",
    unlockedAt: "5 days ago"
  },
  {
    id: "speed-reader",
    name: "Speed Reader", 
    icon: "⚡",
    unlockedAt: "1 week ago"
  },
  {
    id: "science-star",
    name: "Science Star",
    icon: "🔬", 
    unlockedAt: "1 week ago"
  }
];

export default function Home() {
  const { user, userMode, isGuest, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedGrade, setSelectedGrade] = useState(user?.grade || "2");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [avatarGrowth, setAvatarGrowth] = useState(mockUser.avatarGrowth);

  // Use guest user data for display if in guest mode
  const displayUser = user || createGuestUser(selectedGrade);

  // Show auth gate on first visit if no user mode is set
  useEffect(() => {
    if (!user && userMode === 'guest' && localStorage.getItem('flashtastic-mode') === null) {
      setShowAuthGate(true);
    }
  }, [user, userMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/attached_assets/FlashTastic Icon_1754739615841.jpg"
                alt="FlashTastic Icon" 
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwRDRGRiIvPgo8dGV4dCB4PSIyMCIgeT0iMjgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5GVDwvdGV4dD4KPC9zdmc+';
                }}
              />
              <img 
                src="/attached_assets/FlashTastic Logo-1_1754739615840.jpg"
                alt="FlashTastic Logo" 
                className="h-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjMyIiB2aWV3Qm94PSIwIDAgMTYwIDMyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8dGV4dCB4PSI4MCIgeT0iMjQiIGZvbnQtZmFtaWx5PSJBcmlhbCBCbGFjayIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9IjkwMCIgZmlsbD0iIzAwRDRGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Rmxhc2hUYXN0aWM8L3RleHQ+Cjwvc3ZnPgo=';
                }}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              {/* User Mode Badge */}
              {isGuest && (
                <Badge variant="outline" className="text-xs">
                  <User className="h-3 w-3 mr-1" />
                  Guest Mode
                </Badge>
              )}
              
              {/* User Avatar */}
              <div 
                className="relative cursor-pointer"
                onClick={() => isGuest ? setShowAuthGate(true) : setShowAvatarModal(true)}
              >
                <img 
                  src={`/avatars/avatar-${displayUser.avatar}.svg`}
                  alt="User Avatar" 
                  className="w-10 h-10 rounded-full border-2 border-turquoise"
                />
                {!isGuest && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-golden rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{displayUser.level}</span>
                  </div>
                )}
              </div>
              
              {/* Points Display or Sign Up Button */}
              {!isGuest ? (
                <div className="flex items-center space-x-2 bg-golden bg-opacity-20 px-3 py-1 rounded-full">
                  <span className="text-golden">⭐</span>
                  <span className="font-semibold text-golden">{(displayUser.points || 0).toLocaleString()}</span>
                </div>
              ) : (
                <Button 
                  size="sm"
                  onClick={() => setShowAuthGate(true)}
                  className="bg-coral hover:bg-coral/90 text-white"
                >
                  Sign Up
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isGuest ? 'Welcome to FlashTastic! 🎉' : `Welcome back, ${displayUser.name}! 🎉`}
            </h2>
            <p className="text-gray-600 text-lg">
              {isGuest ? 'Start learning with interactive flash cards and fun quizzes!' : 'Ready to learn something amazing today?'}
            </p>
          </div>
          
          {/* Quick Stats */}
          {isGuest ? (
            <div className="bg-white rounded-xl p-6 shadow-md text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Guest Mode Features</h3>
              <p className="text-gray-600 mb-4">Sign up to unlock full features and track your progress!</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-green-700 font-medium">✓ All flash cards</div>
                <div className="text-green-700 font-medium">✓ Basic quizzes</div>
                <div className="text-gray-600 font-medium">✗ Progress tracking</div>
                <div className="text-gray-600 font-medium">✗ Achievements</div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 mb-6">
              {/* Learning Avatar Section */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Your Learning Companion</h3>
                  <Badge variant="secondary" className="text-xs">Growing with you!</Badge>
                </div>
                <div className="flex items-center space-x-6">
                  <LearningAvatar
                    points={displayUser.points || 0}
                    level={displayUser.level || 1}
                    streak={displayUser.streak || 0}
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
                      Next unlock at Level {Math.ceil((displayUser.level || 1) / 5) * 5}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-md text-center">
                  <div className="w-12 h-12 bg-coral bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Flame className="h-6 w-6 text-coral" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{displayUser.streak || 0}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-md text-center">
                  <div className="w-12 h-12 bg-turquoise bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Trophy className="h-6 w-6 text-turquoise" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{mockUser.badges}</div>
                  <div className="text-sm text-gray-600">Badges</div>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-md text-center">
                  <div className="w-12 h-12 bg-sky bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Brain className="h-6 w-6 text-sky" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{mockUser.cardsLearned}</div>
                  <div className="text-sm text-gray-600">Cards Learned</div>
                </div>
              
                <div className="bg-white rounded-xl p-4 shadow-md text-center">
                  <div className="w-12 h-12 bg-mint bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="h-6 w-6 text-mint" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{mockUser.studyTime}</div>
                  <div className="text-sm text-gray-600">Study Time</div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* AI Study Buddy Feature Card */}
        <section className="mb-8">
          <div 
            className="bg-gradient-to-r from-purple-700 to-purple-600 rounded-xl p-6 shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            onClick={() => setLocation("/study-buddy")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-1">AI Study Buddy 🤖</h3>
                  <p className="text-white text-sm mb-2">
                    Get instant help with your homework and learning!
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-purple-100">
                    <div className="flex items-center">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Ask Questions
                    </div>
                    <div className="flex items-center">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Get Explanations
                    </div>
                    <div className="flex items-center">
                      <Brain className="h-3 w-3 mr-1" />
                      Practice Together
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-white">
                <ArrowRight className="h-6 w-6" />
              </div>
            </div>
          </div>
        </section>

        {/* Grade Level Selection */}
        <section className="mb-8">
          <GradeSelector
            selectedGrade={selectedGrade}
            onGradeSelect={setSelectedGrade}
          />
        </section>

        {/* Subject Categories */}
        <section className="mb-8">
          <SubjectGrid selectedGrade={selectedGrade} />
        </section>

        {/* Recent Awards */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Recent Awards 🏆</h3>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mockRecentAwards.map((award) => (
                <div key={award.id} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-golden to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <span className="text-2xl">{award.icon}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{award.name}</p>
                  <p className="text-xs text-gray-500">{award.unlockedAt}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      {/* Floating Action Buttons */}
      <div className="fixed right-4 bottom-20 space-y-3 z-30">
        <Button 
          size="lg"
          className="w-14 h-14 bg-purple-500 hover:bg-purple-600 rounded-full shadow-lg p-0"
          onClick={() => setLocation("/study-buddy")}
          title="AI Study Buddy"
        >
          <Brain className="h-6 w-6 text-white" />
        </Button>
        
        <Button 
          size="lg"
          className="w-14 h-14 bg-coral hover:bg-coral/90 rounded-full shadow-lg p-0"
          onClick={() => setShowQuizModal(true)}
        >
          <span className="text-xl">▶️</span>
        </Button>
        
        <Button 
          size="lg"
          className="w-14 h-14 bg-turquoise hover:bg-turquoise/90 rounded-full shadow-lg p-0"
          onClick={() => setShowQuizModal(true)}
        >
          <span className="text-xl">⏱️</span>
        </Button>
      </div>
      {/* Modals */}
      <AuthGate 
        isOpen={showAuthGate}
        onClose={() => setShowAuthGate(false)}
      />
      {!isGuest && (
        <AvatarCustomizer 
          isOpen={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
          currentAvatar={displayUser.avatar || "1"}
          onAvatarChange={(avatar) => {
            console.log("Avatar changed to:", avatar);
            setShowAvatarModal(false);
            setShowAchievement(true);
          }}
        />
      )}
      <QuizModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        grade={selectedGrade}
      />
      {!isGuest && (
        <AchievementPopup
          isOpen={showAchievement}
          onClose={() => setShowAchievement(false)}
          achievement={{
            name: "Avatar Updated!",
            description: "Your new look is awesome!",
            icon: "🎨"
          }}
        />
      )}
    </div>
  );
}

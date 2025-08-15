import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Star, Trophy, Zap, User, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { insertUserSchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface AuthGateProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthGate({ isOpen, onClose }: AuthGateProps) {
  const [view, setView] = useState<'welcome' | 'signup' | 'login'>('welcome');
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    grade: '2'
  });
  
  const { login, continueAsGuest } = useAuth();
  const { toast } = useToast();

  const createUserMutation = useMutation({
    mutationFn: async (userData: typeof formData) => {
      const response = await apiRequest('POST', '/api/users', userData);
      return await response.json();
    },
    onSuccess: (user) => {
      login(user);
      onClose();
      toast({
        title: "Welcome to FlashTastic!",
        description: "Your account has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = insertUserSchema.parse(formData);
      createUserMutation.mutate(validatedData);
    } catch (error) {
      toast({
        title: "Invalid Data",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    }
  };

  const handleGuestMode = () => {
    continueAsGuest();
    onClose();
    toast({
      title: "Welcome Guest!",
      description: "You can start learning right away. Sign up later to save your progress!",
    });
  };

  const memberFeatures = [
    { icon: Star, title: "Save Progress", description: "Keep track of all your learning" },
    { icon: Trophy, title: "Earn Achievements", description: "Unlock badges and rewards" },
    { icon: Zap, title: "Custom Avatar", description: "Personalize your learning experience" },
    { icon: Clock, title: "Study Streaks", description: "Build daily learning habits" }
  ];

  const guestLimitations = [
    "Progress is not saved",
    "No achievements or badges",
    "No custom avatars",
    "Basic flash cards only"
  ];

  if (view === 'signup') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <div className="text-center mb-4">
              {/* Main Branding Header */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg mb-4 border border-blue-100 dark:border-blue-800">
                <div className="flex items-center justify-center space-x-4 mb-3">
                  <img 
                    src="/attached_assets/FlashTastic Icon_1754739615841.jpg"
                    alt="FlashTastic Icon" 
                    className="w-16 h-16 object-contain rounded-lg shadow-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IiMwMEQ0RkYiLz4KPHR5ZXh0IHg9IjMyIiB5PSI0MiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZUPC90ZXh0Pgo8L3N2Zz4K';
                    }}
                  />
                  <div className="text-center">
                    <img 
                      src="/attached_assets/FlashTastic Logo-1_1754739615840.jpg"
                      alt="FlashTastic Logo" 
                      className="h-12 object-contain mx-auto mb-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjQ4IiB2aWV3Qm94PSIwIDAgMjAwIDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8dGV4dCB4PSIxMDAiIHk9IjM2IiBmb250LWZhbWlseT0iQXJpYWwgQmxhY2siIGZvbnQtc2l6ZT0iMzIiIGZvbnQtd2VpZ2h0PSI5MDAiIGZpbGw9IiMwMEQ0RkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZsYXNoVGFzdGljPC90ZXh0Pgo8L3N2Zz4K';
                      }}
                    />
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      K-8 Educational Flash Cards
                    </div>
                  </div>
                </div>
                
                {/* Additional Branding Elements */}
                <div className="flex items-center justify-center space-x-6 text-xs text-blue-500 dark:text-blue-400">
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3" />
                    <span>AI-Powered</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Gamified Learning</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-3 h-3" />
                    <span>Achievements</span>
                  </div>
                </div>
              </div>
              <DialogTitle className="text-center text-2xl font-bold text-gray-800">
                Join FlashTastic
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">Create your free account</DialogDescription>
            </div>
          </DialogHeader>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Choose a username"
                required
              />
            </div>

            <div>
              <Label htmlFor="grade">Grade Level</Label>
              <select
                id="grade"
                value={formData.grade}
                onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {['K', '1', '2', '3', '4', '5', '6', '7', '8'].map(grade => (
                  <option key={grade} value={grade}>
                    {grade === 'K' ? 'Kindergarten' : `Grade ${grade}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3 pt-4">
              <Button 
                type="submit" 
                className="w-full bg-coral hover:bg-coral/90 text-white font-semibold py-3"
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending ? 'Creating Account...' : 'Create Account'}
              </Button>
              
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setView('welcome')}
                className="w-full"
              >
                Back
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="text-center mb-6">
            {/* Enhanced Welcome Header */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-xl mb-6 border border-blue-100 dark:border-blue-800">
              <div className="flex items-center justify-center space-x-6 mb-4">
                <img 
                  src="/attached_assets/FlashTastic Icon_1754739615841.jpg"
                  alt="FlashTastic Icon" 
                  className="w-20 h-20 object-contain rounded-xl shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTYiIGZpbGw9IiMwMEQ0RkYiLz4KPHR5ZXh0IHg9IjQwIiB5PSI1NCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjMyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZUPC90ZXh0Pgo8L3N2Zz4K';
                  }}
                />
                <div className="text-center">
                  <img 
                    src="/attached_assets/FlashTastic Logo-1_1754739615840.jpg"
                    alt="FlashTastic Logo" 
                    className="h-16 object-contain mx-auto mb-3"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjY0IiB2aWV3Qm94PSIwIDAgMjQwIDY0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8dGV4dCB4PSIxMjAiIHk9IjQ4IiBmb250LWZhbWlseT0iQXJpYWwgQmxhY2siIGZvbnQtc2l6ZT0iNDAiIGZvbnQtd2VpZ2h0PSI5MDAiIGZpbGw9IiMwMEQ0RkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZsYXNoVGFzdGljPC90ZXh0Pgo8L3N2Zz4K';
                    }}
                  />
                  <div className="text-base text-blue-600 dark:text-blue-400 font-semibold">
                    K-8 Educational Flash Cards & Games
                  </div>
                </div>
              </div>
              
              {/* Feature Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-blue-600 dark:text-blue-400">
                <div className="flex flex-col items-center space-y-1 p-2 bg-white/50 dark:bg-blue-800/30 rounded-lg">
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">AI-Powered</span>
                </div>
                <div className="flex flex-col items-center space-y-1 p-2 bg-white/50 dark:bg-blue-800/30 rounded-lg">
                  <Star className="w-4 h-4" />
                  <span className="font-medium">Gamified</span>
                </div>
                <div className="flex flex-col items-center space-y-1 p-2 bg-white/50 dark:bg-blue-800/30 rounded-lg">
                  <Trophy className="w-4 h-4" />
                  <span className="font-medium">Achievements</span>
                </div>
                <div className="flex flex-col items-center space-y-1 p-2 bg-white/50 dark:bg-blue-800/30 rounded-lg">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Progress</span>
                </div>
              </div>
            </div>
            <DialogTitle className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to FlashTastic!
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-lg">
              The fun way to learn with interactive flash cards and games
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Member Benefits */}
          <Card className="border-2 border-coral">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-coral rounded-full flex items-center justify-center mx-auto mb-2">
                <User className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Join as Member</h3>
              <Badge className="bg-coral text-white">Recommended</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {memberFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <Icon className="h-5 w-5 text-coral mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-800">{feature.title}</p>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <Button 
                onClick={() => setView('signup')}
                className="w-full bg-coral hover:bg-coral/90 text-white font-semibold py-3"
              >
                Sign Up Free
              </Button>
            </CardContent>
          </Card>

          {/* Guest Mode */}
          <Card className="border-2 border-gray-200">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Try as Guest</h3>
              <Badge variant="outline">Limited Features</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-semibold text-gray-800 mb-2">Guest Mode includes:</p>
                <ul className="space-y-1">
                  <li className="text-sm text-gray-600">• Access to flash cards</li>
                  <li className="text-sm text-gray-600">• Basic quiz modes</li>
                  <li className="text-sm text-gray-600">• All subjects and grades</li>
                </ul>
                
                <p className="font-semibold text-gray-800 mb-2 mt-4">Limitations:</p>
                <ul className="space-y-1">
                  {guestLimitations.map((limitation, index) => (
                    <li key={index} className="text-sm text-gray-500">• {limitation}</li>
                  ))}
                </ul>
              </div>
              
              <Button 
                onClick={handleGuestMode}
                variant="outline"
                className="w-full border-gray-300 hover:border-gray-400 font-semibold py-3"
              >
                Continue as Guest
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-6 pt-4 border-t">
          <p className="text-sm text-gray-500">
            You can upgrade to a member account anytime to save your progress and unlock all features!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
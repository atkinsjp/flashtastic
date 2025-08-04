import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, Brain, TrendingUp, User, Users, Trophy } from "lucide-react";

const navItems = [
  {
    path: "/",
    icon: Home,
    label: "Home",
    color: "text-coral"
  },
  {
    path: "/study", 
    icon: BookOpen,
    label: "Study",
    color: "text-turquoise"
  },
  {
    path: "/quiz",
    icon: Brain,
    label: "Quizzes", 
    color: "text-sky"
  },
  {
    path: "/progress",
    icon: TrendingUp,
    label: "Progress",
    color: "text-mint"
  },
  {
    path: "/competitions",
    icon: Trophy,
    label: "Compete",
    color: "text-orange-500"
  },
  {
    path: "/parent-dashboard",
    icon: Users,
    label: "Parent",
    color: "text-purple-600"
  },
  {
    path: "/profile",
    icon: User,
    label: "Profile",
    color: "text-golden"
  }
];

export default function BottomNav() {
  const [location, setLocation] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.path);
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              className={`flex flex-col items-center py-2 px-4 min-w-0 h-auto ${
                active ? item.color : 'text-gray-700 hover:text-gray-900'
              }`}
              onClick={() => setLocation(item.path)}
            >
              <IconComponent className={`h-5 w-5 mb-1 ${active ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}

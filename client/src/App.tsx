import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Study from "@/pages/study";
import Quiz from "@/pages/quiz";
import Progress from "@/pages/progress";
import Profile from "@/pages/profile";
import BottomNav from "@/components/bottom-nav";
import { usePWA } from "@/hooks/use-pwa";

function Router() {
  return (
    <div className="min-h-screen pb-16">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/study" component={Study} />
        <Route path="/quiz" component={Quiz} />
        <Route path="/progress" component={Progress} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </div>
  );
}

function App() {
  usePWA();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

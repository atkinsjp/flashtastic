import { ReactNode, useState } from "react";
import { useSubscription } from "@/hooks/use-subscription";
import { PaywallModal } from "./paywall-modal";
import { Button } from "@/components/ui/button";
import { CrownIcon, LockIcon } from "lucide-react";

interface PremiumGateProps {
  feature: 'progress_tracking' | 'avatar_customization' | 'ai_study_buddy' | 'family_competitions' | 'achievements' | 'detailed_analytics' | 'spaced_repetition' | 'unlimited_questions';
  children: ReactNode;
  fallback?: ReactNode;
  inline?: boolean;
}

export function PremiumGate({ feature, children, fallback, inline = false }: PremiumGateProps) {
  const { canAccess } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);

  const featureNames = {
    progress_tracking: "Progress Tracking",
    avatar_customization: "3D Avatar Customization", 
    ai_study_buddy: "AI Study Buddy",
    family_competitions: "Family Competitions",
    achievements: "Achievement System",
    detailed_analytics: "Detailed Analytics",
    spaced_repetition: "Spaced Repetition",
    unlimited_questions: "Unlimited AI Questions"
  };

  if (canAccess(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (inline) {
    return (
      <>
        <Button
          variant="outline"
          onClick={() => setShowPaywall(true)}
          className="w-full border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 text-purple-700"
        >
          <CrownIcon className="h-4 w-4 mr-2" />
          Unlock {featureNames[feature]}
        </Button>
        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          feature={featureNames[feature]}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
        <LockIcon className="h-12 w-12 text-purple-400 mb-4" />
        <h3 className="text-lg font-bold text-purple-700 mb-2">
          Premium Feature
        </h3>
        <p className="text-center text-purple-600 mb-4 max-w-md">
          Unlock {featureNames[feature]} and all premium features with FlashTastic Premium
        </p>
        <Button
          onClick={() => setShowPaywall(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <CrownIcon className="h-4 w-4 mr-2" />
          Upgrade to Premium
        </Button>
      </div>
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature={featureNames[feature]}
      />
    </>
  );
}
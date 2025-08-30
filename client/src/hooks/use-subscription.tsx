import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

interface SubscriptionInfo {
  tier: 'free' | 'young_pro' | 'premium' | 'family';
  status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  endDate?: string;
}

interface SubscriptionContextType {
  subscription: SubscriptionInfo;
  isPremium: boolean;
  isLoading: boolean;
  canAccess: (feature: PremiumFeature, requiredTier?: string) => boolean;
}

type PremiumFeature = 
  | 'progress_tracking'
  | 'avatar_customization' 
  | 'ai_study_buddy'
  | 'family_competitions'
  | 'achievements'
  | 'detailed_analytics'
  | 'spaced_repetition'
  | 'unlimited_questions';

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['/api/subscription-status'],
    enabled: !!user,
    refetchOnWindowFocus: true,
  });

  const subscriptionInfo: SubscriptionInfo = subscription || {
    tier: 'free',
    status: 'inactive'
  };

  const isPremium = ['premium', 'family'].includes(subscriptionInfo.tier) && subscriptionInfo.status === 'active';

  const canAccess = (feature: PremiumFeature, requiredTier?: string): boolean => {
    // Free features (always accessible - with limits)
    if (subscriptionInfo.tier === 'free') {
      return false; // Free tier users must upgrade for all premium features
    }

    // Tier hierarchy: young_pro < premium < family
    const tierLevels = {
      young_pro: 1,
      premium: 2, 
      family: 3
    };

    const featureTiers = {
      progress_tracking: 'young_pro',
      avatar_customization: 'young_pro', 
      family_competitions: 'young_pro',
      achievements: 'young_pro',
      spaced_repetition: 'young_pro',
      ai_study_buddy: 'premium',
      unlimited_questions: 'premium',
      detailed_analytics: 'premium'
    };

    const neededTier = requiredTier || featureTiers[feature] || 'premium';
    const userTierLevel = tierLevels[subscriptionInfo.tier as keyof typeof tierLevels] || 0;
    const requiredTierLevel = tierLevels[neededTier as keyof typeof tierLevels] || 2;

    return subscriptionInfo.status === 'active' && userTierLevel >= requiredTierLevel;
  };

  const value: SubscriptionContextType = {
    subscription: subscriptionInfo,
    isPremium,
    isLoading,
    canAccess,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

// Hook for paywall functionality
export function usePaywall() {
  const { canAccess } = useSubscription();
  
  const requiresPremium = (feature: PremiumFeature, onBlock?: () => void) => {
    if (!canAccess(feature)) {
      onBlock?.();
      return false;
    }
    return true;
  };

  return {
    requiresPremium,
    canAccess
  };
}
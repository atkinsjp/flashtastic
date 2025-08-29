import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

interface SubscriptionInfo {
  tier: 'guest' | 'premium';
  status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  endDate?: string;
}

interface SubscriptionContextType {
  subscription: SubscriptionInfo;
  isPremium: boolean;
  isLoading: boolean;
  canAccess: (feature: PremiumFeature) => boolean;
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
    tier: 'guest',
    status: 'inactive'
  };

  const isPremium = subscriptionInfo.tier === 'premium' && subscriptionInfo.status === 'active';

  const canAccess = (feature: PremiumFeature): boolean => {
    // Guest mode features (always accessible)
    const guestFeatures: PremiumFeature[] = [];
    
    if (guestFeatures.includes(feature)) {
      return true;
    }

    // Premium features require active subscription
    return isPremium;
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
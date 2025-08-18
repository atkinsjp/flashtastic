import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { billingService, type PurchaseProduct } from '../services/billing';
import { SubscriptionModal } from '../components/subscription-modal';

interface SubscriptionContextType {
  isSubscribed: boolean;
  subscriptionTier: 'free' | 'premium' | 'plus';
  loading: boolean;
  showUpgradeModal: (reason?: 'ai_limit' | 'avatar_limit' | 'family_limit') => void;
  checkSubscriptionStatus: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'premium' | 'plus'>('free');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalReason, setModalReason] = useState<'ai_limit' | 'avatar_limit' | 'family_limit' | undefined>();

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      setLoading(true);
      
      // Check for active subscription
      const purchase = await billingService.getActivePurchase();
      
      if (purchase) {
        setIsSubscribed(true);
        
        // Determine subscription tier based on product ID
        if (purchase.productId.includes('plus')) {
          setSubscriptionTier('plus');
        } else if (purchase.productId.includes('premium')) {
          setSubscriptionTier('premium');
        } else {
          setSubscriptionTier('free');
        }
      } else {
        setIsSubscribed(false);
        setSubscriptionTier('free');
      }
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      setIsSubscribed(false);
      setSubscriptionTier('free');
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = async () => {
    await checkSubscriptionStatus();
  };

  const showUpgradeModal = (reason?: 'ai_limit' | 'avatar_limit' | 'family_limit') => {
    setModalReason(reason);
    setShowModal(true);
  };

  const contextValue: SubscriptionContextType = {
    isSubscribed,
    subscriptionTier,
    loading,
    showUpgradeModal,
    checkSubscriptionStatus,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
      <SubscriptionModal 
        open={showModal}
        onClose={() => setShowModal(false)}
        reason={modalReason}
      />
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

// Utility function to check if feature is available for current subscription
export function useFeatureAccess() {
  const { subscriptionTier } = useSubscription();
  
  return {
    // AI Study Buddy limits
    hasUnlimitedAI: subscriptionTier !== 'free',
    dailyAILimit: subscriptionTier === 'free' ? 5 : Infinity,
    
    // Avatar features
    hasAdvancedAvatars: subscriptionTier !== 'free',
    hasAllAccessories: subscriptionTier !== 'free',
    
    // Family features
    maxFamilyMembers: subscriptionTier === 'free' ? 2 : subscriptionTier === 'premium' ? 4 : 8,
    hasParentDashboard: subscriptionTier !== 'free',
    hasAdvancedAnalytics: subscriptionTier === 'plus',
    
    // Content features
    hasOfflineMode: subscriptionTier !== 'free',
    hasPriorityGeneration: subscriptionTier !== 'free',
    hasCustomLearningPaths: subscriptionTier === 'plus',
    
    // Support features
    hasPrioritySupport: subscriptionTier === 'plus',
    hasEarlyAccess: subscriptionTier === 'plus',
  };
}
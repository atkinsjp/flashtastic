import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { PaywallModal } from '@/components/paywall-modal';

export default function Subscribe() {
  const [, setLocation] = useLocation();
  const [showPaywall, setShowPaywall] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'young_pro' | 'premium' | 'family'>('premium');

  useEffect(() => {
    // Get plan from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan') as 'young_pro' | 'premium' | 'family';
    
    if (plan && ['young_pro', 'premium', 'family'].includes(plan)) {
      setSelectedPlan(plan);
    }
    
    // Show paywall modal immediately
    setShowPaywall(true);
  }, []);

  const handleClose = () => {
    setShowPaywall(false);
    setLocation('/');
  };

  const handleUpgradeSuccess = () => {
    setShowPaywall(false);
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Upgrade to FlashTastic {selectedPlan.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h1>
        <p className="text-gray-600 mb-6">
          You're just one step away from unlocking all the amazing features FlashTastic has to offer!
        </p>
        
        {!showPaywall && (
          <button 
            onClick={() => setShowPaywall(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Continue to Upgrade
          </button>
        )}
      </div>

      <PaywallModal
        isOpen={showPaywall}
        onClose={handleClose}
        feature={`${selectedPlan}_subscription`}
        onUpgradeSuccess={handleUpgradeSuccess}
      />
    </div>
  );
}
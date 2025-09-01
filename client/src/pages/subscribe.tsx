import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { PaywallModal } from '@/components/paywall-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    
    // Show paywall modal after a short delay to ensure page loads
    setTimeout(() => {
      setShowPaywall(true);
    }, 500);
  }, []);

  const handleClose = () => {
    setShowPaywall(false);
    setLocation('/');
  };

  const handleUpgradeSuccess = () => {
    setShowPaywall(false);
    setLocation('/');
  };

  const planNames = {
    'young_pro': 'Young Pro',
    'premium': 'Premium', 
    'family': 'Family'
  };

  const planPrices = {
    'young_pro': '$4.99',
    'premium': '$9.99',
    'family': '$13.99'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gray-900">
            Upgrade to FlashTastic {planNames[selectedPlan]}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl font-bold text-blue-600">
            {planPrices[selectedPlan]}<span className="text-sm text-gray-500">/month</span>
          </div>
          <p className="text-gray-600">
            You're just one step away from unlocking all the amazing features FlashTastic has to offer!
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => setShowPaywall(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
              disabled={showPaywall}
            >
              {showPaywall ? "Loading..." : "Continue to Upgrade"}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setLocation('/')}
              className="w-full"
            >
              Back to App
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPaywall && (
        <PaywallModal
          isOpen={showPaywall}
          onClose={handleClose}
          feature={`${selectedPlan}_subscription`}
          onUpgradeSuccess={handleUpgradeSuccess}
        />
      )}
    </div>
  );
}
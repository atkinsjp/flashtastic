import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, StarIcon, CrownIcon, XIcon } from "lucide-react";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  onUpgradeSuccess?: () => void;
}

const CheckoutForm = ({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/upgrade-success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message || "Something went wrong with your payment.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful!",
          description: "Welcome to FlashTastic Premium! All features are now unlocked.",
        });
        onSuccess();
      }
    } catch (err) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <div className="flex gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || !elements || isProcessing}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isProcessing ? "Processing..." : "Complete Upgrade"}
        </Button>
      </div>
    </form>
  );
};

export function PaywallModal({ isOpen, onClose, feature, onUpgradeSuccess }: PaywallModalProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'young_pro' | 'premium' | 'family'>('premium');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [clientSecret, setClientSecret] = useState<string>("");
  const { toast } = useToast();

  const handleUpgrade = async () => {
    try {
      const response = await apiRequest("POST", "/api/create-subscription", {
        plan: selectedPlan,
        billingCycle
      });
      const data = await response.json();
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowPayment(true);
      } else {
        throw new Error("No client secret received");
      }
    } catch (error) {
      toast({
        title: "Setup Error",
        description: "Unable to initialize payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpgradeSuccess = () => {
    setShowPayment(false);
    onClose();
    onUpgradeSuccess?.();
    // Reload the page to refresh auth state
    window.location.reload();
  };

  const planFeatures = {
    free: [
      "5 quizzes per day",
      "3 flashcard sets",
      "Basic progress tracking",
      "All subjects (K-8)"
    ],
    young_pro: [
      "Unlimited quizzes & practice",
      "Full progress tracking & streaks",
      "3D avatar customization",
      "Family competitions & challenges", 
      "Achievement system & badges",
      "Spaced repetition optimization",
      "Cross-device progress sync"
    ],
    premium: [
      "Everything in Young Pro",
      "AI study buddy chat support", 
      "Unlimited AI-generated questions",
      "Advanced performance analytics",
      "Priority support"
    ],
    family: [
      "Everything in Premium",
      "Up to 4 children accounts",
      "Family dashboard for parents",
      "Cross-child progress comparison",
      "Enhanced sibling competitions"
    ]
  };

  const planPricing = {
    young_pro: { monthly: 4.99, yearly: 49.99 },
    premium: { monthly: 9.99, yearly: 99.99 },
    family: { monthly: 13.99, yearly: 139.99 }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Unlock FlashTastic Premium
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            You tried to access: <span className="font-semibold text-blue-600">{feature}</span>
          </DialogDescription>
        </DialogHeader>

        {!showPayment ? (
          <div className="space-y-6">
            {/* Billing Toggle */}
            <div className="flex justify-center">
              <div className="bg-gray-100 p-1 rounded-lg flex">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    billingCycle === 'monthly' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    billingCycle === 'yearly' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Yearly
                  <Badge className="ml-2 bg-green-500 text-white text-xs">Save 17%</Badge>
                </button>
              </div>
            </div>

            {/* Pricing Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Young Pro Plan */}
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPlan === 'young_pro' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan('young_pro')}
              >
                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg">Young Pro</h3>
                  <div className="text-2xl font-bold text-blue-600">
                    ${billingCycle === 'monthly' ? '4.99' : '49.99'}
                  </div>
                  <div className="text-sm text-gray-600">
                    per {billingCycle === 'monthly' ? 'month' : 'year'}
                  </div>
                  {billingCycle === 'yearly' && (
                    <div className="text-xs text-green-600 font-medium">$4.17/month</div>
                  )}
                </div>
                <ul className="space-y-2">
                  {planFeatures.young_pro.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Premium Plan */}
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all relative ${
                  selectedPlan === 'premium' 
                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan('premium')}
              >
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <CrownIcon className="h-3 w-3 mr-1" />
                    POPULAR
                  </Badge>
                </div>
                <div className="text-center mb-4 mt-2">
                  <h3 className="font-bold text-lg">Premium</h3>
                  <div className="text-2xl font-bold text-purple-600">
                    ${billingCycle === 'monthly' ? '9.99' : '99.99'}
                  </div>
                  <div className="text-sm text-gray-600">
                    per {billingCycle === 'monthly' ? 'month' : 'year'}
                  </div>
                  {billingCycle === 'yearly' && (
                    <div className="text-xs text-green-600 font-medium">$8.33/month</div>
                  )}
                </div>
                <ul className="space-y-2">
                  {planFeatures.premium.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Family Plan */}
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPlan === 'family' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan('family')}
              >
                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg">Family</h3>
                  <div className="text-2xl font-bold text-orange-600">
                    ${billingCycle === 'monthly' ? '13.99' : '139.99'}
                  </div>
                  <div className="text-sm text-gray-600">
                    per {billingCycle === 'monthly' ? 'month' : 'year'}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">Up to 4 kids</div>
                  {billingCycle === 'yearly' && (
                    <div className="text-xs text-green-600 font-medium">$11.67/month</div>
                  )}
                </div>
                <ul className="space-y-2">
                  {planFeatures.family.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Free Plan Comparison */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-700 mb-2">Free Plan (Current)</h4>
              <ul className="grid grid-cols-2 gap-2">
                {planFeatures.free.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <CheckIcon className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Continue with Free
              </Button>
              <Button 
                onClick={handleUpgrade}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <CrownIcon className="h-4 w-4 mr-2" />
                Upgrade to {selectedPlan === 'young_pro' ? 'Young Pro' : selectedPlan === 'premium' ? 'Premium' : 'Family'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
              <CrownIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-bold text-lg">Complete Your Upgrade</h3>
              <p className="text-sm text-gray-600 mt-1">
                Secure payment powered by Stripe
              </p>
            </div>

            {clientSecret && (
              <Elements 
                stripe={stripePromise} 
                options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                  }
                }}
              >
                <CheckoutForm 
                  onSuccess={handleUpgradeSuccess}
                  onCancel={() => setShowPayment(false)}
                />
              </Elements>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
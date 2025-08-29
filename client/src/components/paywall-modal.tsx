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
          {isProcessing ? "Processing..." : "Upgrade Now - $9.99/month"}
        </Button>
      </div>
    </form>
  );
};

export function PaywallModal({ isOpen, onClose, feature, onUpgradeSuccess }: PaywallModalProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const { toast } = useToast();

  const handleUpgrade = async () => {
    try {
      const response = await apiRequest("POST", "/api/create-subscription");
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

  const premiumFeatures = [
    "Progress tracking & learning streaks",
    "3D avatar customization & growth",
    "AI study buddy chat support",
    "Family competitions & challenges",
    "Detailed performance analytics",
    "Achievement system & badges",
    "Unlimited AI-generated questions",
    "Spaced repetition optimization",
    "Cross-device progress sync"
  ];

  const guestFeatures = [
    "Basic flash cards",
    "Interactive quizzes",
    "All subjects (K-8)"
  ];

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
            {/* Premium vs Guest Comparison */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Guest Mode */}
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center mb-3">
                  <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                    Current: Guest Mode
                  </Badge>
                </div>
                <h3 className="font-bold text-lg mb-3">Free Features</h3>
                <ul className="space-y-2">
                  {guestFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">Free</div>
                  <div className="text-sm text-gray-500">Always free</div>
                </div>
              </div>

              {/* Premium Mode */}
              <div className="p-4 border-2 border-purple-200 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 relative">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <CrownIcon className="h-3 w-3 mr-1" />
                    RECOMMENDED
                  </Badge>
                </div>
                <div className="flex items-center mb-3 mt-2">
                  <StarIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  <h3 className="font-bold text-lg">Premium Features</h3>
                </div>
                <ul className="space-y-2 mb-4">
                  {premiumFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">$9.99</div>
                  <div className="text-sm text-gray-600">per month</div>
                </div>
              </div>
            </div>

            {/* Why Upgrade */}
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-bold text-blue-900 mb-2">Why upgrade to Premium?</h4>
              <p className="text-blue-800 text-sm">
                Premium unlocks the full FlashTastic experience with personalized learning paths, 
                family competitions, and AI-powered study assistance. Track progress, celebrate 
                achievements, and turn studying into a fun family activity!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Continue with Guest Mode
              </Button>
              <Button 
                onClick={handleUpgrade}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <CrownIcon className="h-4 w-4 mr-2" />
                Upgrade to Premium
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
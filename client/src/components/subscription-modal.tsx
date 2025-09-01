import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Zap, Crown, Sparkles } from 'lucide-react';
import { billingService, SUBSCRIPTION_PRODUCTS, PRODUCT_DETAILS, type PurchaseProduct } from '../services/billing';
import { useToast } from '@/hooks/use-toast';
import { Capacitor } from '@capacitor/core';

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  reason?: 'ai_limit' | 'avatar_limit' | 'family_limit' | 'general';
}

export function SubscriptionModal({ open, onClose, reason = 'general' }: SubscriptionModalProps) {
  const [products, setProducts] = useState<PurchaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'plus'>('premium');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadProducts();
    }
  }, [open]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const availableProducts = await billingService.getProducts();
      setProducts(availableProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast({
        title: 'Error Loading Subscription Options',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (productId: string) => {
    try {
      setPurchasing(productId);
      
      const result = await billingService.purchaseProduct(productId);
      
      if (result.success) {
        toast({
          title: 'Subscription Activated!',
          description: 'Welcome to FlashTastic Premium! Enjoy unlimited AI tutoring.',
        });
        onClose();
        // Refresh the page to update subscription status
        window.location.reload();
      } else {
        toast({
          title: 'Purchase Failed',
          description: result.error || 'Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Purchase Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setPurchasing(null);
    }
  };

  const getProductId = (plan: 'premium' | 'plus', period: 'monthly' | 'yearly'): string => {
    if (plan === 'premium') {
      return period === 'monthly' 
        ? SUBSCRIPTION_PRODUCTS.FAMILY_PREMIUM_MONTHLY
        : SUBSCRIPTION_PRODUCTS.FAMILY_PREMIUM_YEARLY;
    } else {
      return period === 'monthly'
        ? SUBSCRIPTION_PRODUCTS.FAMILY_PLUS_MONTHLY
        : SUBSCRIPTION_PRODUCTS.FAMILY_PLUS_YEARLY;
    }
  };

  const getProductPrice = (productId: string): string => {
    const product = products.find(p => p.id === productId);
    if (product) return product.price;
    
    // Fallback to display prices
    return PRODUCT_DETAILS[productId]?.displayPrice || '$9.99';
  };

  const getReasonTitle = () => {
    switch (reason) {
      case 'ai_limit': return 'Unlock Unlimited AI Tutoring';
      case 'avatar_limit': return 'Unlock Advanced Avatar Features';
      case 'family_limit': return 'Add More Family Members';
      default: return 'Upgrade to FlashTastic Premium';
    }
  };

  const getReasonDescription = () => {
    switch (reason) {
      case 'ai_limit': return "You've reached your daily limit of 5 AI questions. Upgrade for unlimited access to your personal AI tutor!";
      case 'avatar_limit': return "Unlock advanced avatar customization with premium accessories and growth features!";
      case 'family_limit': return "Add more family members and compete with up to 8 child profiles!";
      default: return "Get the most out of FlashTastic with unlimited AI tutoring and family features!";
    }
  };

  const isNative = Capacitor.isNativePlatform();
  const platformName = billingService.getPlatformDisplayName();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {getReasonTitle()}
          </DialogTitle>
          <p className="text-muted-foreground text-center">
            {getReasonDescription()}
          </p>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Billing Period Toggle */}
            <div className="flex justify-center">
              <div className="bg-muted p-1 rounded-lg flex">
                <Button
                  variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setBillingPeriod('monthly')}
                  data-testid="billing-monthly-toggle"
                >
                  Monthly
                </Button>
                <Button
                  variant={billingPeriod === 'yearly' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setBillingPeriod('yearly')}
                  className="relative"
                  data-testid="billing-yearly-toggle"
                >
                  Yearly
                  <Badge className="absolute -top-2 -right-2 text-xs bg-green-500">
                    Save 17%
                  </Badge>
                </Button>
              </div>
            </div>

            {/* Subscription Plans */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Family Premium */}
              <Card className={`relative transition-all duration-200 ${
                selectedPlan === 'premium' ? 'ring-2 ring-primary shadow-lg' : ''
              }`}>
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <CardTitle className="text-xl">Family Premium</CardTitle>
                  </div>
                  <div className="text-3xl font-bold">
                    {billingPeriod === 'monthly' ? '$9.99' : '$99.99'}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{billingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <Badge variant="secondary" className="w-fit mx-auto">
                      Save $15.99/year
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {PRODUCT_DETAILS[getProductId('premium', billingPeriod)]?.features?.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      setSelectedPlan('premium');
                      handlePurchase(getProductId('premium', billingPeriod));
                    }}
                    disabled={purchasing !== null}
                    data-testid="purchase-premium-button"
                  >
                    {purchasing === getProductId('premium', billingPeriod) ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Processing...
                      </div>
                    ) : (
                      `Subscribe with ${platformName}`
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Family Plus */}
              <Card className={`relative transition-all duration-200 ${
                selectedPlan === 'plus' ? 'ring-2 ring-primary shadow-lg' : ''
              }`}>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
                <CardHeader className="text-center pb-4 pt-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <CardTitle className="text-xl">Family Plus</CardTitle>
                  </div>
                  <div className="text-3xl font-bold">
                    {billingPeriod === 'monthly' ? '$13.99' : '$139.99'}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{billingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <Badge variant="secondary" className="w-fit mx-auto">
                      Save $25.89/year
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {PRODUCT_DETAILS[getProductId('plus', billingPeriod)]?.features?.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    size="lg"
                    onClick={() => {
                      setSelectedPlan('plus');
                      handlePurchase(getProductId('plus', billingPeriod));
                    }}
                    disabled={purchasing !== null}
                    data-testid="purchase-plus-button"
                  >
                    {purchasing === getProductId('plus', billingPeriod) ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Processing...
                      </div>
                    ) : (
                      `Subscribe with ${platformName}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Free Trial Info */}
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <span className="font-semibold text-blue-700 dark:text-blue-300">
                  7-Day Free Trial
                </span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Try FlashTastic Premium risk-free! Cancel anytime during your trial period with no charges.
              </p>
            </div>

            {/* Platform-specific notes */}
            {!isNative && (
              <div className="text-xs text-muted-foreground text-center">
                Web subscriptions are processed securely through Stripe
              </div>
            )}

            {/* Restore Purchases (Native only) */}
            {isNative && (
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => billingService.restorePurchases()}
                  data-testid="restore-purchases-button"
                >
                  Restore Purchases
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
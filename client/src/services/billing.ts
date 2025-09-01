import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

export interface PurchaseProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  priceValue: number;
  currency: string;
  type: 'subscription';
}

export interface PurchaseResult {
  success: boolean;
  productId?: string;
  transactionId?: string;
  error?: string;
}

export const SUBSCRIPTION_PRODUCTS = {
  FAMILY_PREMIUM_MONTHLY: 'flashtastic_family_premium_monthly',
  FAMILY_PLUS_MONTHLY: 'flashtastic_family_plus_monthly',
  FAMILY_PREMIUM_YEARLY: 'flashtastic_family_premium_yearly',
  FAMILY_PLUS_YEARLY: 'flashtastic_family_plus_yearly',
} as const;

interface ProductDetail {
  title: string;
  description: string;
  displayPrice: string;
  features?: string[];
  savings?: string;
}

export const PRODUCT_DETAILS: Record<string, ProductDetail> = {
  [SUBSCRIPTION_PRODUCTS.FAMILY_PREMIUM_MONTHLY]: {
    title: 'FlashTastic Family Premium',
    description: 'Unlimited AI Study Buddy, advanced avatars, up to 4 child profiles',
    displayPrice: '$9.99/month',
    features: [
      'Unlimited AI Study Buddy',
      'Advanced avatar customization',
      'Up to 4 child profiles',
      'Parent dashboard',
      'Offline mode',
      'Priority AI content generation'
    ]
  },
  [SUBSCRIPTION_PRODUCTS.FAMILY_PLUS_MONTHLY]: {
    title: 'FlashTastic Family Plus',
    description: 'Everything in Premium plus AI homework help and advanced analytics',
    displayPrice: '$13.99/month',
    features: [
      'Everything in Family Premium',
      'AI homework help',
      'Custom learning plans',
      'Advanced analytics export',
      'Up to 8 child profiles',
      'Priority customer support',
      'Early access to new features'
    ]
  },
  [SUBSCRIPTION_PRODUCTS.FAMILY_PREMIUM_YEARLY]: {
    title: 'FlashTastic Family Premium (Yearly)',
    description: 'Save 17% with annual billing',
    displayPrice: '$99.99/year',
    savings: '17% off monthly price',
    features: [
      'Unlimited AI Study Buddy',
      'Advanced avatar customization',
      'Up to 4 child profiles',
      'Parent dashboard',
      'Offline mode',
      'Priority AI content generation'
    ]
  },
  [SUBSCRIPTION_PRODUCTS.FAMILY_PLUS_YEARLY]: {
    title: 'FlashTastic Family Plus (Yearly)',
    description: 'Save 17% with annual billing',
    displayPrice: '$139.99/year',
    savings: '17% off monthly price',
    features: [
      'Everything in Family Premium',
      'AI homework help',
      'Custom learning plans',
      'Advanced analytics export',
      'Up to 8 child profiles',
      'Priority customer support',
      'Early access to new features'
    ]
  }
};

class BillingService {
  private products: PurchaseProduct[] = [];
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    try {
      // Only initialize on mobile platforms
      if (!Capacitor.isNativePlatform()) {
        console.log('Billing: Not on native platform, skipping initialization');
        return false;
      }

      // For now, we'll use mock products for native platforms
      // In a real implementation, you'd use Google Play Billing Library or App Store Connect
      this.products = Object.values(SUBSCRIPTION_PRODUCTS).map(productId => ({
        id: productId,
        title: PRODUCT_DETAILS[productId]?.title || 'FlashTastic Premium',
        description: PRODUCT_DETAILS[productId]?.description || 'Premium subscription',
        price: PRODUCT_DETAILS[productId]?.displayPrice || '$9.99',
        priceValue: productId.includes('9.99') ? 9.99 : productId.includes('13.99') ? 13.99 : productId.includes('99.99') ? 99.99 : 139.99,
        currency: 'USD',
        type: 'subscription' as const
      }));
      
      this.isInitialized = true;
      
      console.log('Billing: Initialized successfully with products:', this.products);
      return true;
    } catch (error) {
      console.error('Billing: Failed to initialize:', error);
      return false;
    }
  }

  async getProducts(): Promise<PurchaseProduct[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.products;
  }

  async getProduct(productId: string): Promise<PurchaseProduct | null> {
    const products = await this.getProducts();
    return products.find(p => p.id === productId) || null;
  }

  async purchaseProduct(productId: string): Promise<PurchaseResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (!Capacitor.isNativePlatform()) {
        // For web/PWA, redirect to web payment flow
        return this.handleWebPurchase(productId);
      }

      // For demo purposes, simulate native app purchase flow
      // In real implementation, this would call Google Play Billing or App Store APIs
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store purchase locally for verification
      await this.storePurchase(productId, transactionId);
      
      return {
        success: true,
        productId,
        transactionId
      };
    } catch (error) {
      console.error('Billing: Purchase failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async handleWebPurchase(productId: string): Promise<PurchaseResult> {
    // For PWA/web users, we'll use Stripe instead
    // This redirects to the web subscription flow
    try {
      const subscriptionType = this.getSubscriptionTypeFromProductId(productId);
      window.location.href = `/subscribe?plan=${subscriptionType}`;
      
      return {
        success: true,
        productId
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to redirect to web payment'
      };
    }
  }

  private getSubscriptionTypeFromProductId(productId: string): string {
    switch (productId) {
      case SUBSCRIPTION_PRODUCTS.FAMILY_PREMIUM_MONTHLY:
      case SUBSCRIPTION_PRODUCTS.FAMILY_PREMIUM_YEARLY:
        return 'premium';
      case SUBSCRIPTION_PRODUCTS.FAMILY_PLUS_MONTHLY:
      case SUBSCRIPTION_PRODUCTS.FAMILY_PLUS_YEARLY:
        return 'plus';
      default:
        return 'premium';
    }
  }

  private async storePurchase(productId: string, transactionId: string): Promise<void> {
    try {
      await Preferences.set({
        key: 'active_subscription',
        value: JSON.stringify({
          productId,
          transactionId,
          purchaseTime: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to store purchase:', error);
    }
  }

  async getActivePurchase(): Promise<{ productId: string; transactionId: string } | null> {
    try {
      const result = await Preferences.get({ key: 'active_subscription' });
      if (result.value) {
        return JSON.parse(result.value);
      }
    } catch (error) {
      console.error('Failed to get active purchase:', error);
    }
    return null;
  }

  async restorePurchases(): Promise<boolean> {
    try {
      if (!Capacitor.isNativePlatform()) {
        return false;
      }

      // In real implementation, this would call native restore APIs
      console.log('Restoring purchases...');
      return true;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      return false;
    }
  }

  isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }

  getPlatformDisplayName(): string {
    if (Capacitor.getPlatform() === 'android') return 'Google Play';
    if (Capacitor.getPlatform() === 'ios') return 'App Store';
    return 'Web';
  }
}

export const billingService = new BillingService();
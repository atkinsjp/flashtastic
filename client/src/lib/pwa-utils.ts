export async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('SW registered: ', registration);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available
              console.log('New content available, please refresh');
            }
          });
        }
      });
      
    } catch (error) {
      console.log('SW registration failed: ', error);
    }
  }
}

export function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone ||
         document.referrer.includes('android-app://');
}

export function getInstallPrompt() {
  return (window as any).deferredPrompt;
}

export async function showInstallPrompt() {
  const deferredPrompt = getInstallPrompt();
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    (window as any).deferredPrompt = null;
  }
}

// Cache management utilities
export class CacheManager {
  static async cacheFlashCards(grade: string, subject: string, cards: any[]) {
    if ('caches' in window) {
      try {
        const cache = await caches.open(`flashcards-${grade}-${subject}`);
        await cache.put(
          `/api/flashcards?grade=${grade}&subject=${subject}`,
          new Response(JSON.stringify(cards))
        );
      } catch (error) {
        console.error('Failed to cache flash cards:', error);
      }
    }
  }

  static async getCachedFlashCards(grade: string, subject: string) {
    if ('caches' in window) {
      try {
        const cache = await caches.open(`flashcards-${grade}-${subject}`);
        const response = await cache.match(`/api/flashcards?grade=${grade}&subject=${subject}`);
        if (response) {
          return await response.json();
        }
      } catch (error) {
        console.error('Failed to get cached flash cards:', error);
      }
    }
    return null;
  }

  static async clearCache() {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
  }
}

// Offline detection
export function isOnline(): boolean {
  return navigator.onLine;
}

// Local storage utilities for offline data
export class OfflineStorage {
  static setItem(key: string, value: any) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  static getItem(key: string) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to get from localStorage:', error);
      return null;
    }
  }

  static removeItem(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  // Save user progress offline
  static saveUserProgress(userId: string, progress: any) {
    this.setItem(`user-progress-${userId}`, progress);
  }

  static getUserProgress(userId: string) {
    return this.getItem(`user-progress-${userId}`);
  }

  // Save study session offline
  static saveStudySession(session: any) {
    const sessions = this.getItem('offline-sessions') || [];
    sessions.push({ ...session, timestamp: Date.now() });
    this.setItem('offline-sessions', sessions);
  }

  static getOfflineSessions() {
    return this.getItem('offline-sessions') || [];
  }

  static clearOfflineSessions() {
    this.removeItem('offline-sessions');
  }
}

import { useEffect } from "react";
import { registerSW } from "@/lib/pwa-utils";

export function usePWA() {
  useEffect(() => {
    // Register service worker
    registerSW();

    // Handle PWA install prompt
    let deferredPrompt: any;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Show custom install button or notification
      console.log("PWA install prompt available");
    };

    const handleAppInstalled = () => {
      console.log("PWA was installed");
      deferredPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Handle online/offline status
    const handleOnline = () => {
      console.log("App is online");
    };

    const handleOffline = () => {
      console.log("App is offline");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
}

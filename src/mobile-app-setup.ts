// Mobile App Initialization for FlashKademy
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';

export class MobileAppSetup {
  static async initialize() {
    // Configure status bar
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#ffffff' });

    // Configure splash screen
    await SplashScreen.hide();

    // Configure keyboard
    Keyboard.addListener('keyboardWillShow', info => {
      document.body.style.marginBottom = `${info.keyboardHeight}px`;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      document.body.style.marginBottom = '0px';
    });

    // Handle app state changes
    App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active?', isActive);
      // Save app state for offline functionality
    });

    // Handle back button (Android)
    App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        App.exitApp();
      } else {
        window.history.back();
      }
    });
  }

  static async getAppInfo() {
    const info = await App.getInfo();
    return {
      name: info.name,
      id: info.id,
      version: info.version,
      build: info.build
    };
  }
}
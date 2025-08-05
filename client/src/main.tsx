import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize mobile app features when running in Capacitor
const initializeMobileApp = async () => {
  // @ts-ignore - Capacitor will be available in mobile builds
  if (window.Capacitor) {
    const { MobileAppSetup } = await import("../../src/mobile-app-setup");
    await MobileAppSetup.initialize();
  }
};

// Initialize mobile features
initializeMobileApp();

createRoot(document.getElementById("root")!).render(<App />);

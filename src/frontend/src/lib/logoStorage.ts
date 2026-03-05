// Logo storage utility for managing custom header logo in localStorage

const LOGO_KEY = "custom-header-logo";

// Type for logo update listeners
type LogoUpdateListener = (logoUrl: string | null) => void;
const logoUpdateListeners: Set<LogoUpdateListener> = new Set();

// Subscribe to logo updates
export function subscribeToLogoUpdates(
  listener: LogoUpdateListener,
): () => void {
  logoUpdateListeners.add(listener);
  return () => {
    logoUpdateListeners.delete(listener);
  };
}

// Notify all listeners of logo updates
function notifyLogoUpdate(logoUrl: string | null) {
  for (const listener of logoUpdateListeners) {
    try {
      listener(logoUrl);
    } catch (error) {
      console.error("Error in logo update listener:", error);
    }
  }
}

// Get custom logo from localStorage
export function getCustomLogo(): string | null {
  try {
    const stored = localStorage.getItem(LOGO_KEY);
    return stored;
  } catch (error) {
    console.error("Failed to get custom logo:", error);
    return null;
  }
}

// Save custom logo to localStorage
export function saveCustomLogo(dataUrl: string) {
  try {
    localStorage.setItem(LOGO_KEY, dataUrl);
    // Dispatch storage event for cross-tab synchronization
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: LOGO_KEY,
        newValue: dataUrl,
        storageArea: localStorage,
      }),
    );
    // Notify all subscribed listeners
    notifyLogoUpdate(dataUrl);
  } catch (error) {
    console.error("Failed to save custom logo:", error);
    throw error;
  }
}

// Clear custom logo (reset to default)
export function clearCustomLogo() {
  try {
    localStorage.removeItem(LOGO_KEY);
    // Dispatch storage event for cross-tab synchronization
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: LOGO_KEY,
        newValue: null,
        storageArea: localStorage,
      }),
    );
    // Notify all subscribed listeners
    notifyLogoUpdate(null);
  } catch (error) {
    console.error("Failed to clear custom logo:", error);
  }
}

// Listen for storage events from other tabs
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === LOGO_KEY) {
      notifyLogoUpdate(event.newValue);
    }
  });
}

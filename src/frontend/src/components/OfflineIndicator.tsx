import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOffline && isOnline) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-50 animate-in slide-in-from-top">
      <Alert
        variant={isOnline ? 'default' : 'destructive'}
        className={`rounded-none border-x-0 border-t-0 ${
          isOnline
            ? 'border-green-200 bg-green-50 text-green-900'
            : 'border-orange-200 bg-orange-50 text-orange-900'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4" />
              <AlertDescription className="font-medium">
                Back online! Your changes will sync automatically.
              </AlertDescription>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              <AlertDescription className="font-medium">
                You're offline. Some features may be limited.
              </AlertDescription>
            </>
          )}
        </div>
      </Alert>
    </div>
  );
}

import { Loader2, ShieldCheck, Smartphone } from "lucide-react";
import { useEffect, useRef } from "react";

interface UPIProcessingScreenProps {
  onSuccess: () => void;
}

export default function UPIProcessingScreen({
  onSuccess,
}: UPIProcessingScreenProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Always fires after exactly 2 seconds, regardless of network state
    timerRef.current = setTimeout(() => {
      onSuccess();
    }, 2000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [onSuccess]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50 p-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* UPI Logo / Icon */}
        <div className="flex justify-center">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-blue-100 shadow-lg">
            <Smartphone className="h-14 w-14 text-blue-600" strokeWidth={1.5} />
            {/* Pulsing ring animation */}
            <span className="absolute inset-0 rounded-full border-4 border-blue-300 animate-ping opacity-40" />
          </div>
        </div>

        {/* Spinner + Text */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              Processing Payment...
            </h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Please wait while we confirm your UPI payment.
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full bg-orange-500 animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="h-2.5 w-2.5 rounded-full bg-orange-400 animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="h-2.5 w-2.5 rounded-full bg-orange-300 animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700 font-medium">
            Secure UPI Transaction
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          Do not close this screen. You will be redirected automatically.
        </p>
      </div>
    </div>
  );
}

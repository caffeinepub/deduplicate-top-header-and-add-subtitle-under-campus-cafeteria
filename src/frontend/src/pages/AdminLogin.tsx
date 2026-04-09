import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface AdminLoginProps {
  onLogin: () => void;
  onBack?: () => void;
}

export default function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (email === "admin@jspm.edu" && password === "password123") {
        localStorage.setItem("cafeteria-demo-admin", "true");
        onLogin();
      } else {
        setError("Invalid credentials. Please try again.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #fef3c7 0%, #fff7ed 40%, #fef9ee 70%, #fde68a 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full max-w-md">
        {/* Back button */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        )}

        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500"
            style={{
              boxShadow:
                "0 0 40px rgba(251,146,60,0.4), 0 8px 24px rgba(251,146,60,0.2)",
            }}
          >
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Campus Cafeteria
          </h1>
          <p className="mt-1 text-sm font-medium tracking-widest text-orange-600 uppercase">
            Admin Panel
          </p>
        </div>

        <Card className="glass-strong border-white/40 shadow-2xl rounded-2xl">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold text-gray-800">
              Sign in to continue
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@jspm.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-ocid="admin.login.input"
                  className="border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-ocid="admin.login.password.input"
                  className="border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>

              {error && (
                <div
                  className="rounded-xl bg-red-50/80 px-4 py-3 text-sm text-red-600 border border-red-100"
                  data-ocid="admin.login.error_state"
                >
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                data-ocid="admin.login.submit_button"
                className="w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Demo:{" "}
                <span className="font-mono font-medium text-gray-700">
                  admin@jspm.edu
                </span>{" "}
                /{" "}
                <span className="font-mono font-medium text-gray-700">
                  password123
                </span>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

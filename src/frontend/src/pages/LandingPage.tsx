import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, UtensilsCrossed } from "lucide-react";

interface LandingPageProps {
  onStudent: () => void;
  onAdmin: () => void;
}

export default function LandingPage({ onStudent, onAdmin }: LandingPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6">
      {/* Brand */}
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-xl">
          <UtensilsCrossed className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Campus Cafeteria
        </h1>
        <p className="mt-2 text-base font-medium text-gray-400 tracking-widest uppercase">
          JSPM Canteen
        </p>
      </div>

      {/* Role selection cards */}
      <div className="w-full max-w-sm space-y-4">
        <Card
          className="cursor-pointer border-2 border-transparent bg-white shadow-lg transition-all duration-200 hover:border-orange-400 hover:shadow-xl"
          onClick={onStudent}
        >
          <CardContent className="flex items-center gap-5 px-6 py-5">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-md">
              <UtensilsCrossed className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-gray-900">
                Continue as Student
              </p>
              <p className="text-sm text-gray-400">
                Browse menu, order food &amp; track status
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer border-2 border-transparent bg-white shadow-lg transition-all duration-200 hover:border-orange-400 hover:shadow-xl"
          onClick={onAdmin}
        >
          <CardContent className="flex items-center gap-5 px-6 py-5">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 shadow-md">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-gray-900">Login as Admin</p>
              <p className="text-sm text-gray-400">
                Manage orders, menu &amp; cafeteria ops
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="mt-10 text-xs text-gray-300">
        Offline demo mode &bull; No internet required
      </p>
    </div>
  );
}

import { ShieldCheck, UtensilsCrossed } from "lucide-react";

interface LandingPageProps {
  onStudent: () => void;
  onAdmin: () => void;
}

export default function LandingPage({ onStudent, onAdmin }: LandingPageProps) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center p-6"
      style={{
        background:
          "linear-gradient(135deg, #fef3c7 0%, #fff7ed 40%, #fef9ee 70%, #fde68a 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Brand */}
      <div className="mb-10 flex flex-col items-center text-center">
        <div
          className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500"
          style={{
            boxShadow:
              "0 0 40px rgba(251,146,60,0.45), 0 8px 32px rgba(251,146,60,0.25)",
          }}
        >
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
        <button
          type="button"
          className="w-full glass rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border border-white/40 text-left"
          onClick={onStudent}
          data-ocid="landing.student.button"
        >
          <div className="flex items-center gap-5 px-6 py-5">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-md">
              <UtensilsCrossed className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-gray-900">
                Continue as Student
              </p>
              <p className="text-sm text-gray-500">
                Browse menu, order food &amp; track status
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          className="w-full glass rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border border-white/40 text-left"
          onClick={onAdmin}
          data-ocid="landing.admin.button"
        >
          <div className="flex items-center gap-5 px-6 py-5">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 shadow-md">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-gray-900">Login as Admin</p>
              <p className="text-sm text-gray-500">
                Manage orders, menu &amp; cafeteria ops
              </p>
            </div>
          </div>
        </button>
      </div>

      <p className="mt-10 text-xs text-gray-400">
        Offline demo mode &bull; No internet required
      </p>
    </div>
  );
}

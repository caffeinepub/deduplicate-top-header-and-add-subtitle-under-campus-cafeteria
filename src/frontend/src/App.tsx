import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import InstallPrompt from "./components/InstallPrompt";
import OfflineIndicator from "./components/OfflineIndicator";
import AdminLayout from "./pages/AdminLayout";
import AdminLogin from "./pages/AdminLogin";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";

type AppView = "landing" | "student" | "admin-login" | "admin";

function getInitialView(): AppView {
  if (localStorage.getItem("cafeteria-demo-admin") === "true") return "admin";
  if (localStorage.getItem("cafeteria-student-active") === "true")
    return "student";
  return "landing";
}

export default function App() {
  const [view, setView] = useState<AppView>(getInitialView);

  const goToStudent = () => {
    localStorage.setItem("cafeteria-student-active", "true");
    setView("student");
  };

  const goToAdminLogin = () => {
    setView("admin-login");
  };

  const handleAdminLogin = () => {
    localStorage.setItem("cafeteria-demo-admin", "true");
    setView("admin");
  };

  const handleAdminLogout = () => {
    localStorage.setItem("cafeteria-demo-admin", "false");
    localStorage.removeItem("cafeteria-student-active");
    setView("landing");
  };

  const handleStudentLogout = () => {
    localStorage.removeItem("cafeteria-student-active");
    setView("landing");
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <OfflineIndicator />

      {view === "landing" && (
        <LandingPage onStudent={goToStudent} onAdmin={goToAdminLogin} />
      )}

      {view === "admin-login" && (
        <AdminLogin
          onLogin={handleAdminLogin}
          onBack={() => setView("landing")}
        />
      )}

      {view === "admin" && <AdminLayout onLogout={handleAdminLogout} />}

      {view === "student" && (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-orange-50 via-white to-amber-50">
          <main className="flex-1">
            <HomePage onLogout={handleStudentLogout} />
          </main>
        </div>
      )}

      <InstallPrompt />
      <Toaster />
    </ThemeProvider>
  );
}

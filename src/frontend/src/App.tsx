import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import InstallPrompt from './components/InstallPrompt';
import OfflineIndicator from './components/OfflineIndicator';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

export default function App() {
  // Use synchronous localStorage check for immediate rendering
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('cafeteria-demo-admin') === 'true';
  });

  // Listen for storage changes (in case admin mode is toggled in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdmin(localStorage.getItem('cafeteria-demo-admin') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleAdminMode = () => {
    const newMode = !isAdmin;
    localStorage.setItem('cafeteria-demo-admin', newMode.toString());
    setIsAdmin(newMode);
    // Force re-render of child components
    window.location.reload();
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <OfflineIndicator />
        {isAdmin && <Header />}
        <main className="flex-1">
          {isAdmin ? <AdminDashboard /> : <HomePage />}
        </main>
        <Footer />
        
        <Button
          onClick={toggleAdminMode}
          className="fixed bottom-20 right-4 rounded-full shadow-lg"
          size="icon"
          title={isAdmin ? "Switch to User Mode" : "Switch to Admin Mode"}
        >
          <Shield className="h-5 w-5" />
        </Button>
        
        <InstallPrompt />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

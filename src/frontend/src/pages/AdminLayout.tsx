import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";
import AdminDashboardPage from "./AdminDashboardPage";
import AdminMenuPage from "./AdminMenuPage";
import AdminOrdersPage from "./AdminOrdersPage";

type AdminPage = "dashboard" | "orders" | "menu";

interface AdminLayoutProps {
  onLogout: () => void;
}

const NAV_ITEMS = [
  {
    id: "dashboard" as AdminPage,
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "admin.sidebar.dashboard.link",
  },
  {
    id: "orders" as AdminPage,
    label: "Orders",
    icon: ClipboardList,
    ocid: "admin.sidebar.orders.link",
  },
  {
    id: "menu" as AdminPage,
    label: "Menu",
    icon: UtensilsCrossed,
    ocid: "admin.sidebar.menu.link",
  },
];

function SidebarContent({
  activePage,
  setActivePage,
  onLogout,
  onNavClick,
}: {
  activePage: AdminPage;
  setActivePage: (p: AdminPage) => void;
  onLogout: () => void;
  onNavClick?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Sidebar header */}
      <div className="border-b border-orange-100 px-6 py-6">
        <h2 className="font-display text-xl font-bold text-gray-900">
          Campus Cafeteria
        </h2>
        <p className="mt-0.5 text-xs font-medium uppercase tracking-widest text-orange-500">
          Admin Panel
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              data-ocid={item.ocid}
              onClick={() => {
                setActivePage(item.id);
                onNavClick?.();
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-700"
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-orange-100 px-3 py-4">
        <button
          type="button"
          data-ocid="admin.sidebar.logout.button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-all hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ onLogout }: AdminLayoutProps) {
  const [activePage, setActivePage] = useState<AdminPage>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.setItem("cafeteria-demo-admin", "false");
    onLogout();
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <AdminDashboardPage />;
      case "orders":
        return <AdminOrdersPage />;
      case "menu":
        return <AdminMenuPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-orange-100 bg-white shadow-sm lg:flex">
        <SidebarContent
          activePage={activePage}
          setActivePage={setActivePage}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent
            activePage={activePage}
            setActivePage={setActivePage}
            onLogout={handleLogout}
            onNavClick={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-orange-100 bg-white px-4 py-3 shadow-sm lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>
          <div className="text-center">
            <span className="text-sm font-bold text-gray-900">
              Campus Cafeteria
            </span>
            <span className="block text-xs uppercase tracking-wider text-orange-500">
              Admin Panel
            </span>
          </div>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-8">{renderPage()}</main>
      </div>
    </div>
  );
}

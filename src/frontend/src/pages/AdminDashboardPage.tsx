import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  ChefHat,
  Clock,
  IndianRupee,
  Package,
} from "lucide-react";
import { useGetAllOrders } from "../hooks/useQueries";

export default function AdminDashboardPage() {
  const { data: orders = [] } = useGetAllOrders();

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const preparingOrders = orders.filter((o) => o.status === "Preparing").length;
  const readyOrders = orders.filter((o) => o.status === "Ready").length;
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalPrice), 0);

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: Package,
      color: "text-gray-700",
      bg: "bg-gray-100/70",
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      color: "text-yellow-700",
      bg: "bg-yellow-50/80",
    },
    {
      label: "Preparing",
      value: preparingOrders,
      icon: ChefHat,
      color: "text-blue-700",
      bg: "bg-blue-50/80",
    },
    {
      label: "Ready",
      value: readyOrders,
      icon: CheckCircle2,
      color: "text-green-700",
      bg: "bg-green-50/80",
    },
    {
      label: "Total Revenue",
      value: `₹${totalRevenue}`,
      icon: IndianRupee,
      color: "text-orange-700",
      bg: "bg-orange-50/80",
    },
  ];

  return (
    <div data-ocid="admin.dashboard.section" className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your cafeteria operations
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="glass border-white/40 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 rounded-2xl"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-gray-500">
                  {stat.label}
                </CardTitle>
                <div className={`rounded-xl p-2 ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent orders summary */}
      <Card className="glass border-white/40 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-xl glass border border-white/30 px-4 py-3 text-sm"
                >
                  <div>
                    <span className="font-medium text-gray-800">
                      #{order.id.slice(0, 8)}
                    </span>
                    <span className="ml-2 text-gray-500">{order.userName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-orange-600 font-medium">
                      ₹{Number(order.totalPrice)}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "Preparing"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "Ready"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

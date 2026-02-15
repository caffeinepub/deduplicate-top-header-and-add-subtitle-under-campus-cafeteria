import { useState } from 'react';
import { useGetAllOrders, useGetAllFoodItems } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, UtensilsCrossed, Clock, ChefHat, CheckCircle2, CircleCheck } from 'lucide-react';
import MenuManagement from '../components/MenuManagement';
import OrderManagement from '../components/OrderManagement';
import AllOrdersManagement from '../components/AllOrdersManagement';

export default function AdminDashboard() {
  const { data: orders = [] } = useGetAllOrders();
  const { data: foodItems = [] } = useGetAllFoodItems();

  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const preparingOrders = orders.filter((o) => o.status === 'Preparing').length;
  const readyOrders = orders.filter((o) => o.status === 'Ready').length;
  const completedOrders = orders.filter((o) => o.status === 'Completed').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your cafeteria menu and orders</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Preparing</CardTitle>
            <ChefHat className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{preparingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ready</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{readyOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CircleCheck className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{completedOrders}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-orders" className="w-full">
        <TabsList className="mb-6 grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="all-orders">All Orders</TabsTrigger>
          <TabsTrigger value="orders">Order Management</TabsTrigger>
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
        </TabsList>

        <TabsContent value="all-orders">
          <AllOrdersManagement orders={orders} />
        </TabsContent>

        <TabsContent value="orders">
          <OrderManagement orders={orders} />
        </TabsContent>

        <TabsContent value="menu">
          <MenuManagement foodItems={foodItems} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

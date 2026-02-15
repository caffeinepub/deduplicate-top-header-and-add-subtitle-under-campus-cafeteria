import { useState } from 'react';
import { useGetAllFoodItems, useGetUserOrders } from '../hooks/useQueries';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FoodItemCard from '../components/FoodItemCard';
import OrdersSection from '../components/OrdersSection';
import PaymentPage from '../components/PaymentPage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, ClipboardList } from 'lucide-react';

export default function HomePage() {
  const { data: foodItems = [] } = useGetAllFoodItems();
  const { data: orders = [] } = useGetUserOrders();
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(foodItems.map((item) => item.category)))];

  const filteredItems =
    selectedCategory === 'all' ? foodItems : foodItems.filter((item) => item.category === selectedCategory);

  const handleProceedToPayment = () => {
    setShowPaymentPage(true);
  };

  const handlePaymentBack = () => {
    setShowPaymentPage(false);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentPage(false);
  };

  if (showPaymentPage) {
    return <PaymentPage onBack={handlePaymentBack} onSuccess={handlePaymentSuccess} />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header onProceedToPayment={handleProceedToPayment} />

      <main className="flex-1 bg-gradient-to-b from-orange-50 to-amber-50 p-4 pb-24">
        <div className="mx-auto max-w-7xl">
          <Tabs defaultValue="menu" className="w-full">
            <TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="menu" className="flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4" />
                Menu
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                My Orders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="menu" className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
                        : ''
                    }
                  >
                    {category === 'all' ? 'All Items' : category}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((item) => (
                  <FoodItemCard key={item.id} item={item} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <OrdersSection orders={orders} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import MenuManagement from "../components/MenuManagement";
import { useGetAllFoodItems } from "../hooks/useQueries";

export default function AdminMenuPage() {
  const { data: foodItems = [] } = useGetAllFoodItems();

  return (
    <div data-ocid="admin.menu.section" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add, edit, or remove food items from the cafeteria menu
        </p>
      </div>
      <MenuManagement foodItems={foodItems} />
    </div>
  );
}

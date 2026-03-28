import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useQueryClient } from "@tanstack/react-query";
import { ClipboardList, IdCard, LogOut, Mail, User, X } from "lucide-react";
import { useGetUserOrders } from "../hooks/useQueries";
import { useUserName } from "../hooks/useUserName";

interface ProfileScreenProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogout?: () => void;
}

export default function ProfileScreen({
  open,
  onOpenChange,
  onLogout,
}: ProfileScreenProps) {
  const { userName, logout } = useUserName();
  const { data: orders = [] } = useGetUserOrders();
  const queryClient = useQueryClient();

  const displayName = userName || "Student";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const orderCount = orders.length;

  const handleLogout = () => {
    onOpenChange(false);
    logout();
    queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    // Navigate back to landing page if callback provided
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        data-ocid="profile.sheet"
        side="right"
        className="w-full max-w-sm p-0 overflow-y-auto"
      >
        <SheetHeader className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-white/50 shadow-lg">
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-white text-xl font-bold">
                  {displayName}
                </SheetTitle>
                <SheetDescription className="text-orange-100 text-sm mt-0.5">
                  Campus Cafeteria Member
                </SheetDescription>
              </div>
            </div>
            <Button
              data-ocid="profile.close_button"
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 -mr-2 -mt-2"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Profile Information
            </h3>
            <Card className="border border-orange-100">
              <CardContent className="p-0 divide-y divide-orange-50">
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100">
                    <User className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-semibold text-gray-900 truncate">
                      {displayName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100">
                    <Mail className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-semibold text-gray-900 truncate">
                      student@campus.edu
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100">
                    <IdCard className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Student ID</p>
                    <p className="font-semibold text-gray-900">STU2024001</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Order History
            </h3>
            <Card className="border border-orange-100">
              <CardContent className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
                    <ClipboardList className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">
                      Total Orders Placed
                    </p>
                    <p className="font-semibold text-gray-900">
                      {orderCount} {orderCount === 1 ? "order" : "orders"}
                    </p>
                  </div>
                  <Badge
                    className="bg-orange-100 text-orange-700 border-orange-200"
                    variant="outline"
                  >
                    {orderCount}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              App Info
            </h3>
            <Card className="border border-orange-100">
              <CardContent className="px-4 py-3.5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium text-gray-700">1.0.0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Campus</span>
                  <span className="font-medium text-gray-700">
                    JSPM Canteen
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button
            data-ocid="profile.logout.button"
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 py-5"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

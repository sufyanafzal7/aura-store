import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(title, image_url))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Sign in to view your orders</p>
        <Button onClick={() => navigate("/auth")}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <h1 className="font-display text-3xl font-semibold">Your Orders</h1>

        {isLoading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <Package className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No orders yet</p>
            <Button variant="outline" onClick={() => navigate("/products")}>Start Shopping</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded border p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wider">
                      {order.status}
                    </span>
                    <p className="mt-1 font-semibold">${order.total.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(order.order_items as any[]).map((item: any) => (
                    <div key={item.id} className="flex items-center gap-2 rounded bg-secondary/50 px-3 py-1.5 text-xs">
                      {item.products?.title} × {item.quantity}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

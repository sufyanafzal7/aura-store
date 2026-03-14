import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (cartItems.length === 0 && !orderPlaced) {
    navigate("/cart");
    return null;
  }

  const placeOrder = async () => {
    setPlacing(true);
    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({ user_id: user.id, total: cartTotal })
        .select()
        .single();
      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products.price,
      }));
      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart.mutateAsync();
      setOrderId(order.id);
      setOrderPlaced(true);
      toast.success("Order placed successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle className="h-16 w-16 text-accent" />
        </motion.div>
        <h1 className="font-display text-3xl font-semibold">Order Confirmed!</h1>
        <p className="text-muted-foreground">Order #{orderId.slice(0, 8).toUpperCase()}</p>
        <p className="text-sm text-muted-foreground">Thank you for your purchase.</p>
        <Button variant="outline" onClick={() => navigate("/products")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <h1 className="font-display text-3xl font-semibold">Checkout</h1>

        <div className="space-y-4 rounded border p-6">
          <h2 className="font-display text-xl">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.products.title} × {item.quantity}</span>
              <span>${(item.products.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t pt-4 font-semibold">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        <Button className="w-full" size="lg" onClick={placeOrder} disabled={placing}>
          {placing ? "Placing Order..." : `Place Order — $${cartTotal.toFixed(2)}`}
        </Button>
      </motion.div>
    </div>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate("/auth");
      return;
    }
    addToCart.mutate({ productId: product!.id });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded bg-secondary" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-secondary" />
            <div className="h-6 w-1/4 animate-pulse rounded bg-secondary" />
            <div className="h-20 animate-pulse rounded bg-secondary" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="py-20 text-center text-muted-foreground">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-10 md:grid-cols-2"
      >
        <div className="aspect-square overflow-hidden rounded-sm bg-secondary">
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
          )}
        </div>

        <div className="flex flex-col justify-center space-y-6">
          {product.categories && (
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {(product.categories as any).name}
            </span>
          )}
          <h1 className="font-display text-3xl font-semibold md:text-4xl">{product.title}</h1>
          <p className="font-display text-2xl">${product.price.toFixed(2)}</p>
          {product.description && (
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          )}
          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={addToCart.isPending}
            className="w-full md:w-auto"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            {addToCart.isPending ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

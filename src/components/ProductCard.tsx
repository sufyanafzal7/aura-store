import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/products/${product.id}`} className="group block">
        <div className="aspect-[3/4] overflow-hidden rounded-sm bg-secondary">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="font-body text-sm font-medium tracking-wide">{product.title}</h3>
          <p className="font-body text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
        </div>
      </Link>
    </motion.div>
  );
}

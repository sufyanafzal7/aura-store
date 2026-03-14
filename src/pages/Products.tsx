import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function Products() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", search, selectedCategory],
    queryFn: async () => {
      let query = supabase.from("products").select("*").order("created_at", { ascending: false });
      if (search) query = query.ilike("title", `%${search}%`);
      if (selectedCategory) query = query.eq("category_id", selectedCategory);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="text-center">
          <h1 className="font-display text-4xl font-semibold">Our Collection</h1>
          <p className="mt-2 text-muted-foreground">Thoughtfully curated for modern living</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              maxLength={100}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                !selectedCategory ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                  selectedCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] animate-pulse rounded-sm bg-secondary" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
                <div className="h-3 w-1/4 animate-pulse rounded bg-secondary" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">No products found</div>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

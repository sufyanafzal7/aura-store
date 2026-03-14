import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroBanner from "@/assets/hero-banner.jpg";

export default function Index() {
  const { data: featuredProducts = [] } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden">
        <img
          src={heroBanner}
          alt="Premium lifestyle collection"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/20" />
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <h1 className="font-display text-5xl font-light leading-tight text-primary-foreground md:text-6xl">
              Curated for
              <br />
              <span className="font-semibold">Modern Living</span>
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Discover our thoughtfully selected collection of premium essentials.
            </p>
            <Link to="/products">
              <Button size="lg" className="mt-8 bg-background text-foreground hover:bg-background/90">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold">New Arrivals</h2>
              <p className="mt-1 text-muted-foreground">The latest additions to our collection</p>
            </div>
            <Link to="/products" className="hidden text-sm font-medium tracking-wider uppercase text-accent hover:underline sm:block">
              View All <ArrowRight className="ml-1 inline h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-semibold">Timeless Quality</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Every piece in our collection is selected for its craftsmanship, sustainability, and enduring design.
          </p>
          <Link to="/products">
            <Button variant="outline" size="lg" className="mt-8">
              Explore Collection
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

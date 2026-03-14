import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="font-display text-2xl font-semibold tracking-wide">
          MAISON
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <Link to="/products" className="font-body text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors">
            Shop
          </Link>
          {user && (
            <Link to="/orders" className="font-body text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors">
              Orders
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="font-body text-sm tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors">
              Admin
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <Link to="/cart" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground">
                <LogOut className="mr-1 h-4 w-4" /> Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b md:hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-4">
              <Link to="/products" onClick={() => setMobileOpen(false)} className="text-sm tracking-wider uppercase">Shop</Link>
              {user && <Link to="/orders" onClick={() => setMobileOpen(false)} className="text-sm tracking-wider uppercase">Orders</Link>}
              {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm tracking-wider uppercase">Admin</Link>}
              {user ? (
                <>
                  <Link to="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm tracking-wider uppercase">
                    <ShoppingBag className="h-4 w-4" /> Cart ({cartCount})
                  </Link>
                  <button onClick={() => { handleSignOut(); setMobileOpen(false); }} className="text-left text-sm tracking-wider uppercase text-muted-foreground">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="text-sm tracking-wider uppercase">Sign In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

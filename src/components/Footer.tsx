import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-secondary/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-display text-xl font-semibold">MAISON</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Premium lifestyle essentials, thoughtfully curated.
            </p>
          </div>
          <div>
            <h4 className="font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">Shop</h4>
            <ul className="mt-3 space-y-2">
              <li><Link to="/products" className="text-sm hover:text-accent transition-colors">All Products</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">Account</h4>
            <ul className="mt-3 space-y-2">
              <li><Link to="/auth" className="text-sm hover:text-accent transition-colors">Sign In</Link></li>
              <li><Link to="/cart" className="text-sm hover:text-accent transition-colors">Cart</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} MAISON. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

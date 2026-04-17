import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { apiGet, apiPatch, apiDelete } from "../services/api.js";

export default function Cart() {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    apiGet("/cart/")
      .then(setCart)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  if (authLoading || loading) return <div className="p-20 text-center text-slate-500 animate-pulse">Loading cart...</div>;
  if (!user) {
    return (
      <div className="glass-panel p-20 text-center space-y-6">
        <h1 className="text-4xl font-black">Your Cart</h1>
        <p className="text-slate-400">
          <Link to="/login" className="text-blue-400 font-bold hover:underline">Log in</Link> to view and manage your shopping cart.
        </p>
      </div>
    );
  }
  if (err) return <p role="alert">{err}</p>;

  const items = cart?.items || [];

  return (
    <div className="space-y-10 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-end justify-between px-2">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Shopping Cart</h1>
        <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">{items.length} Items</span>
      </div>

      {!items.length ? (
        <div className="glass-panel p-20 text-center space-y-6">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </div>
          <p className="text-xl font-bold text-slate-400">Your bag is currently empty.</p>
          <Link to="/shop" className="btn-primary inline-flex">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="glass-panel overflow-hidden border border-white/5">
            <ul className="divide-y divide-white/5">
              {items.map((line) => (
                <li key={line._id} className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 group hover:bg-white/[0.02] transition-colors">
                  <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {line.product?.name || "Premium Product"}
                    </h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{line.product?.brand || "Generic"}</p>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="flex items-center bg-black/40 rounded-full border border-white/10 p-1">
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-slate-400 transition-all active:scale-90"
                        onClick={() => apiPatch(`/cart/items/${line._id}`, { quantity: line.quantity - 1 }).then(setCart)}
                      >
                        &minus;
                      </button>
                      <span className="w-10 text-center font-black text-sm">{line.quantity}</span>
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-slate-400 transition-all active:scale-90"
                        onClick={() => apiPatch(`/cart/items/${line._id}`, { quantity: line.quantity + 1 }).then(setCart)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-right min-w-[100px]">
                      <p className="font-black text-blue-400 text-lg">
                        ${((line.product?.price || 0) * line.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
            <button 
              type="button" 
              className="text-slate-500 hover:text-red-400 text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
              onClick={() => apiDelete("/cart/").then(() => setCart({ items: [] }))}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              Clear Cart
            </button>

            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Estimated Total</p>
                <p className="text-3xl font-black text-white">
                  ${items.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0).toFixed(2)}
                </p>
              </div>
              <Link to="/checkout" className="btn-primary px-10">
                Secure Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

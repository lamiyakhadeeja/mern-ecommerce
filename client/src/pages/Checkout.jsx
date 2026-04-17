import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { apiGet, apiPost } from "../services/api.js";
import { toast } from 'react-toastify';

export default function Checkout() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    apiGet("/cart/")
      .then(setCart)
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  async function placeOrder() {
    if (!cart?.items?.length) return;
    setSubmitting(true);
    try {
      await apiPost("/orders/", {
        items: cart.items.map((i) => ({ productId: i.product._id || i.product, quantity: i.quantity })),
        shippingAddress: { name: user.name },
        paymentMethod: "demo",
      });
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="animate-fade-in max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* Order Summary */}
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">Checkout</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">Review your order details</p>
          </div>

          <div className="glass-panel overflow-hidden border border-white/5">
            <div className="bg-white/5 px-6 py-4 border-b border-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Summary</h3>
            </div>
            <div className="divide-y divide-white/5">
              {cart?.items?.length > 0 ? (
                cart.items.map((item, idx) => (
                  <div key={idx} className="p-6 flex justify-between items-center group">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                        {item.product.name}
                      </div>
                      <div className="text-[10px] font-black text-slate-500 uppercase">Unit Qty: {item.quantity}</div>
                    </div>
                    <div className="text-sm font-black text-cyan-400">
                      ${((item.product.price || 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-600 italic font-medium">No items detected in local buffer.</div>
              )}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="w-full md:w-80 space-y-6">
          <div className="glass-panel p-8 space-y-8 border-t-2 border-t-blue-500">
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>Subtotal</span>
                <span className="text-white">${cart?.totalAmount?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>Shipping</span>
                <span className="text-emerald-500">FREE</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <span className="text-xs font-black uppercase tracking-widest text-white">Total</span>
                <span className="text-2xl font-black text-blue-400 tracking-tight">${cart?.totalAmount?.toFixed(2) || "0.00"}</span>
              </div>
            </div>

            <button 
              type="button" 
              disabled={submitting || !cart?.items?.length} 
              onClick={placeOrder}
              className="btn-primary w-full py-4 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              {submitting ? "Processing..." : "Place Order"}
            </button>
          </div>

          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest text-center px-4 leading-relaxed">
            By placing your order, you agree to our terms of service and refund policies.
          </p>
        </div>
      </div>
    </div>
  );
}

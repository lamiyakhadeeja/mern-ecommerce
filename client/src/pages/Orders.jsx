import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { apiGet } from "../services/api.js";
import { Link } from "react-router-dom";

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (authLoading || !user) return;
    apiGet("/orders/mine")
      .then(setOrders)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  if (authLoading || loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Synchronizing Logs...</div>
    </div>
  );
  
  if (err) return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="glass-panel p-6 border-l-4 border-red-500 animate-shake">
        <p className="text-red-400 font-bold flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          System Error: {err}
        </p>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-12 py-8 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent uppercase">Order History</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">View and track your previous orders.</p>
        </div>
        <div className="text-[10px] font-black text-slate-600 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 uppercase tracking-widest">
          {orders.length} Records Found
        </div>
      </div>

      {!orders.length ? (
        <div className="glass-panel py-24 text-center space-y-8 border-dashed border-2 border-white/5">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-3xl mx-auto flex items-center justify-center border border-white/5 mb-6 rotate-12">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">No orders found.</p>
          </div>
          <Link to="/shop" className="btn-primary px-8 py-3 text-xs inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {orders.map((o) => (
            <div key={o._id} className="glass-panel group border border-white/5 overflow-hidden transition-all hover:border-blue-500/20">
              <div className="p-8 space-y-8">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                  <div className="flex gap-10">
                    <div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Order ID</div>
                      <div className="font-mono text-sm font-bold text-blue-400">#{o._id.slice(-8).toUpperCase()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Date</div>
                      <div className="text-sm font-bold text-white">{new Date(o.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total</div>
                      <div className="text-sm font-black text-cyan-400 font-mono">${o.totalAmount?.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="self-start md:self-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${
                      o.orderStatus === 'delivered' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 
                      o.orderStatus === 'cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                    }`}>
                      {o.orderStatus}
                    </span>
                  </div>
                </div>
                
                <div className="pt-8 border-t border-white/5 space-y-6">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                    Items
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {o.items?.map((item, idx) => (
                      <div key={idx} className="bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col gap-2 hover:bg-black/30 transition-colors">
                        <div className="text-sm font-bold text-slate-200 truncate">{item.name}</div>
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black text-slate-500 uppercase">Qty: {item.quantity}</span>
                          <span className="text-xs font-bold text-cyan-500">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

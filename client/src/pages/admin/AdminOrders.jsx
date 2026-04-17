import { useState, useEffect } from "react";
import { apiGet, apiPatch } from "../../services/api.js";
import { toast } from 'react-toastify';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const data = await apiGet("/orders/admin/all");
      setOrders(data);
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, newStatus) {
    try {
      setUpdatingId(id);
      await apiPatch(`/orders/${id}/status`, { orderStatus: newStatus });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: newStatus } : o));
      toast.success("Order status updated!");
    } catch (err) {
      toast.error("Failed to update status: " + err.message);
    } finally {
      setUpdatingId(null);
    }
}

  return (
    <div className="animate-fade-in space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent uppercase">Global Protocol Logs</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Central monitoring of all decentralized order transmissions.</p>
        </div>
        <div className="text-[10px] font-black text-slate-600 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 uppercase tracking-widest">
          {orders.length} Active Streams
        </div>
      </div>

      {error && (
        <div className="glass-panel p-6 border-l-4 border-red-500 animate-shake mb-8">
          <p className="text-red-400 font-bold flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            System Error: {error}
          </p>
        </div>
      )}

      <div className="glass-panel overflow-hidden border border-white/5">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Synchronizing Data...</div>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-6 text-center text-slate-500 uppercase font-black text-[10px] tracking-widest">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            No order packets found in the system.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">
                  <th className="px-8 py-5 border-b border-white/5">Order-SIG</th>
                  <th className="px-8 py-5 border-b border-white/5">Operative</th>
                  <th className="px-8 py-5 border-b border-white/5">Inventory</th>
                  <th className="px-8 py-5 border-b border-white/5">Credits</th>
                  <th className="px-8 py-5 border-b border-white/5">Status</th>
                  <th className="px-8 py-5 border-b border-white/5">Timestamp</th>
                  <th className="px-8 py-5 border-b border-white/5 text-right">Protocol Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-mono text-xs font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                        #{order._id.slice(-8).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-white text-sm">{order.user?.name || 'GUEST-ID'}</div>
                      <div className="text-[10px] font-medium text-slate-500">{order.user?.email || 'OFFLINE'}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-slate-300">
                        {order.items?.length || 0} Assets
                        <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-0.5 max-w-[150px] truncate">
                          {order.items?.slice(0, 2).map(i => i.name).join(", ")}
                          {order.items?.length > 2 ? ' + MORE' : ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-black text-cyan-400 text-sm tracking-tight">${order.totalAmount?.toFixed(2)}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                        order.orderStatus === 'delivered' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 
                        order.orderStatus === 'cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 
                        order.orderStatus === 'shipped' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 
                        'bg-slate-500/10 border-white/5 text-slate-400 opacity-60'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-xs font-medium text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end translate-x-1 group-hover:translate-x-0 transition-transform">
                        <select 
                          disabled={updatingId === order._id}
                          value={order.orderStatus} 
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          className="bg-black/40 border border-white/5 rounded-lg px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 focus:outline-none focus:border-blue-500 group-hover:bg-black/60 transition-all cursor-pointer hover:text-white"
                        >
                          <option value="pending" className="bg-slate-900 leading-relaxed font-sans">Pending</option>
                          <option value="processing" className="bg-slate-900 leading-relaxed font-sans">Processing</option>
                          <option value="shipped" className="bg-slate-900 leading-relaxed font-sans">Shipped</option>
                          <option value="delivered" className="bg-slate-900 leading-relaxed font-sans">Delivered</option>
                          <option value="cancelled" className="bg-slate-900 leading-relaxed font-sans">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

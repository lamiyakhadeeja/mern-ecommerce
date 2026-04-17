import { useState, useEffect } from "react";
import { apiGet } from "../../services/api.js";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [advancedReports, setAdvancedReports] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [statsData, salesData, ordersData, advancedData] = await Promise.all([
        apiGet("/analytics/stats"),
        apiGet("/analytics/monthly-sales"),
        apiGet("/analytics/recent-orders"),
        apiGet("/analytics/advanced-reports"),
      ]);
      setStats(statsData);
      setMonthlySales(salesData);
      setRecentOrders(ordersData);
      setAdvancedReports(advancedData);
    } catch (err) {
      setError(err.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Syncing Intelligence Buffer...</div>
      </div>
    );
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const maxSales = Math.max(...monthlySales.map(m => m.totalSales), 1);

  return (
    <div className="animate-fade-in space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent uppercase">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 font-medium mt-1">Real-time performance metrics and business overview.</p>
        </div>
        <button onClick={fetchData} className="btn-secondary self-start md:self-center flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="glass-panel p-4 border-l-4 border-red-500 animate-shake">
          <p className="text-red-400 font-bold flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {error}
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${stats?.totalRevenue?.toLocaleString() || 0}`} 
          icon={<RevenueIcon />} 
          variant="success"
        />
        <StatCard 
          title="Total Orders" 
          value={stats?.totalOrders || 0} 
          icon={<OrdersIcon />} 
          variant="primary"
        />
        <StatCard 
          title="Total Customers" 
          value={stats?.totalUsers || 0} 
          icon={<UsersIcon />} 
          variant="accent"
        />
        <StatCard 
          title="Total Products" 
          value={stats?.totalProducts || 0} 
          icon={<ProductsIcon />} 
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart (CSS-based) */}
        <div className="lg:col-span-2 glass-panel p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tight uppercase italic text-slate-300">Revenue Growth</h3>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Past 12 Months</span>
          </div>
          {monthlySales.length === 0 ? (
            <div className="h-60 flex items-center justify-center text-slate-600 font-medium italic">No sales data available yet.</div>
          ) : (
            <div className="flex items-end gap-3 h-64 pt-8 pb-10 px-4 border-b border-white/5">
              {monthlySales.map((m, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-4 h-full justify-flex-end group">
                  <div 
                    title={`$${m.totalSales}`}
                    className="w-full bg-gradient-to-t from-blue-600/50 to-cyan-400 rounded-t-lg transition-all duration-700 hover:brightness-125 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                    style={{ height: `${(m.totalSales / maxSales) * 100}%` }} 
                  />
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-white transition-colors uppercase tracking-widest">{monthNames[m._id.month - 1]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Actions / Quick Links */}
        <div className="glass-panel p-8 space-y-8">
          <h3 className="text-xl font-black tracking-tight uppercase italic text-slate-300">Quick Command</h3>
          <div className="flex flex-col gap-4">
            <Link to="/admin/products" className="btn-secondary py-3 text-center transition-all hover:scale-[1.02] active:scale-[0.98]">
              Manage Products
            </Link>
            <Link to="/admin/orders" className="btn-secondary py-3 text-center transition-all hover:scale-[1.02] active:scale-[0.98]">
              Manage Orders
            </Link>
            <Link to="/admin/categories" className="btn-secondary py-3 text-center transition-all hover:scale-[1.02] active:scale-[0.98]">
              Manage Categories
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Top Products */}
        <div className="glass-panel p-8 space-y-6">
          <h3 className="text-lg font-black tracking-tight uppercase italic text-blue-400">Top Products</h3>
          <div className="space-y-6">
            {advancedReports?.topProducts?.map((p, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="text-sm font-bold text-white truncate max-w-[180px]">{p.name}</div>
                  <div className="text-[10px] font-black text-slate-500 uppercase">${p.revenue.toLocaleString()}</div>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    style={{ width: `${(p.totalSold / (advancedReports.topProducts[0]?.totalSold || 1)) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="glass-panel p-8 space-y-6">
          <h3 className="text-lg font-black tracking-tight uppercase italic text-cyan-400">Top Customers</h3>
          <div className="space-y-6">
            {advancedReports?.topCustomers?.map((c, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-sm font-black text-white shadow-lg group-hover:scale-110 transition-transform">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{c.name}</div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{c.orderCount} orders • ${c.totalSpent.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="glass-panel p-8 space-y-6">
          <h3 className="text-lg font-black tracking-tight uppercase italic text-emerald-400">Category Sales</h3>
          <div className="space-y-6">
            {advancedReports?.categoryStats?.map((cat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">{cat._id}</span>
                  <span className="text-emerald-400">${cat.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(cat.totalRevenue / (advancedReports.categoryStats[0]?.totalRevenue || 1)) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="glass-panel overflow-hidden border border-white/5">
        <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5">
          <h3 className="text-xl font-black tracking-tight uppercase italic">Recent Transactions</h3>
          <Link to="/admin/orders" className="text-cyan-400 text-xs font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
            Protocol Logs <span>&rarr;</span>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">
                <th className="px-8 py-5 border-b border-white/5">ID-SIG</th>
                <th className="px-8 py-5 border-b border-white/5">Operator</th>
                <th className="px-8 py-5 border-b border-white/5">Status</th>
                <th className="px-8 py-5 border-b border-white/5">Timestamp</th>
                <th className="px-8 py-5 border-b border-white/5 text-right">Credit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-slate-600 font-medium italic">No active protocols detected.</td>
                </tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6 font-mono text-xs text-blue-400">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-white">{order.user?.name || 'GUEST-ID'}</div>
                      <div className="text-[10px] font-medium text-slate-500">{order.user?.email}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        order.orderStatus === 'delivered' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 
                        order.orderStatus === 'cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-xs font-medium text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right font-black text-cyan-400 text-sm">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, variant }) {
  const styles = {
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    primary: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    accent: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20"
  };

  return (
    <div className="glass-panel p-6 flex items-center gap-5 hover:bg-white/[0.02] transition-colors border border-white/5">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${styles[variant]}`}>
        {icon}
      </div>
      <div className="space-y-1">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</div>
        <div className="text-2xl font-black text-white tracking-tight">{value}</div>
      </div>
    </div>
  );
}

// Icons
const RevenueIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);
const OrdersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
);
const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const ProductsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"></path><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>
);

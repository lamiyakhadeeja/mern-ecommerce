import { Outlet, NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminLayout() {
  const { logout, user } = useAuth();
  
  const navItems = [
    { to: "/admin", label: "Dashboard", end: true, icon: <DashboardIcon /> },
    { to: "/admin/products", label: "Products", icon: <ProductsIcon /> },
    { to: "/admin/categories", label: "Categories", icon: <CategoriesIcon /> },
    { to: "/admin/orders", label: "Orders", icon: <OrdersIcon /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-outfit animate-fade-in">
      <aside className="w-64 bg-slate-900 border-r border-white/5 flex flex-col sticky top-0 h-screen z-50 overflow-y-auto">
        <div className="p-8 border-b border-white/5">
          <Link to="/admin" className="no-underline">
            <h2 className="text-xl font-bold tracking-tighter bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent italic">TechStore Admin</h2>
          </Link>
        </div>
        
        <nav className="flex-1 p-6 flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              end={item.end} 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isActive ? "bg-blue-600/10 text-blue-400 border-r-2 border-blue-500" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="mb-4 px-2">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Logged in as</div>
            <div className="text-sm font-semibold truncate">{user?.name || "Administrator"}</div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 btn-secondary py-2.5 text-sm">
            <LogoutIcon />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-[70px] flex items-center justify-between px-8 bg-slate-950/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold">Command Center</h3>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/" className="btn-secondary !py-1.5 !px-4 text-xs font-bold uppercase tracking-wide">View Storefront</Link>
          </div>
        </header>

        <div className="p-10 max-w-[1400px] mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// Minimal SVG Icons
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
);
const ProductsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
);
const CategoriesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="2" y1="14" x2="6" y2="14"></line><line x1="10" y1="8" x2="14" y2="8"></line><line x1="18" y1="16" x2="22" y2="16"></line></svg>
);
const OrdersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
);
const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
);

import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Header() {
  const { user, logout } = useAuth();
  
  const linkClass = ({ isActive }) => 
    `text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
      isActive 
        ? "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
        : "text-slate-500 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-[95] bg-slate-950/60 backdrop-blur-xl border-b border-white/5">
      <div className="container mx-auto px-6 py-5 flex items-center justify-between gap-8 flex-wrap">
        <div className="flex flex-col group cursor-pointer">
          <Link to="/" className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent uppercase group-hover:to-blue-400 transition-all duration-500">
            TechStore
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse-slow"></span>
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500/80 leading-none">Protocol v4.0.2</div>
          </div>
        </div>

        <nav className="flex items-center gap-8">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/shop" className={linkClass}>Shop</NavLink>
          <NavLink to="/cart" className={linkClass}>Cart</NavLink>
          
          {user ? (
            <div className="flex items-center gap-6 border-l border-white/10 ml-2 pl-8">
              {user.role === "admin" && (
                <NavLink to="/admin" className={linkClass}>Admin</NavLink>
              )}
              <NavLink to="/orders" className={linkClass}>Orders</NavLink>
              <NavLink to="/account" className={linkClass}>Account</NavLink>
              <button 
                type="button" 
                onClick={logout} 
                className="btn-secondary text-[9px] !py-2 !px-4 border-red-500/20 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-all font-bold"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 ml-4">
              <NavLink to="/login" className={linkClass}>Login</NavLink>
              <NavLink to="/register" className="btn-primary !py-2.5 !px-6 text-[9px] shadow-blue-500/20">
                Register
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

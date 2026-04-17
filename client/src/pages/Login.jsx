import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { apiPost } from "../services/api.js";
import { toast } from 'react-toastify';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginPayload, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [loading, user, navigate, from]);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const data = await apiPost("/auth/login", { email, password });
      loginPayload(data);
      if (data.user?.role === "admin") {
        toast.success("Admin Access Granted", { 
          icon: "🛡️",
          style: { border: "1px solid var(--primary)" }
        });
      } else {
        toast.success("Login Successful");
      }
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="animate-fade-in flex justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[70vh] items-center">
      <div className="glass-panel w-full max-w-md p-10 space-y-8 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">Login</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Welcome Back</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder:text-slate-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">
                Password
              </label>
              <Link to="/forgot-password" size="sm" className="text-[10px] font-black uppercase tracking-widest text-cyan-500 hover:text-white transition-colors">
                Forget password?
              </Link>
            </div>
            <input
              type="password"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary w-full py-4 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50" 
            disabled={submitting || loading}
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="pt-6 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-[0.1em]">
          <span className="text-slate-500">New user?</span>{" "}
          <Link to="/register" className="text-blue-500 hover:text-white transition-colors ml-1">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

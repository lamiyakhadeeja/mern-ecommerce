import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { apiPost } from "../services/api.js";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginPayload, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = searchParams.get("email");
    if (q) setEmail(q);
  }, [searchParams]);

  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const data = await apiPost("/auth/reset-password", { email, code, newPassword });
      loginPayload(data);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="animate-fade-in flex justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[70vh] items-center">
      <div className="glass-panel w-full max-w-md p-10 space-y-8 border border-white/5 relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <div className="space-y-3">
          <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">Reset Password</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
            Enter your verification code and define a new access credential.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
              Identity Confirmation
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
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
              Verification Code (OTP)
            </label>
            <input
              type="text"
              inputMode="numeric"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-black tracking-[0.3em] text-center"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\s/g, ""))}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
              New Access Code
            </label>
            <input
              type="password"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <p className="text-red-400 text-[10px] font-black p-3 bg-red-500/10 border border-red-500/20 rounded-lg uppercase tracking-widest leading-relaxed">{error}</p>}

          <button 
            type="submit" 
            className="btn-primary w-full py-4 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50" 
            disabled={submitting || loading}
          >
            {submitting ? "Updating Logic..." : "Reconfigure Account"}
          </button>
        </form>

        <div className="pt-6 border-t border-white/5 flex flex-col gap-4 text-[10px] font-black uppercase tracking-[0.1em]">
          <Link to="/forgot-password" className="text-blue-500 hover:text-white transition-all">
            Request New Reset Sequence
          </Link>
          <Link to="/login" className="text-slate-500 hover:text-white transition-all">
            &larr; Back to Port Access
          </Link>
        </div>
      </div>
    </div>
  );
}

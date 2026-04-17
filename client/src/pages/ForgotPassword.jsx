import { useState } from "react";
import { Link } from "react-router-dom";
import { apiPost } from "../services/api.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);
    try {
      const data = await apiPost("/auth/forgot-password", { email });
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="animate-fade-in flex justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[70vh] items-center">
      <div className="glass-panel w-full max-w-md p-10 space-y-8 border border-white/5 relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        <div className="space-y-3">
          <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">Forgot Password</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed px-4">
            Enter your communication port. We will transmit a secure reset sequence.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 pt-4 text-left">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
              Your Email
            </label>
            <input
              type="email"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium placeholder:text-slate-700"
              placeholder="operator@techo.net"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-400 text-[10px] font-black p-3 bg-red-500/10 border border-red-500/20 rounded-lg uppercase tracking-widest leading-relaxed">{error}</p>}
          {message && <p className="text-emerald-400 text-[10px] font-black p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg uppercase tracking-widest leading-relaxed shadow-[0_0_15px_rgba(16,185,129,0.1)]">{message}</p>}

          <button 
            type="submit" 
            className="btn-primary w-full py-4 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all disabled:opacity-50" 
            disabled={submitting}
          >
            {submitting ? "Transmitting..." : "Send Sequence"}
          </button>
        </form>

        <div className="pt-6 border-t border-white/5 flex flex-col gap-4 text-[10px] font-black uppercase tracking-[0.1em]">
          <Link 
            to={`/reset-password${email ? `?email=${encodeURIComponent(email)}` : ""}`} 
            className="text-cyan-500 hover:text-white transition-all bg-white/5 py-3 rounded-lg border border-white/5 hover:border-cyan-500/30"
          >
            I already have a sequence code
          </Link>
          <Link to="/login" className="text-slate-500 hover:text-white transition-all">
            &larr; Return to Port Access
          </Link>
        </div>
      </div>
    </div>
  );
}

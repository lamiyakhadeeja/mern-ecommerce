import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { apiPost } from "../services/api.js";
import { toast } from 'react-toastify';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginPayload, user, loading } = useAuth();
  const [step, setStep] = useState("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [loading, user, navigate, from]);

  async function onSubmitForm(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const data = await apiPost("/auth/register", { name, email, password });
      if (data.requiresVerification) {
        setEmail(String(data.email || email).trim().toLowerCase());
        setStep("otp");
        toast.info("Please verify your email to continue.");
      } else if (data.token) {
        loginPayload(data);
        toast.success("Registration successful!");
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function onVerifyOtp(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const data = await apiPost("/auth/verify-signup", { email, code });
      loginPayload(data);
      toast.success("Email verified successfully!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function onResend() {
    setError(null);
    setSubmitting(true);
    try {
      await apiPost("/auth/resend-signup-otp", { email });
      toast.success("Verification code resent.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "otp") {
    return (
      <div className="animate-fade-in flex justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[70vh] items-center">
        <div className="glass-panel w-full max-w-md p-10 space-y-8 border border-white/5 relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
          <div className="space-y-3">
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">Verify Email</h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Verification code sent to <span className="text-cyan-400">{email}</span>. Please check your inbox.
            </p>
          </div>

          <form onSubmit={onVerifyOtp} className="space-y-8">
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">
              Enter Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-6 text-center text-4xl font-black text-cyan-400 tracking-[0.4em] focus:outline-none focus:border-cyan-500 transition-all shadow-inner"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                maxLength={6}
                placeholder="000000"
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary w-full py-4 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all disabled:opacity-50" 
              disabled={submitting || code.length !== 6}
            >
            {submitting ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="pt-6 border-t border-white/5 flex flex-col gap-4 text-[10px] font-black uppercase tracking-[0.1em]">
            <button 
              type="button" 
              disabled={submitting} 
              onClick={onResend} 
              className="text-cyan-500 hover:text-white transition-all disabled:opacity-30"
            >
              Resend Code
            </button>
            <button 
              type="button" 
              onClick={() => setStep("form")} 
              className="text-slate-500 hover:text-white transition-all"
            >
              &larr; Return to Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[70vh] items-center">
      <div className="glass-panel w-full max-w-md p-10 space-y-8 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">Register</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Create your account</p>
        </div>

        <form onSubmit={onSubmitForm} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                Full Name
            </label>
            <input
              type="text"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium placeholder:text-slate-700"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                Email Address
            </label>
            <input
              type="email"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium placeholder:text-slate-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                Password
            </label>
            <input
              type="password"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          
          {error && <p className="text-red-400 text-[10px] font-black p-3 bg-red-500/10 border border-red-500/20 rounded-lg uppercase tracking-widest leading-relaxed">{error}</p>}

          <button 
            type="submit" 
            className="btn-primary w-full py-4 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all disabled:opacity-50" 
            disabled={submitting || loading}
          >
            {submitting ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="pt-6 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-[0.1em]">
          <span className="text-slate-500">Already have an account?</span>{" "}
          <Link to="/login" className="text-cyan-500 hover:text-white transition-colors ml-1">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

import { useAuth } from "../context/AuthContext.jsx";

export default function Account() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Scanning Bio-Signature...</div>
    </div>
  );

  return (
    <div className="animate-fade-in max-w-2xl mx-auto py-12 px-4">
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-4">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent uppercase">My Account</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Manage your personal information and preferences.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Account Level</div>
              <div className="text-sm font-black text-blue-500 uppercase">{user.role}</div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Asset Identity</label>
              <div className="bg-black/40 border border-white/5 rounded-xl px-5 py-4">
                <div className="text-sm font-bold text-white uppercase tracking-tight">{user.name}</div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Comm-Link Channel</label>
              <div className="bg-black/40 border border-white/5 rounded-xl px-5 py-4">
                <div className="text-sm font-bold text-blue-400 font-mono">{user.email}</div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Authority Clearance</label>
              <div className="bg-black/40 border border-white/5 rounded-xl px-5 py-4">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                  user.role === 'admin' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Auth Validation</label>
              <div className="bg-black/40 border border-white/5 rounded-xl px-5 py-4 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.3)] ${user.emailVerified !== false ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-amber-500 shadow-amber-500/50'}`}></div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                  {user.emailVerified !== false ? "Verified Protocol" : "Pending Validation"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 flex justify-center text-center">
          <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em] leading-relaxed">
            SYSTEM NOTIFICATION: YOUR PROFILE DATA IS ENCRYPTED AND STORED IN SECURE DECENTRALIZED BUFFERS. 
            <br />LOGOUT TO PURGE LOCAL CACHE.
          </p>
        </div>
      </div>
    </div>
  );
}

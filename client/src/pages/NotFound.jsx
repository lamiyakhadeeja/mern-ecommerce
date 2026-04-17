import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 animate-fade-in text-center">
      <div className="relative mb-8">
        <h1 className="text-[12rem] font-black italic tracking-tighter leading-none bg-gradient-to-b from-white/20 to-transparent bg-clip-text text-transparent select-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-5xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Link Severed</h2>
        </div>
      </div>
      
      <div className="glass-panel p-8 max-w-md border border-white/5 space-y-6">
        <p className="text-slate-400 font-medium leading-relaxed">
          The requested data packet could not be located in the central repository. The connection to this sector has been terminated or the address is invalid.
        </p>
        
        <div className="pt-4">
          <Link to="/" className="btn-primary inline-flex items-center gap-3 px-10 py-4 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 active:scale-[0.95] transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
            Return to Core
          </Link>
        </div>
      </div>
      
      <div className="mt-12 text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] animate-pulse">
        Error Code: ERR_SECTOR_NOT_FOUND_404
      </div>
    </div>
  );
}

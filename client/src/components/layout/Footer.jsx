export default function Footer() {
  return (
    <footer className="mt-24 pb-12 pt-16 bg-slate-950/40 border-t border-white/5 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      
      <div className="container mx-auto px-6 flex flex-col items-center text-center">
        <div className="mb-8">
          <h2 className="text-lg font-black italic tracking-widest text-white uppercase mb-2">TechStore</h2>
          <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <p className="max-w-md text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em] leading-loose">
          PREMIUM ELECTRONICS for the modern enthusiast. 
          Secure payments & fast shipping.
        </p>
        
        <div className="mt-12 pt-8 border-t border-white/5 w-full flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} TechStore. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            {['Privacy', 'Terms', 'Support'].map(item => (
              <a key={item} href="#" className="text-[9px] font-black text-slate-600 hover:text-blue-400 uppercase tracking-[0.3em] transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "react-router-dom";
import { useCategories } from "../hooks/useCategories.js";
import { useProductList } from "../hooks/useProducts.js";
import ProductCard from "../components/common/ProductCard.jsx";

export default function Home() {
  const { categories, loading: catLoading } = useCategories();
  const { items: products, loading: prodLoading } = useProductList();
  
  const featuredProducts = (products || []).slice(0, 4);

  const electronics = [
    { slug: "phones", label: "Phones", blurb: "Phones, foldables, and mobile devices" },
    { slug: "laptops", label: "Laptops", blurb: "Work and play laptops" },
    { slug: "accessories", label: "Accessories", blurb: "Cases, chargers, cables, audio" },
  ];

  return (
    <div className="space-y-24 animate-fade-in text-white">
      <section className="glass-panel overflow-hidden relative border border-white/5 rounded-[2.5rem]">
        <div className="container mx-auto px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 space-y-10 text-center lg:text-left">
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] bg-gradient-to-br from-white via-white to-blue-500 bg-clip-text text-transparent">
              Future of Tech <br /> is Here
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Discover the next generation of premium electronics, from breakthrough smartphones to high-performance computing.
            </p>
            <div className="flex justify-center lg:justify-start">
              <Link to="/shop" className="btn-primary scale-110">
                Browse Shop
              </Link>
            </div>
          </div>
          <div className="flex-1 relative flex justify-center group lg:-translate-y-12 lg:hover:-translate-y-16 transition-transform duration-500">
            <img 
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800" 
              alt="Featured Tech" 
              className="w-full max-w-lg rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] border border-white/10 animate-float z-10" 
            />
            <div className="absolute inset-0 bg-blue-500/30 blur-[120px] rounded-full -z-0 opacity-40 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
        </div>
      </section>

      <section className="space-y-12">
        <div className="flex items-end justify-between px-2">
          <div className="space-y-2">
            <div className="text-cyan-500 font-bold uppercase tracking-widest text-xs">Curated Selection</div>
            <h2 className="text-4xl font-black tracking-tight">Featured Products</h2>
          </div>
          <Link to="/shop" className="text-blue-400 font-bold border-b-2 border-blue-500/20 hover:border-blue-400 transition-all pb-1 flex items-center gap-2 uppercase text-sm tracking-wide">
            View All <span>&rarr;</span>
          </Link>
        </div>
        
        {prodLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => <div key={i} className="aspect-square glass-panel animate-pulse bg-white/5"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      <section className="space-y-12 pb-20">
        <div className="space-y-2 px-2">
          <div className="text-blue-500 font-bold uppercase tracking-widest text-sm">Our Collections</div>
          <h2 className="text-4xl font-black tracking-tight">Shop by Category</h2>
        </div>
        
        {catLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1,2,3].map(i => <div key={i} className="h-64 glass-panel animate-pulse bg-white/5"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {electronics.map((e) => {
              const desc = categories.find((c) => c.slug === e.slug)?.description || e.blurb;
              return (
                <Link 
                  key={e.slug} 
                  to={`/shop?categorySlug=${e.slug}`} 
                  className="glass-panel p-10 group flex flex-col h-full hover:bg-slate-800/40 relative overflow-hidden active:scale-[0.98] transition-all"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500"></div>
                  <h3 className="text-2xl font-black mb-4 group-hover:text-blue-400 transition-colors uppercase tracking-tight italic">{e.label}</h3>
                  <p className="text-slate-400 flex-grow leading-relaxed font-medium">{desc}</p>
                  <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-blue-500 group-hover:gap-4 transition-all uppercase tracking-[0.2em]">
                    Explore Collection <span>&rarr;</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

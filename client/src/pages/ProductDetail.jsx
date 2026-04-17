import { useParams, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { useProduct } from "../hooks/useProducts.js";
import { useAuth } from "../context/AuthContext.jsx";
import { apiPost } from "../services/api.js";

export default function ProductDetail() {
  const { slug } = useParams();
  const { product, loading, error } = useProduct(slug);
  const { user } = useAuth();

  async function addToCart() {
    if (!user) {
      toast.info("Please log in to add items to your cart.");
      return;
    }
    try {
      await apiPost("/cart/items", { productId: product._id, quantity: 1 });
      toast.success(`${product.name} added to cart!`);
    } catch (e) {
      toast.error(e.message);
    }
  }

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Scanning Asset Data...</div>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 animate-fade-in text-center">
      <div className="text-6xl font-black text-red-500/20 uppercase tracking-tighter italic">404 Error</div>
      <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">The page you are looking for does not exist.</p>
      <Link to="/shop" className="btn-secondary">Back to Shop</Link>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-12">
      <Link to="/shop" className="inline-flex items-center gap-3 text-slate-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] group">
        <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Return to Catalog
      </Link>

      <div className="glass-panel p-10 lg:p-16 flex flex-col lg:flex-row gap-16 lg:gap-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        
        <div className="flex-1">
          <div className="aspect-square bg-black/40 rounded-3xl overflow-hidden border border-white/5 shadow-2xl group">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-700 font-black uppercase tracking-widest text-xs italic">Asset Buffer Empty</div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-10 flex flex-col justify-center relative">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              {product.brand && (
                <span className="badge badge-primary">
                  {product.brand}
                </span>
              )}
              {product.category?.name && (
                <span className="badge bg-slate-500/10 border-slate-500/20 text-slate-400">
                  {product.category.name}
                </span>
              )}
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none italic uppercase bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent">
              {product.name}
            </h1>
            <div className="flex items-end gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Market Credit</span>
                <p className="text-4xl font-black text-white tracking-tighter italic">
                  ${product.price?.toFixed(2)}
                </p>
              </div>
              <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 mb-1 rounded-md border ${product.stock > 0 ? 'border-emerald-500/20 text-emerald-500' : 'border-red-500/20 text-red-500'}`}>
                {product.stock > 0 ? `Available: ${product.stock}` : 'Out of Stock'}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Technical Brief</h3>
            <p className="text-slate-400 leading-relaxed text-lg max-w-xl italic">
              {product.description || "NO PRODUCT SUMMARY DATA DETECTED IN STORAGE BUFFERS."}
            </p>
          </div>

          <div className="pt-8">
            <button 
              type="button" 
              onClick={addToCart} 
              className="btn-primary w-full lg:w-auto px-16 py-5 text-sm active:scale-95 group/btn"
              disabled={product.stock <= 0}
            >
              <span className="flex items-center justify-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                Add to Cart
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

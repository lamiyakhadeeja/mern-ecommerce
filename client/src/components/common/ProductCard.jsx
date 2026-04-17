import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiPost } from "../../services/api.js";
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const img = product.images?.[0];

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.info("Please log in to add items to your cart.");
      return;
    }
    try {
      await apiPost("/cart/items", { productId: product._id, quantity: 1 });
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <article className="glass-panel group relative flex flex-col h-full border border-white/5 transition-all duration-500 hover:-translate-y-2 hover:bg-slate-900/40">
      <Link 
        to={`/product/${product.slug}`} 
        className="flex flex-col h-full p-5"
      >
        <div className="aspect-square bg-black/20 overflow-hidden rounded-xl relative mb-6 border border-white/5">
          {img ? (
            <img 
              src={img} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0" 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-50"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-500"></div>
          
          <div className="absolute top-3 right-3">
             <span className="bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-md text-blue-400">
               Stock: {product.stock > 0 ? product.stock : 'Empty'}
             </span>
          </div>
        </div>

        <div className="flex flex-col flex-grow">
          {product.brand && (
            <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2 leading-none">
              {product.brand}
            </p>
          )}
          <h3 className="text-base font-black text-white italic tracking-tight line-clamp-2 leading-tight mb-6 group-hover:text-blue-400 transition-colors uppercase">
            {product.name}
          </h3>
          
          <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-white/5">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Price</span>
              <p className="text-xl font-black text-white tracking-tighter italic">
                ${product.price?.toFixed(2)}
              </p>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-blue-500 hover:text-white hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 active:scale-90 shadow-inner group/btn"
              title="Add to Cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:scale-110 transition-transform"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
}

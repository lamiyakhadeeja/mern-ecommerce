import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/common/ProductCard.jsx";
import { useProductList } from "../hooks/useProducts.js";
import { useCategories } from "../hooks/useCategories.js";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get("categorySlug") || "";
  const { items, loading, error } = useProductList(categorySlug ? { categorySlug } : {});
  const { categories, loading: catLoading, error: catError } = useCategories();

  const title = categorySlug
    ? categories.find((c) => c.slug === categorySlug)?.name || "Shop"
    : "Shop";

  if (loading) return <p className="text-muted">Loading products…</p>;
  if (error) return <p className="text-error" role="alert">Could not load products: {error}</p>;

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="space-y-4">
        <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
          Explore our collection of high-performance phones, professional laptops, and essential accessories.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {catLoading ? (
          <div className="flex gap-3">
            {[1,2,3,4].map(i => <div key={i} className="h-10 w-24 bg-white/5 animate-pulse rounded-full"></div>)}
          </div>
        ) : (
          <>
            <Link
              to="/shop"
              className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 border ${
                !categorySlug 
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20" 
                  : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              All Products
            </Link>
            {categories.map((c) => {
              const active = categorySlug === c.slug;
              return (
                <Link
                  key={c._id}
                  to={`/shop?categorySlug=${encodeURIComponent(c.slug)}`}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 border ${
                    active 
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20" 
                      : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {c.name}
                </Link>
              );
            })}
          </>
        )}
      </div>

      {!items.length ? (
        <div className="glass-panel p-20 text-center space-y-4">
          <p className="text-xl font-bold text-slate-300">No products found</p>
          <p className="text-slate-500">Try selecting a different category or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

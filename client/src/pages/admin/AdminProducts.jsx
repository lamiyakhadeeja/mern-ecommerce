import { useState, useEffect } from "react";
import { apiGet, apiPost, apiPut, apiDelete, apiUpload } from "../../services/api.js";
import { toast } from 'react-toastify';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    brand: "",
    description: "",
    price: "",
    compareAtPrice: "",
    category: "",
    stock: "",
    sku: "",
    images: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        apiGet("/products?limit=100"),
        apiGet("/categories"),
      ]);
      setProducts(productsData.items || []);
      setCategories(categoriesData || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "name" && !formData.slug && !editingId ? { slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') } : {})
    }));
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name || "",
      slug: product.slug || "",
      brand: product.brand || "",
      description: product.description || "",
      price: product.price || "",
      compareAtPrice: product.compareAtPrice || "",
      category: product.category?._id || product.category || "",
      stock: product.stock || "",
      sku: product.sku || "",
      images: (product.images || []).join(", "),
    });
    setImageFiles([]);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "", slug: "", brand: "", description: "", price: "", 
      compareAtPrice: "", category: "", stock: "", sku: "", images: "" 
    });
    setImageFiles([]);
    setIsSubmitting(false);
    setShowForm(false);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      console.log("[submit] imageFiles:", imageFiles);

      let uploadedUrls = [];
      if (imageFiles.length > 0) {
        const uploadData = new FormData();
        imageFiles.forEach(file => uploadData.append("images", file));
        console.log("[submit] uploading to /upload/multiple...");
        const res = await apiUpload("/upload/multiple", uploadData);
        console.log("[submit] upload response:", res);
        if (res.urls) uploadedUrls = res.urls;
      }

      const existingUrls = formData.images.split(",").map(url => url.trim()).filter(url => url !== "");
      console.log("[submit] existingUrls:", existingUrls, "| uploadedUrls:", uploadedUrls);

      const submissionData = {
        ...formData,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        stock: Number(formData.stock),
        images: [...existingUrls, ...uploadedUrls],
      };
      console.log("[submit] submissionData.images:", submissionData.images);

      if (editingId) {
        await apiPut(`/products/${editingId}`, submissionData);
        toast.success("Product updated successfully!");
      } else {
        await apiPost("/products", submissionData);
        toast.success("Product created successfully!");
      }

      resetForm();
      fetchData();
    } catch (err) {
      console.error("[submit] ERROR:", err);
      toast.error(err.message || `Failed to ${editingId ? 'update' : 'create'} product`);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiDelete(`/products/${id}`);
      toast.success("Product deleted successfully!");
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to delete product");
    }
  }

  return (
    <div className="animate-fade-in space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent uppercase">Product Management</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Manage your inventory and product listings.</p>
        </div>
        <button 
          className={`group flex items-center gap-3 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${
            showForm ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' : 'btn-primary'
          }`}
          onClick={() => showForm ? resetForm() : setShowForm(true)}
        >
          {showForm ? (
             <>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
               Cancel
             </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-125 transition-transform"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add New Product
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div className="glass-panel animate-fade-in p-8 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          <div className="pb-8 mb-8 border-b border-white/5">
            <h2 className="text-xl font-black italic tracking-tighter uppercase text-white">
              {editingId ? 'Modify Identification' : 'Protocol Specification'}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Product Name</label>
                <input type="text" name="name" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-medium" value={formData.name} onChange={handleInputChange} required placeholder="iPhone 15 Pro Max" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Slug-ID</label>
                <input type="text" name="slug" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-mono text-sm" value={formData.slug} onChange={handleInputChange} required placeholder="iphone-15-pro-max" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Unit Credit ($)</label>
                <input type="number" name="price" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-black text-cyan-400" value={formData.price} onChange={handleInputChange} required step="0.01" placeholder="999.00" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Comparative Hub ($)</label>
                <input type="number" name="compareAtPrice" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-medium text-slate-400" value={formData.compareAtPrice} onChange={handleInputChange} step="0.01" placeholder="1099.00" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Inventory Depth</label>
                <input type="number" name="stock" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold" value={formData.stock} onChange={handleInputChange} required placeholder="25" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Category</label>
                <select name="category" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-medium appearance-none" value={formData.category} onChange={handleInputChange} required>
                  <option value="" className="bg-slate-900 leading-relaxed">System Default</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id} className="bg-slate-900 leading-relaxed">{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Manufacturer</label>
                <input type="text" name="brand" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-medium" value={formData.brand} onChange={handleInputChange} placeholder="TechO Corp" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">SKU-SIG</label>
                <input type="text" name="sku" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-mono text-sm" value={formData.sku} onChange={handleInputChange} placeholder="PH-IP15P-256" />
              </div>

              <div className="md:col-span-3 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Media Buffers (URLs)</label>
                <textarea name="images" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-mono text-xs" value={formData.images} onChange={handleInputChange} rows="2" placeholder="https://..." />
              </div>
              <div className="md:col-span-3 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Local Data Transmission (Files)</label>
                <input type="file" multiple accept="image/*" onChange={(e) => setImageFiles(Array.from(e.target.files))} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-blue-500/10 file:text-blue-500 hover:file:bg-blue-500/20 transition-all" />
              </div>

              <div className="md:col-span-3 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Technical Specifications</label>
                <textarea name="description" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-medium leading-relaxed" value={formData.description} onChange={handleInputChange} rows="4" placeholder="Write a compelling product description..." />
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex gap-4">
              <button 
                type="submit" 
                className="btn-primary px-10 py-4 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 active:scale-[0.95] transition-all disabled:opacity-50" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : (editingId ? 'Update Product' : 'Add Product')}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all border border-white/5 rounded-xl hover:bg-white/5" 
                  onClick={resetForm}
                >
                  Discard Changes
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel overflow-hidden border border-white/5">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Scanning Warehouse...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-6 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/5 mb-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path></svg>
            </div>
            <div className="space-y-2">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Zone Empty</p>
              <p className="text-slate-600 text-[10px] font-medium uppercase tracking-widest">Initialize a new prototype to begin tracking.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">
                  <th className="px-8 py-5 border-b border-white/5">Asset Spec</th>
                  <th className="px-8 py-5 border-b border-white/5">Sector</th>
                  <th className="px-8 py-5 border-b border-white/5">Credit</th>
                  <th className="px-8 py-5 border-b border-white/5">Depth</th>
                  <th className="px-8 py-5 border-b border-white/5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map(product => (
                  <tr key={product._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="relative shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover border border-white/10 group-hover:border-blue-500/30 transition-colors" />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-600">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-white group-hover:text-blue-400 transition-colors truncate max-w-[200px]">{product.name}</div>
                          <div className="text-[10px] font-black text-slate-500 uppercase mt-1 tracking-widest">
                            {product.brand} • <span className="font-mono text-blue-500/80">{product.sku || "UNSPECIFIED"}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                        {product.category?.name || "NON-CLASSIFIED"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-black text-cyan-400 text-sm tracking-tight">${product.price?.toFixed(2)}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                           product.stock <= 5 ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                         }`}>
                           {product.stock} Units
                         </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 translate-x-2 group-hover:translate-x-0 transition-transform">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30 transition-all"
                          title="Modify Protocol"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all"
                          title="Purge Asset"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

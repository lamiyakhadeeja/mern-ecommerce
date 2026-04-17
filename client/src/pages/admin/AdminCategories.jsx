import { useState, useEffect } from "react";
import { apiGet, apiPost, apiDelete } from "../../services/api.js";
import { toast } from 'react-toastify';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      const data = await apiGet("/categories");
      setCategories(data || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "name" && !formData.slug ? { slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') } : {})
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await apiPost("/categories", formData);
      setFormData({ name: "", slug: "", description: "" });
      toast.success("Category created successfully!");
      fetchCategories();
    } catch (err) {
      toast.error(err.message || "Failed to create category");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure? This may affect products in this category.")) return;
    try {
      await apiDelete(`/categories/${id}`);
      toast.success("Category deleted.");
      fetchCategories();
    } catch (err) {
      toast.error(err.message || "Failed to delete category");
    }
  }

  return (
    <div className="animate-fade-in space-y-10">
      <div>
        <h1 className="text-4xl font-black italic tracking-tighter bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent uppercase">Category Management</h1>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Organize your products into logical categories.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Creation Form */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="glass-panel p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <h2 className="text-lg font-black italic tracking-tighter uppercase text-white mb-8 flex items-center gap-3">
              <span className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]"></span>
              Create Category
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Category Name</label>
                <input type="text" name="name" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500 transition-all font-medium text-sm" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Quantum Computing" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Path Identifier (Slug)</label>
                <input type="text" name="slug" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500 transition-all font-mono text-xs" value={formData.slug} onChange={handleInputChange} required placeholder="quantum-computing" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Description</label>
                <textarea name="description" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500 transition-all font-medium text-sm leading-relaxed" value={formData.description} onChange={handleInputChange} rows="4" placeholder="Briefly describe category parameters..." />
              </div>
              <button 
                type="submit" 
                className="btn-primary w-full py-4 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Create Category
              </button>
            </form>
          </div>
        </div>

        {/* Categories List */}
        <div className="flex-1 glass-panel overflow-hidden border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">
                  <th className="px-8 py-5 border-b border-white/5">Sector Specification</th>
                  <th className="px-8 py-5 border-b border-white/5">Protocol Param</th>
                  <th className="px-8 py-5 border-b border-white/5 text-right">Emergency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="py-24 text-center">
                      <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scanning Sectors...</div>
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-24 text-center">
                      <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">No active sectors detected.</p>
                    </td>
                  </tr>
                ) : categories.map(cat => (
                  <tr key={cat._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">{cat.name}</div>
                      <div className="text-mono text-[10px] text-slate-500 uppercase tracking-widest mt-1">/{cat.slug}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-medium text-slate-400 max-w-sm truncate whitespace-nowrap overflow-hidden text-ellipsis italic">
                        {cat.description || "NO DATA BUFFER"}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => handleDelete(cat._id)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/30 transition-all group-hover:scale-110 active:scale-95 translate-x-1 group-hover:translate-x-0"
                        title="Purge Sector"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

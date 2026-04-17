import { useEffect, useState } from "react";
import { apiGet } from "../services/api.js";

export function useProductList(params = {}) {
  const [data, setData] = useState({ items: [], loading: true, error: null });
  const qs = new URLSearchParams(params).toString();

  useEffect(() => {
    let cancelled = false;
    setData((d) => ({ ...d, loading: true, error: null }));
    apiGet(`/products?${qs}`)
      .then((res) => {
        if (!cancelled) setData({ items: res.items || [], loading: false, error: null, meta: res });
      })
      .catch((e) => {
        if (!cancelled) setData({ items: [], loading: false, error: e.message });
      });
    return () => {
      cancelled = true;
    };
  }, [qs]);

  return data;
}

export function useProduct(slug) {
  const [data, setData] = useState({ product: null, loading: true, error: null });

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setData((d) => ({ ...d, loading: true, error: null }));
    apiGet(`/products/${slug}`)
      .then((product) => {
        if (!cancelled) setData({ product, loading: false, error: null });
      })
      .catch((e) => {
        if (!cancelled) setData({ product: null, loading: false, error: e.message });
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return data;
}

export const useProducts = useProductList;

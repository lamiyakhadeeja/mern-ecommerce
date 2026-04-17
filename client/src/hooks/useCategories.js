import { useEffect, useState } from "react";
import { apiGet } from "../services/api.js";

export function useCategories() {
  const [data, setData] = useState({ categories: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    apiGet("/categories")
      .then((categories) => {
        if (!cancelled) setData({ categories: categories || [], loading: false, error: null });
      })
      .catch((e) => {
        if (!cancelled) setData({ categories: [], loading: false, error: e.message });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}

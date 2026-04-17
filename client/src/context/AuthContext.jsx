import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { apiGet } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    apiGet("/auth/me")
      .then(setUser)
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      setUser,
      logout() {
        localStorage.removeItem("token");
        setUser(null);
      },
      loginPayload(data) {
        if (data.token) localStorage.setItem("token", data.token);
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          emailVerified: data.emailVerified !== false,
        });
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

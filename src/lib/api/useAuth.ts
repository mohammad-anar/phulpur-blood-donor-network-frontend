"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AuthUser,
  getStoredToken,
  getStoredUser,
  authApi,
  clearStoredAuth,
} from "./auth";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshFromStorage = useCallback(() => {
    const t = getStoredToken();
    const u = getStoredUser();
    setToken(t);
    setUser(u);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshFromStorage();

    const handleAuthChange = () => {
      refreshFromStorage();
    };

    window.addEventListener("phulpur-auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("phulpur-auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [refreshFromStorage]);

  // Optionally fetch fresh user data from server if token exists
  const refreshUser = useCallback(async () => {
    const t = getStoredToken();
    if (!t) return null;
    try {
      const freshUser = await authApi.getMe();
      setUser(freshUser);
      return freshUser;
    } catch {
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setToken(null);
  }, []);

  return {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    refreshUser,
    logout,
  };
}

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { insforge } from "@/lib/insforge";

interface AuthUser {
  id: string;
  email: string;
  emailVerified?: boolean;
  profile?: {
    name?: string;
    avatar_url?: string | null;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; requireVerification?: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithOAuth: (provider: "google" | "github") => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const { data, error } = await insforge.auth.getCurrentUser();
      if (error) {
        setUser(null);
      } else if (data?.user) {
        setUser(data.user as AuthUser);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const { data, error } = await insforge.auth.signUp({
        email,
        password,
        name: name || undefined,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.requireEmailVerification) {
        return { success: true, requireVerification: true };
      }

      if (data?.user) {
        setUser(data.user as AuthUser);
        // Also create/ensure profile in profiles table
        try {
          await insforge.database.from("profiles").insert([
            {
              id: data.user.id,
              email: data.user.email,
              full_name: name || null,
              role: "customer",
            },
          ]);
        } catch {
          // ignore duplicate
        }
        return { success: true, requireVerification: false };
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      return { success: false, error: message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await insforge.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        setUser(data.user as AuthUser);
        return { success: true };
      }

      return { success: false, error: "Unable to complete login" };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      return { success: false, error: message };
    }
  };

  const signInWithOAuth = async (provider: "google" | "github") => {
    try {
      const redirectTo = typeof window !== "undefined" ? window.location.origin : "";
      const { data, error } = await insforge.auth.signInWithOAuth(provider, {
        redirectTo,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.url) {
        window.location.href = data.url;
        return { success: true };
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "OAuth redirection failed";
      return { success: false, error: message };
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const { data, error } = await insforge.auth.verifyEmail({
        email,
        otp,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        setUser(data.user as AuthUser);
        return { success: true };
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Verification failed";
      return { success: false, error: message };
    }
  };

  const signOut = async () => {
    try {
      await insforge.auth.signOut();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signInWithOAuth,
        verifyOtp,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


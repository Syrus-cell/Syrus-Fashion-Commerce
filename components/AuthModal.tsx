"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { signIn, signUp, signInWithOAuth, verifyOtp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "verify">("signin");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await signIn(email, password);
    setLoading(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || "Failed to sign in");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await signUp(email, password, name);
    setLoading(false);

    if (res.success) {
      if (res.requireVerification) {
        setMode("verify");
        setSuccessMsg("Verification code dispatched to " + email);
      } else {
        setSuccessMsg("Account created successfully!");
        setTimeout(() => onClose(), 1000);
      }
    } else {
      setErrorMsg(res.error || "Failed to create account");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await verifyOtp(email, otp);
    setLoading(false);

    if (res.success) {
      setSuccessMsg("Email verified! Welcome to SYRUS.");
      setTimeout(() => onClose(), 1000);
    } else {
      setErrorMsg(res.error || "Invalid verification code");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#121212] border border-[#262626] rounded-none shadow-2xl p-8 sm:p-10 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#888] hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-8">
          <span className="font-serif text-2xl tracking-[0.3em] font-light text-white block">
            SYRUS
          </span>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#888] mt-2">
            {mode === "signin"
              ? "Access Your Private Atelier"
              : mode === "signup"
              ? "Create Private Client Account"
              : "Security Code Verification"}
          </p>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="mb-6 p-3 bg-red-950/40 border border-red-800/60 text-red-200 text-xs tracking-wide">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-3 bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 text-xs tracking-wide">
            {successMsg}
          </div>
        )}

        {/* Mode Switcher Tabs */}
        {mode !== "verify" && (
          <div className="flex border-b border-[#242424] mb-8">
            <button
              onClick={() => {
                setMode("signin");
                setErrorMsg(null);
              }}
              className={`flex-1 pb-3 text-xs uppercase tracking-[0.2em] font-medium transition-colors relative ${
                mode === "signin" ? "text-white" : "text-[#777] hover:text-[#BBB]"
              }`}
            >
              Sign In
              {mode === "signin" && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />}
            </button>
            <button
              onClick={() => {
                setMode("signup");
                setErrorMsg(null);
              }}
              className={`flex-1 pb-3 text-xs uppercase tracking-[0.2em] font-medium transition-colors relative ${
                mode === "signup" ? "text-white" : "text-[#777] hover:text-[#BBB]"
              }`}
            >
              Register
              {mode === "signup" && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />}
            </button>
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-[#666]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-[#1A1A1A] border border-[#2E2E2E] pl-10 pr-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-[#666]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1A1A1A] border border-[#2E2E2E] pl-10 pr-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-3.5 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#EAEAEA] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <span>Sign In</span>}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3.5 text-[#666]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Julian Vance"
                  className="w-full bg-[#1A1A1A] border border-[#2E2E2E] pl-10 pr-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-[#666]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-[#1A1A1A] border border-[#2E2E2E] pl-10 pr-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] mb-1.5">
                Password (min 6 characters)
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-[#666]" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1A1A1A] border border-[#2E2E2E] pl-10 pr-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-3.5 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#EAEAEA] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <span>Create Account</span>}
            </button>
          </form>
        )}

        {/* VERIFY CODE FORM */}
        {mode === "verify" && (
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#888] mb-1.5">
                6-Digit Security Code
              </label>
              <div className="relative">
                <ShieldCheck size={16} className="absolute left-3.5 top-3.5 text-[#666]" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-[#1A1A1A] border border-[#2E2E2E] pl-10 pr-4 py-3 text-center tracking-[0.5em] text-lg font-mono text-white placeholder-[#555] focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-3.5 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#EAEAEA] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <span>Confirm Code</span>}
            </button>

            <button
              type="button"
              onClick={() => setMode("signin")}
              className="w-full text-center text-xs text-[#888] hover:text-white pt-2 flex items-center justify-center space-x-1"
            >
              <span>Back to sign in</span>
              <ArrowRight size={12} />
            </button>
          </form>
        )}

        {/* OAUTH PROVIDERS */}
        {mode !== "verify" && (
          <div className="mt-8 pt-6 border-t border-[#222]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#666] text-center mb-4">
              Or Authenticate with
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => signInWithOAuth("google")}
                className="py-2.5 px-4 bg-[#181818] border border-[#2B2B2B] hover:border-[#444] text-xs font-medium text-[#D0D0D0] hover:text-white flex items-center justify-center space-x-2 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => signInWithOAuth("github")}
                className="py-2.5 px-4 bg-[#181818] border border-[#2B2B2B] hover:border-[#444] text-xs font-medium text-[#D0D0D0] hover:text-white flex items-center justify-center space-x-2 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


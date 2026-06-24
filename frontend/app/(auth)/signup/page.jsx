"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Wallet, KeyRound, User, Mail, Lock, CheckCircle2, AlertCircle, X, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    otp: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        router.push("/dashboard");
      } else {
        setTimeout(() => {
          setPageLoading(false);
        }, 500);
      }
    }
  }, [router]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(data.message || "OTP sent successfully!", "success");
        setStep(2);
      } else {
        showToast(data.message || "Signup failed", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          otp: form.otp,
          purpose: "signup"
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Account verified successfully! Redirecting...", "success");
        setTimeout(() => {
          router.push("/login");
        }, 1200);
      } else {
        showToast(data.message || "Invalid OTP", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Verification failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F9F9]/40 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 selection:bg-[#0D9488]/10 selection:text-[#0D9488]">
      
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-4 right-4 sm:left-auto sm:right-5 z-50 flex items-center justify-between gap-3 max-w-sm w-auto bg-white border rounded-xl p-3.5 shadow-xl"
            style={{ borderColor: toast.type === 'success' ? '#10B981/20' : '#EF4444/20' }}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0" />
              )}
              <p className="text-[11px] font-extrabold text-slate-800 tracking-wide uppercase">{toast.message}</p>
            </div>
            <button 
              onClick={() => setToast({ show: false, message: '', type: 'success' })}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2.5 text-[#0D9488] font-black text-xl sm:text-2xl tracking-wider uppercase">
            <div className="bg-white p-2.5 rounded-xl border border-[#CCE6E6]/60 shadow-[0_4px_16px_-4px_rgba(13,148,136,0.08)]">
              <Wallet className="w-6 h-6 sm:w-7 h-7" />
            </div>
            <span>FinTrack</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight uppercase text-center pt-2 min-h-[32px]">
            {!pageLoading && (step === 1 ? "Create your account" : "Verify your Email")}
          </h2>
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase min-h-[16px]">
            {!pageLoading && (step === 1 ? "Get started by building your premium profile" : `We sent a 6-digit code to ${form.email}`)}
          </p>
        </div>

        <div className="bg-white py-6 px-4 sm:p-8 border border-[#CCE6E6]/40 rounded-2xl shadow-[0_8px_30px_-4px_rgba(13,148,136,0.03)] mx-auto w-full min-h-[340px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {pageLoading ? (
              <motion.div
                key="signup-skeleton"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="space-y-5 animate-pulse w-full"
              >
                <div className="space-y-2">
                  <div className="h-3 bg-teal-900/10 rounded w-1/4" />
                  <div className="h-11 bg-teal-900/5 rounded-xl border border-[#CCE6E6]/30" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-teal-900/10 rounded w-1/4" />
                  <div className="h-11 bg-teal-900/5 rounded-xl border border-[#CCE6E6]/30" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-teal-900/10 rounded w-1/4" />
                  <div className="h-11 bg-teal-900/5 rounded-xl border border-[#CCE6E6]/30" />
                </div>
                <div className="h-12 bg-teal-900/10 rounded-xl mt-2" />
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.form 
                    key="signup-step"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-4 sm:space-y-5 w-full" 
                    onSubmit={handleSignupSubmit}
                  >
                    <div className="w-full">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Username</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                          <User className="w-4 h-4" />
                        </span>
                        <input
                          name="username"
                          value={form.username}
                          onChange={handleChange}
                          className="pl-10 w-full rounded-xl border border-[#CCE6E6]/60 p-3 bg-[#F4F9F9]/30 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#0D9488]/5 focus:border-[#0D9488] text-xs sm:text-sm font-bold transition-all"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>

                    <div className="w-full">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          className="pl-10 w-full rounded-xl border border-[#CCE6E6]/60 p-3 bg-[#F4F9F9]/30 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#0D9488]/5 focus:border-[#0D9488] text-xs sm:text-sm font-bold transition-all"
                          placeholder="john@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="w-full">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input
                          name="password"
                          type="password"
                          value={form.password}
                          onChange={handleChange}
                          className="pl-10 w-full rounded-xl border border-[#CCE6E6]/60 p-3 bg-[#F4F9F9]/30 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#0D9488]/5 focus:border-[#0D9488] text-xs sm:text-sm font-bold transition-all"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 bg-[#0D9488] hover:bg-[#0F766E] text-white font-extrabold p-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-teal-600/10 hover:shadow-teal-600/20 disabled:opacity-50 tracking-wider uppercase"
                      >
                        {loading ? "Creating..." : "Create Account"}
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.form 
                    key="otp-step"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-4 sm:space-y-5 w-full" 
                    onSubmit={handleVerifyOTP}
                  >
                    <div className="w-full">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Enter 6-digit OTP</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                          <KeyRound className="w-4 h-4" />
                        </span>
                        <input
                          name="otp"
                          value={form.otp}
                          onChange={handleChange}
                          maxLength={6}
                          className="pl-10 w-full tracking-[0.2em] text-center rounded-xl border border-[#CCE6E6]/60 p-3 bg-[#F4F9F9]/30 text-slate-900 placeholder:text-slate-400 placeholder:tracking-normal focus:outline-none focus:ring-4 focus:ring-[#0D9488]/5 focus:border-[#0D9488] text-sm sm:text-base font-black transition-all"
                          placeholder="123456"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-2 space-y-2.5">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-extrabold p-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20 disabled:opacity-50 tracking-wider uppercase"
                      >
                        {loading ? "Verifying..." : "Verify Code"}
                        <CheckCircle2 className="w-4 h-4" />
                      </motion.button>

                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-full flex justify-center items-center gap-1.5 text-slate-400 hover:text-slate-600 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors pt-1 focus:outline-none"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Change Details
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            )}
          </AnimatePresence>

          <div className="mt-6 text-center text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider border-t border-[#CCE6E6]/20 pt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-[#0D9488] font-extrabold hover:underline transition-all focus:outline-none pl-1"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
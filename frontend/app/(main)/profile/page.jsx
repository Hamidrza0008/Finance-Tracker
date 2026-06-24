"use client"

import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, LogOut, CheckCircle, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch('http://localhost:5000/api/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok) {
          setUserData(data.user);
        } else {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="w-full min-h-screen bg-[#F4F9F9]/40 flex items-center justify-center p-4 sm:p-6 md:p-8 selection:bg-[#0D9488]/10 selection:text-[#0D9488]">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="profile-skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="w-full max-w-4xl bg-white border border-[#CCE6E6]/40 rounded-2xl shadow-[0_4px_24px_-2px_rgba(13,148,136,0.03)] overflow-hidden grid grid-cols-1 md:grid-cols-3 animate-pulse"
          >
            <div className="bg-[#F4F9F9]/40 p-6 sm:p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-[#CCE6E6]/30 space-y-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-teal-900/10 rounded-full" />
              <div className="h-6 bg-teal-900/10 rounded-lg w-3/4 mx-auto" />
              <div className="h-4 bg-teal-900/10 rounded-md w-1/2 mx-auto" />
              <div className="h-6 bg-teal-900/10 rounded-full w-2/3 mx-auto pt-2" />
            </div>

            <div className="p-6 sm:p-8 md:col-span-2 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="h-4 bg-teal-900/10 rounded-md w-1/4 mb-2" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="h-20 bg-teal-900/5 rounded-xl border border-[#CCE6E6]/20" />
                  <div className="h-20 bg-teal-900/5 rounded-xl border border-[#CCE6E6]/20" />
                  <div className="h-20 bg-teal-900/5 rounded-xl border border-[#CCE6E6]/20 sm:col-span-2" />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-[#CCE6E6]/20">
                <div className="h-10 bg-teal-900/10 rounded-xl w-full sm:w-36" />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="profile-content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl"
          >
            <div className="bg-white border border-[#CCE6E6]/40 rounded-2xl shadow-[0_4px_24px_-2px_rgba(13,148,136,0.03)] overflow-hidden grid grid-cols-1 md:grid-cols-3 transition-all duration-300 hover:shadow-[0_8px_32px_-2px_rgba(13,148,136,0.05)]">
              
              <div className="bg-[#F4F9F9]/40 p-6 sm:p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-[#CCE6E6]/30">
                <div className="relative group mb-4">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#0D9488] to-[#34D399] rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="relative bg-gradient-to-tr from-[#0D9488] via-[#14B8A6] to-[#34D399] p-5 rounded-full text-white shadow-md shadow-teal-600/10"
                  >
                    <User className="w-12 h-12 md:w-16 md:h-16" />
                  </motion.div>
                  <span className="absolute bottom-1 right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-[#10B981] border-2 border-white"></span>
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight capitalize">
                  {userData?.username || 'User'}
                </h3>
                <p className="text-xs font-bold text-[#0D9488] tracking-wide uppercase mt-1">Full-Stack Developer</p>

                <motion.span
                  whileHover={{ scale: 1.03 }}
                  className="inline-flex items-center gap-1.5 text-[10px] bg-[#E6F4EA] text-[#10B981] px-3 py-1 rounded-full font-extrabold uppercase mt-4 tracking-wider border border-[#10B981]/10 shadow-sm"
                >
                  <CheckCircle className="w-3 h-3" /> Premium Member
                </motion.span>
              </div>

              <div className="p-6 sm:p-8 md:col-span-2 flex flex-col justify-between space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-5">Account Settings</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

                    <div className="flex items-start gap-3.5 bg-[#F4F9F9]/20 p-4 rounded-xl border border-[#CCE6E6]/40 hover:border-[#0D9488]/30 transition-all duration-300 hover:bg-[#F4F9F9]/40 group">
                      <div className="bg-white p-2.5 rounded-xl border border-[#CCE6E6]/40 text-slate-500 shadow-sm transition-transform duration-300 group-hover:scale-105">
                        <Mail className="w-4 h-4 text-[#0D9488]" />
                      </div>
                      <div className="text-sm min-w-0 w-full">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</p>
                        <p className="text-slate-800 font-bold mt-0.5 break-all tracking-tight">
                          {userData?.email || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 bg-[#F4F9F9]/20 p-4 rounded-xl border border-[#CCE6E6]/40 hover:border-[#0D9488]/30 transition-all duration-300 hover:bg-[#F4F9F9]/40 group">
                      <div className="bg-white p-2.5 rounded-xl border border-[#CCE6E6]/40 text-slate-500 shadow-sm transition-transform duration-300 group-hover:scale-105">
                        <Lock className="w-4 h-4 text-[#14B8A6]" />
                      </div>
                      <div className="text-sm">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Password</p>
                        <p className="text-slate-700 font-mono font-extrabold tracking-widest mt-1">••••••••••••</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 bg-[#F4F9F9]/20 p-4 rounded-xl border border-[#CCE6E6]/40 sm:col-span-2 hover:border-[#0D9488]/30 transition-all duration-300 hover:bg-[#F4F9F9]/40 group">
                      <div className="bg-white p-2.5 rounded-xl border border-[#CCE6E6]/40 text-slate-500 shadow-sm transition-transform duration-300 group-hover:scale-105">
                        <Smartphone className="w-4 h-4 text-[#34D399]" />
                      </div>
                      <div className="text-sm">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Device Status</p>
                        <p className="text-slate-800 font-bold mt-0.5 tracking-tight">Active on current device</p>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="border-t border-[#CCE6E6]/30 pt-6 flex flex-col sm:flex-row items-center gap-3 justify-end">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FCE8E6] hover:bg-[#EF4444] text-[#EF4444] hover:text-white border border-[#EF4444]/10 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout Account
                  </motion.button>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
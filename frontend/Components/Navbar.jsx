"use client"
import React, { useState } from 'react';
import { Menu, X, Wallet, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsOpen(false);
    router.push("/login");
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav className="bg-white/70 backdrop-blur-xl border-b border-[#CCE6E6]/30 sticky top-0 z-50 transition-all duration-300 shadow-[0_2px_20px_-4px_rgba(13,148,136,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center gap-2.5 text-slate-900 font-bold text-xl tracking-tight group">
              <div className="relative overflow-hidden bg-gradient-to-br from-[#0D9488] to-[#34D399] p-2 rounded-xl shadow-md shadow-teal-500/10 group-hover:shadow-teal-500/20 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-teal-950 to-slate-800 font-extrabold tracking-tight group-hover:opacity-90 transition-opacity">
                Finance Tracker
              </span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-1 relative h-full items-center">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link 
                    key={item.path}
                    href={item.path} 
                    className={`relative px-4 py-2 text-sm font-semibold flex items-center gap-2 rounded-xl transition-all duration-300 ${
                      active ? 'text-[#0D9488]' : 'text-slate-500 hover:text-[#0D9488] hover:bg-[#F0F7F7]/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} /> 
                    <span>{item.name}</span>
                    
                    {active && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-gradient-to-r from-[#0D9488] to-[#34D399] rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-3">
            <motion.button 
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/profile")} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                isActive('/profile') 
                  ? 'bg-[#F0F7F7] text-[#0D9488] border-[#CCE6E6]/60 shadow-inner' 
                  : 'text-slate-600 border-transparent hover:text-[#0D9488] hover:bg-[#F0F7F7]/40 hover:border-[#CCE6E6]/20'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </motion.button>
            
            <motion.button 
              whileHover={{ y: -1, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-900 hover:bg-[#EF4444] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm shadow-slate-900/5 hover:shadow-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </motion.button>
          </div>

          <div className="flex items-center md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-[#0D9488] hover:bg-[#F0F7F7]/60 focus:outline-none border border-transparent hover:border-[#CCE6E6]/30 transition-all"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-[#CCE6E6]/40 px-4 pt-2 pb-5 space-y-1 absolute w-full left-0 shadow-xl shadow-[#0D9488]/05 overflow-hidden"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link 
                  key={item.path}
                  href={item.path} 
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    active
                      ? 'bg-[#F0F7F7] text-[#0D9488]'
                      : 'text-slate-600 hover:bg-[#F4F9F9] hover:text-[#0D9488]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            <div className="border-t border-[#CCE6E6]/30 pt-3 mt-3 flex flex-col gap-1">
              <Link 
                href="/profile"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl text-base font-semibold transition-all ${
                  isActive('/profile') ? 'bg-[#F0F7F7] text-[#0D9488]' : 'text-slate-600 hover:bg-[#F4F9F9] hover:text-[#0D9488]'
                }`}
              >
                <User className="w-5 h-5" /> <span>Profile</span>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 text-slate-600 hover:text-[#EF4444] hover:bg-[#FCE8E6]/60 py-3 px-4 rounded-xl text-base font-semibold transition-all text-left w-full"
              >
                <LogOut className="w-5 h-5" /> <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
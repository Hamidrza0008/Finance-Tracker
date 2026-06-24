"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet } from 'lucide-react';
import Navbar from '@/Components/Navbar';
import SummaryCards from '@/Components/SummaryCard';
import TransactionForm from '@/Components/TransactionForm';
import Transactions from '@/Components/Transactions';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-slate-800 selection:bg-teal-100/80 font-sans antialiased">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="dashboard-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
            className="fixed inset-0 bg-[#F4F9F9] z-50 flex flex-col justify-center items-center gap-4 px-4"
          >
            <motion.div 
              animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="bg-white p-4 rounded-2xl border border-[#CCE6E6]/60 shadow-[0_10px_30px_-4px_rgba(13,148,136,0.1)] text-[#0D9488]"
            >
              <Wallet className="w-8 h-8 sm:w-10 h-10" />
            </motion.div>

            <div className="w-full max-w-4xl space-y-4 sm:space-y-6 mt-6 animate-pulse opacity-40 px-4 hidden sm:block">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-24 bg-teal-900/10 rounded-2xl" />
                <div className="h-24 bg-teal-900/10 rounded-2xl" />
                <div className="h-24 bg-teal-900/10 rounded-2xl" />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="h-64 bg-teal-900/10 rounded-2xl col-span-1" />
                <div className="h-64 bg-teal-900/10 rounded-2xl col-span-2" />
              </div>
            </div>

            <p className="text-[10px] sm:text-xs font-extrabold text-[#0D9488] tracking-widest uppercase mt-2">
              Syncing your financial ecosystem...
            </p>
          </motion.div>
        ) : (
          <motion.main
            key="dashboard-content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6"
          >
            <section aria-label="Financial Summary Cards Overview" className="w-full">
              <SummaryCards />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
              <div className="lg:col-span-1 lg:sticky lg:top-6 order-1 lg:order-none">
                <div className="bg-white p-1 rounded-2xl border border-[#CCE6E6]/40 shadow-[0_4px_20px_-2px_rgba(13,148,136,0.03)] transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(13,148,136,0.06)]">
                  <TransactionForm />
                </div>
              </div>

              <div className="lg:col-span-2 order-2 lg:order-none">
                <Transactions />
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
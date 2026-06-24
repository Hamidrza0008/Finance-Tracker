"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="fixed inset-0 bg-[#F4F9F9] z-50 flex flex-col justify-center items-center gap-4 px-4">
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
        Initializing FinTrack Ecosystem...
      </p>
    </div>
  );
}
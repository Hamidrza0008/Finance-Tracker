"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Transactions() {
  useEffect(() => {
    const handler = () => {
      fetchTransactions();
    };

    window.addEventListener("tx-update", handler);

    return () => {
      window.removeEventListener("tx-update", handler);
    };
  }, []);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filterType, setFilterType] = useState("all");
  const [sortKey, setSortKey] = useState("latest");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "5",
        type: filterType !== "all" ? filterType : "",
        sort: sortKey,
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions?${queryParams.toString()}`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        }
      });

      const data = await res.json();

      if (res.ok) {
        setTransactions(data.transactions || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        console.error("Backend Error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, filterType, sortKey]);

  return (
    <div className="bg-white border border-[#CCE6E6]/40 rounded-2xl p-4 sm:p-5 md:p-6 shadow-[0_4px_24px_-2px_rgba(13,148,136,0.02)] space-y-4 sm:space-y-6">

      <div className="flex justify-between items-center border-b border-[#CCE6E6]/30 pb-4">
        <h2 className="text-[11px] sm:text-xs md:text-sm font-extrabold text-slate-900 tracking-wider uppercase">Recent Transactions</h2>
        <button 
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F9F9] text-[#0D9488] border border-[#CCE6E6]/60 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all active:scale-95"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
        </button>
      </div>

      <div className="hidden md:flex flex-wrap gap-3">
        <select 
          className="rounded-xl border border-[#CCE6E6]/60 p-2.5 bg-[#F4F9F9]/30 text-slate-800 focus:outline-none focus:ring-4 focus:ring-[#0D9488]/5 focus:border-[#0D9488] text-xs font-bold transition-all cursor-pointer"
          value={filterType} 
          onChange={(e) => { setPage(1); setFilterType(e.target.value); }}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select 
          className="rounded-xl border border-[#CCE6E6]/60 p-2.5 bg-[#F4F9F9]/30 text-slate-800 focus:outline-none focus:ring-4 focus:ring-[#0D9488]/5 focus:border-[#0D9488] text-xs font-bold transition-all cursor-pointer"
          value={sortKey} 
          onChange={(e) => setSortKey(e.target.value)}
        >
          <option value="latest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="high">Highest Amount</option>
          <option value="low">Lowest Amount</option>
        </select>

        <input
          className="rounded-xl border border-[#CCE6E6]/60 p-2.5 bg-[#F4F9F9]/30 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#0D9488]/5 focus:border-[#0D9488] text-xs font-bold transition-all w-24"
          type="number"
          placeholder="Min"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
        />

        <input
          className="rounded-xl border border-[#CCE6E6]/60 p-2.5 bg-[#F4F9F9]/30 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#0D9488]/5 focus:border-[#0D9488] text-xs font-bold transition-all w-24"
          type="number"
          placeholder="Max"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
        />
      </div>

      <AnimatePresence>
        {showMobileFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden grid grid-cols-2 gap-2.5 pb-2 border-b border-[#CCE6E6]/20 overflow-hidden"
          >
            <select 
              className="w-full rounded-xl border border-[#CCE6E6]/60 p-2.5 bg-[#F4F9F9]/30 text-slate-800 text-xs font-bold"
              value={filterType} 
              onChange={(e) => { setPage(1); setFilterType(e.target.value); }}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select 
              className="w-full rounded-xl border border-[#CCE6E6]/60 p-2.5 bg-[#F4F9F9]/30 text-slate-800 text-xs font-bold"
              value={sortKey} 
              onChange={(e) => setSortKey(e.target.value)}
            >
              <option value="latest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="high">Highest Amount</option>
              <option value="low">Lowest Amount</option>
            </select>

           
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-1.5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <div className="w-5 h-5 border-2 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase text-center py-12">No transactions found</p>
        ) : (
          transactions.map((tx) => (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              key={tx._id}
              className="flex justify-between items-center border-b border-[#CCE6E6]/20 py-3 hover:bg-[#F0F7F7]/40 px-2 sm:px-3 rounded-xl transition-all duration-200 gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`p-2 rounded-full border shrink-0 transition-transform duration-300 group-hover:scale-105 ${tx.type === "income" ? "bg-[#E6F4EA] text-[#10B981] border-[#10B981]/10" : "bg-[#FCE8E6] text-[#EF4444] border-[#EF4444]/10"}`}>
                  {tx.type === "income" ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight truncate">{tx.title}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                    {new Date(tx.date || tx.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className={`text-xs sm:text-sm font-extrabold tracking-tight shrink-0 ${tx.type === "income" ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                {tx.type === "income" ? "+" : "-"} ₹{Number(tx.amount).toLocaleString('en-IN')}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-[#CCE6E6]/30">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-2.5 py-1.5 rounded-xl border border-[#CCE6E6]/60 text-[10px] sm:text-xs font-bold text-slate-600 disabled:opacity-40 flex items-center gap-1 hover:bg-[#F4F9F9] hover:text-[#0D9488] hover:border-[#0D9488]/30 transition-all active:scale-[0.98]"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Prev
        </button>

        <span className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-2.5 py-1.5 rounded-xl border border-[#CCE6E6]/60 text-[10px] sm:text-xs font-bold text-slate-600 disabled:opacity-40 flex items-center gap-1 hover:bg-[#F4F9F9] hover:text-[#0D9488] hover:border-[#0D9488]/30 transition-all active:scale-[0.98]"
        >
          Next <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
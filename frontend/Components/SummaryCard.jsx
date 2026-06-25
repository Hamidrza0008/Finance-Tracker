"use client";

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SummaryCards() {
  useEffect(() => {
    const handler = () => {
      fetchTransactions();
    };

    window.addEventListener("tx-update", handler);

    return () => {
      window.removeEventListener("tx-update", handler);
    };
  }, []);

  const [totals, setTotals] = useState({ balance: 0, income: 0, expense: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data from server');
      }

      const data = await response.json();
      const transactionsArray = data.allTransactions || [];

      let totalIncome = 0;
      let totalExpense = 0;

      transactionsArray.forEach(tx => {
        const amount = Number(tx.amount) || 0;
        if (tx.type === 'income') {
          totalIncome += amount;
        } else if (tx.type === 'expense') {
          totalExpense += amount;
        }
      });

      setTotals({
        balance: totalIncome - totalExpense,
        income: totalIncome,
        expense: totalExpense
      });
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatINR = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-[#E8F4F4]/40 h-28 rounded-2xl border border-[#CCE6E6]/30" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FCE8E6] border border-[#EF4444]/20 rounded-2xl p-4 text-[#EF4444] font-semibold text-xs uppercase tracking-wide">
        ⚠️ Error: {error}
      </div>
    );
  }

  const cardsData = [
    {
      title: 'Total Balance',
      amount: formatINR(totals.balance),
      isPrimary: true,
      bgColor: 'bg-gradient-to-br from-[#0D9488] via-[#14B8A6] to-[#34D399]',
      textColor: 'text-white',
      subTextColor: 'text-teal-100/80',
      iconColor: 'bg-white/10 border-white/20 text-white',
      icon: IndianRupee,
      arrow: <ArrowUpRight className="w-3.5 h-3.5" />
    },
    {
      title: 'Total Income',
      amount: formatINR(totals.income),
      isPrimary: false,
      bgColor: 'bg-white border-[#CCE6E6]/40 shadow-[0_4px_20px_-2px_rgba(13,148,136,0.02)]',
      textColor: 'text-[#10B981]',
      subTextColor: 'text-slate-400',
      iconColor: 'bg-[#E6F4EA] text-[#10B981] border-[#10B981]/10',
      icon: ArrowUpRight,
      arrow: <ArrowUpRight className="w-3.5 h-3.5" />
    },
    {
      title: 'Total Expense',
      amount: formatINR(totals.expense),
      isPrimary: false,
      bgColor: 'bg-white border-[#CCE6E6]/40 shadow-[0_4px_20px_-2px_rgba(13,148,136,0.02)]',
      textColor: 'text-[#EF4444]',
      subTextColor: 'text-slate-400',
      iconColor: 'bg-[#FCE8E6] text-[#EF4444] border-[#EF4444]/10',
      icon: ArrowDownRight,
      arrow: <ArrowDownRight className="w-3.5 h-3.5" />
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cardsData.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div 
            key={i} 
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className={`rounded-2xl border p-4 sm:p-5 transition-all duration-300 ${card.bgColor} ${card.isPrimary ? 'border-transparent shadow-[0_8px_20px_-4px_rgba(13,148,136,0.12)]' : 'hover:shadow-[0_6px_20px_-2px_rgba(13,148,136,0.04)]'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-[10px] font-bold tracking-wider uppercase ${card.isPrimary ? 'text-teal-50/90' : 'text-slate-400'}`}>{card.title}</p>
                <h3 className={`text-2xl sm:text-2xl font-extrabold mt-1 tracking-tight ${card.isPrimary ? 'text-white' : 'text-slate-900'}`}>
                  {card.amount}
                </h3>
              </div>
              <div className={`p-2 rounded-xl border transition-transform duration-300 hover:scale-105 ${card.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold">
              <span className={`flex items-center gap-0.5 rounded-lg px-1.5 py-0.5 ${card.isPrimary ? 'bg-white/10 text-white' : card.textColor}`}>
                {card.arrow}
                12.5%
              </span>
              <span className={`font-semibold ${card.subTextColor}`}>vs last month</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
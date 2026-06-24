"use client"

import { useState } from 'react';
import { PlusCircle, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';

export default function TransactionForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: 'income',
    description: '',
    amount: '',
    date: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempErrors = {};
    if (!formData.description) tempErrors.description = 'Description is required';
    if (!formData.amount || formData.amount <= 0) tempErrors.amount = 'Enter a valid amount';
    if (!formData.date) tempErrors.date = 'Date is required';

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    try {
      setLoading(true);
      
      const token = localStorage.getItem("token"); 
      if (!token) {
        showToast("Session expired! Please login again.", "error");
        return;
      }

      const response = await fetch('http://localhost:5000/api/transactions/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.description, 
          amount: Number(formData.amount),
          type: formData.type,
          date: formData.date,
          category: "General", 
          description: formData.description
        })
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Transaction Added Successfully!', 'success');
        
        setFormData({
          type: 'income',
          description: '',
          amount: '',
          date: ''
        });
        window.dispatchEvent(new Event("tx-update"));
      } else {
        showToast(data.message || 'Something went wrong', 'error');
      }

    } catch (error) {
      console.error("Error creating transaction:", error);
      showToast("Server error, please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
              <p className="text-xs font-bold text-slate-800 tracking-wide uppercase">{toast.message}</p>
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

      <div className="bg-white border border-[#CCE6E6]/40 rounded-2xl p-4 sm:p-5 md:p-6 shadow-[0_4px_24px_-2px_rgba(13,148,136,0.02)] h-full flex flex-col">
        <h2 className="text-[11px] sm:text-xs md:text-sm font-extrabold text-slate-900 mb-4 sm:mb-5 tracking-wider uppercase">Add New Transaction</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 flex-1 flex flex-col">
          <div className="flex flex-col gap-3.5 sm:gap-4 flex-1">
            
            <div className="w-full">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Transaction Type</label>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#CCE6E6]/60 p-3 bg-[#F4F9F9]/30 text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#0D9488]/5 focus:border-[#0D9488] text-xs sm:text-sm font-bold transition-all appearance-none cursor-pointer"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div className="w-full">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
              <input
                type="text"
                name="description"
                placeholder="e.g., Grocery Shopping"
                value={formData.description}
                onChange={handleChange}
                className={`w-full rounded-xl border p-3 bg-[#F4F9F9]/30 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 text-xs sm:text-sm font-bold transition-all ${
                  errors.description 
                    ? 'border-[#EF4444]/40 focus:ring-[#EF4444]/5 focus:border-[#EF4444]' 
                    : 'border-[#CCE6E6]/60 focus:ring-[#0D9488]/5 focus:border-[#0D9488]'
                }`}
              />
              {errors.description && <p className="text-[10px] text-[#EF4444] mt-1.5 font-bold uppercase tracking-wide">{errors.description}</p>}
            </div>

            <div className="w-full">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Amount (₹)</label>
              <input
                type="number"
                name="amount"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                className={`w-full rounded-xl border p-3 bg-[#F4F9F9]/30 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 text-xs sm:text-sm font-bold transition-all ${
                  errors.amount 
                    ? 'border-[#EF4444]/40 focus:ring-[#EF4444]/5 focus:border-[#EF4444]' 
                    : 'border-[#CCE6E6]/60 focus:ring-[#0D9488]/5 focus:border-[#0D9488]'
                }`}
              />
              {errors.amount && <p className="text-[10px] text-[#EF4444] mt-1.5 font-bold uppercase tracking-wide">{errors.amount}</p>}
            </div>

            <div className="w-full">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full rounded-xl border p-3 bg-[#F4F9F9]/30 text-slate-900 focus:outline-none focus:ring-4 text-xs sm:text-sm font-bold transition-all ${
                  errors.date 
                    ? 'border-[#EF4444]/40 focus:ring-[#EF4444]/5 focus:border-[#EF4444]' 
                    : 'border-[#CCE6E6]/60 focus:ring-[#0D9488]/5 focus:border-[#0D9488]'
                }`}
              />
              {errors.date && <p className="text-[10px] text-[#EF4444] mt-1.5 font-bold uppercase tracking-wide">{errors.date}</p>}
            </div>

          </div>

          <div className="pt-3 sm:pt-4 mt-auto">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#0D9488] hover:bg-[#0F766E] text-white font-extrabold text-xs sm:text-sm p-3.5 rounded-xl transition-all shadow-md shadow-teal-600/10 hover:shadow-teal-600/20 disabled:opacity-50 tracking-wider uppercase"
            >
              <PlusCircle className="w-4 h-4" />
              {loading ? 'Adding...' : 'Add Transaction'}
            </motion.button>
          </div>
        </form>
      </div>
    </>
  );
}
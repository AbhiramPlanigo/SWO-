import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChristLogo } from './ChristLogo';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Sparkles,
  GraduationCap,
  Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChristLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  actionReason?: string;
}

export const ChristLoginModal: React.FC<ChristLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  actionReason = 'Sign in with your official Christ University account to register for events, claim seat passes, and access verified digital certificates.'
}) => {
  const { loginStudent } = useApp();
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickLogin = (presetEmail: string, presetName: string, presetReg: string, presetDept: string) => {
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      const res = loginStudent(presetEmail, presetName, presetReg, presetDept);
      setIsLoading(false);
      if (res.success) {
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setError(res.error || 'Authentication failed');
      }
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please enter your institutional email address.');
      return;
    }

    if (!cleanEmail.endsWith('@christuniversity.in')) {
      setError('Access Restricted: Institutional login is strictly limited to the @christuniversity.in domain. Please use your official university email.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = loginStudent(
        cleanEmail, 
        name.trim() || undefined, 
        regNo.trim() || undefined, 
        department
      );
      setIsLoading(false);
      if (res.success) {
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setError(res.error || 'Authentication failed.');
      }
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#16212F]/60 backdrop-blur-md">
        {/* Backdrop dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-[28px] sm:rounded-[32px] shadow-[0_24px_64px_rgba(22,33,47,0.25)] border border-[#E2E8F0] overflow-hidden z-10"
        >
          {/* Header Banner */}
          <div className="relative bg-[#16212F] p-6 sm:p-7 text-white overflow-hidden">
            {/* Background Crest Accent */}
            <div className="absolute right-[-20px] top-[-20px] opacity-10 pointer-events-none select-none">
              <span className="text-[120px] font-serif font-black">SWO</span>
            </div>

            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <ChristLogo size="md" showText={false} />
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#C5A063]/25 border border-[#C5A063]/40 text-[#E6C98F] text-[10px] font-bold tracking-widest uppercase">
                  CHRIST INSTITUTIONAL SSO
                </span>
                <p className="text-xs text-slate-300 font-medium">Bangalore Yeshwanthpur Campus</p>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Student Institutional Sign In
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {actionReason}
            </p>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-7 space-y-5">
            {/* Error Banner */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-start gap-2.5 text-rose-800 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">
                  {error}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#16212F] mb-1.5 uppercase tracking-wider">
                  Christ University Email ID <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C9AA9]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="your.name@christuniversity.in"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#3A5982] focus:ring-2 focus:ring-[#3A5982]/15 text-xs text-[#16212F] placeholder:text-[#8C9AA9] transition-all"
                  />
                </div>
                <p className="text-[11px] text-[#8C9AA9] mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#3A5982]" />
                  Must terminate with <span className="font-semibold text-[#16212F]">@christuniversity.in</span>
                </p>
              </div>

              {/* Optional Name & Reg No */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#536275] mb-1">
                    Student Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ananya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs text-[#16212F] focus:outline-none focus:border-[#3A5982]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#536275] mb-1">
                    Registration No. (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2447101"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs text-[#16212F] focus:outline-none focus:border-[#3A5982]"
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-[11px] font-bold text-[#536275] mb-1">
                  Department / School
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs text-[#16212F] bg-white focus:outline-none focus:border-[#3A5982]"
                >
                  <option value="Computer Science & Engineering">School of Engineering & Tech (CSE/AI)</option>
                  <option value="School of Business and Management">School of Business and Management (MBA/BBA)</option>
                  <option value="School of Commerce, Finance and Accountancy">School of Commerce & Finance</option>
                  <option value="School of Sciences">School of Sciences (Psychology/Data)</option>
                  <option value="School of Social Sciences">School of Social Sciences & Humanities</option>
                  <option value="School of Law">School of Law</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#3A5982] hover:bg-[#2D476C] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Authenticate with Christ University ID</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Test Presets */}
            <div className="pt-3 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[#8C9AA9] uppercase tracking-wider">
                  Quick Demo Institutional Sign-In:
                </span>
                <span className="text-[10px] text-[#3A5982] font-semibold">1-Click Test</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin(
                    'aarav.sharma@btech.christuniversity.in',
                    'Aarav Sharma',
                    '2447101',
                    'Computer Science & Engineering'
                  )}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-[#E2E8F0] text-left transition-all group"
                >
                  <p className="text-xs font-bold text-[#16212F] group-hover:text-[#3A5982]">
                    Aarav Sharma (B.Tech)
                  </p>
                  <p className="text-[10px] text-[#8C9AA9] truncate">
                    aarav.sharma@btech.christuniversity.in
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin(
                    'ananya.sen@christuniversity.in',
                    'Ananya Sen',
                    '2324108',
                    'School of Business and Management'
                  )}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-[#E2E8F0] text-left transition-all group"
                >
                  <p className="text-xs font-bold text-[#16212F] group-hover:text-[#3A5982]">
                    Ananya Sen (MBA)
                  </p>
                  <p className="text-[10px] text-[#8C9AA9] truncate">
                    ananya.sen@christuniversity.in
                  </p>
                </button>
              </div>
            </div>

            {/* Privacy notice */}
            <div className="text-[10px] text-[#8C9AA9] text-center leading-relaxed">
              Protected by Christ University Single Sign-On Security. Only verified students and faculty of Yeshwanthpur Campus are authorized to register for official SWO activities.
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

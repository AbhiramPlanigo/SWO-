import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, GraduationCap, ChevronDown, Check, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const RoleSwitcher: React.FC = () => {
  const { currentRole, switchRole, studentUser, adminUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3A5982] hover:bg-[#2D476C] transition-all text-xs font-semibold text-white shadow-sm"
      >
        <div className={`w-2 h-2 rounded-full ${currentRole === 'student' ? 'bg-[#C5A063]' : 'bg-emerald-400'} ring-2 ring-white/30`} />
        <span className="font-medium tracking-tight">
          {currentRole === 'student' ? 'Student Portal' : 'Admin Portal'}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-white/80" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white/95 dark:bg-[#141A26]/95 backdrop-blur-xl border border-[#E2E8F0] dark:border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.3)] p-2 z-50 text-[#16212F] dark:text-white"
            >
              <div className="px-3 py-2 border-b border-[#E2E8F0] dark:border-white/10 mb-1">
                <p className="text-[10px] font-bold text-[#8C9AA9] dark:text-slate-400 uppercase tracking-wider">
                  Role-Based Portal Access
                </p>
                <p className="text-xs text-[#16212F] dark:text-white font-semibold mt-0.5">
                  Christ University SWO • Yeshwanthpur
                </p>
              </div>

              {/* Student Option */}
              <button
                onClick={() => {
                  switchRole('student');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                  currentRole === 'student'
                    ? 'bg-[#3A5982]/10 dark:bg-white/10 text-[#3A5982] dark:text-blue-300 font-semibold'
                    : 'hover:bg-slate-100 dark:hover:bg-white/5 text-[#16212F] dark:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#3A5982]/15 text-[#3A5982] dark:text-blue-300 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold leading-tight text-[#16212F] dark:text-white">{studentUser.name}</p>
                    <p className="text-[11px] text-[#536275] dark:text-slate-300 leading-tight mt-0.5">
                      Student • Reg: {studentUser.regNo}
                    </p>
                  </div>
                </div>
                {currentRole === 'student' && <Check className="w-4 h-4 text-[#3A5982] dark:text-blue-300" />}
              </button>

              {/* Admin Option */}
              <button
                onClick={() => {
                  switchRole('admin');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all mt-1 ${
                  currentRole === 'admin'
                    ? 'bg-[#C5A063]/15 dark:bg-[#C5A063]/20 text-[#9D7A3E] dark:text-[#E2C78A] font-semibold'
                    : 'hover:bg-slate-100 dark:hover:bg-white/5 text-[#16212F] dark:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#C5A063]/20 text-[#9D7A3E] dark:text-[#E2C78A] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold leading-tight text-[#16212F] dark:text-white">{adminUser.name}</p>
                    <p className="text-[11px] text-[#536275] dark:text-slate-300 leading-tight mt-0.5">
                      SWO Admin • Staff Portal
                    </p>
                  </div>
                </div>
                {currentRole === 'admin' && <Check className="w-4 h-4 text-[#9D7A3E] dark:text-[#E2C78A]" />}
              </button>

              <div className="mt-2 pt-2 border-t border-[#E2E8F0] dark:border-white/10 px-2 py-1 flex items-center justify-between text-[10px] text-[#8C9AA9] dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-[#3A5982] dark:text-blue-300" /> Yeshwanthpur Campus
                </span>
                <span className="text-[#C5A063] font-medium">Active Session</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { AppleButton } from './AppleButton';
import { Sparkles, Calendar } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-black/[0.08] bg-black/[0.015] ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-black/[0.06] flex items-center justify-center text-[#0071E3] mb-4">
        {icon || <Sparkles className="w-7 h-7" />}
      </div>
      <h4 className="text-base sm:text-lg font-semibold text-[#1D1D1F] tracking-tight">{title}</h4>
      <p className="text-sm text-[#86868B] max-w-md mt-1 mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <AppleButton variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </AppleButton>
      )}
    </div>
  );
};

// High-energy, intentionally designed Apple-style fallback hero banner
export const HeroBannerEmptyState: React.FC<{ onExploreClick?: () => void }> = ({ onExploreClick }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#002147] via-[#0A2540] to-[#00142A] text-white p-8 sm:p-14 lg:p-16 shadow-[0_20px_50px_rgba(0,33,71,0.25)] border border-white/10 min-h-[360px] sm:min-h-[420px] flex items-center">
      {/* Dynamic Animated Ambient Shapes & Gradient Shift */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.55, 0.35],
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#0071E3] to-[#C59B27] blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.25, 0.45, 0.25],
          x: [0, -25, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#0071E3]/40 blur-3xl pointer-events-none"
      />

      {/* Subtle grid accent overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D4AF37] text-xs font-semibold tracking-wide uppercase mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FFD60A]" />
          <span>Student Welfare Office • Yeshwanthpur Campus</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] text-white"
        >
          Talk Series <br />
          <span className="bg-gradient-to-r from-[#82B1FF] via-[#FFD54F] to-[#FFFFFF] bg-clip-text text-transparent">
            Coming Soon ✨
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed max-w-xl font-normal"
        >
          We are preparing an inspiring lineup of global diplomats, innovators, cultural stalwarts, and leadership dialogues for this semester. Stay tuned as new event registrations open weekly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center gap-3.5"
        >
          {onExploreClick && (
            <AppleButton
              variant="gold"
              size="md"
              icon={<Calendar className="w-4 h-4 text-white" />}
              onClick={onExploreClick}
            >
              Browse Event Calendar
            </AppleButton>
          )}
          <span className="text-xs text-white/60 font-medium px-2 py-1 bg-white/5 rounded-full border border-white/10">
            Next Release: Friday, 10:00 AM IST
          </span>
        </motion.div>
      </div>

      {/* Decorative Floating Emblem Graphic */}
      <div className="hidden lg:flex absolute right-12 bottom-10 z-10 flex-col items-center justify-center p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 text-center max-w-[220px]">
        <div className="w-14 h-14 rounded-full bg-white p-1 flex items-center justify-center mb-2 shadow-lg ring-2 ring-[#C5A063]/50">
          <img
            src="/christ-university-crest.png"
            alt="CHRIST (Deemed to be University) Official Crest"
            className="w-full h-full object-contain select-none"
          />
        </div>
        <p className="text-xs font-semibold text-white tracking-wide uppercase">Excellence & Service</p>
        <p className="text-[10px] text-white/60 mt-1">Student Welfare Office • Yeshwanthpur</p>
      </div>
    </div>
  );
};

import React from 'react';

interface AppleSkeletonProps {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full' | 'none';
  width?: string;
  height?: string;
  animate?: boolean;
}

export const AppleSkeleton: React.FC<AppleSkeletonProps> = ({
  className = '',
  rounded = 'xl',
  width,
  height,
  animate = true,
}) => {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-[24px]',
    full: 'rounded-full',
  };

  return (
    <div
      className={`
        ${animate ? 'apple-skeleton-shimmer' : 'bg-slate-200/80 dark:bg-white/10'}
        ${roundedClasses[rounded]}
        border border-slate-200/40 dark:border-white/5
        ${className}
      `}
      style={{
        width: width,
        height: height,
      }}
    />
  );
};

/* =========================================================================
   Apple-Style Stat Metric Tile Skeleton
   ========================================================================= */
export const AppleSkeletonStat: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#16212F]/80 border border-[#E2E8F0] dark:border-white/10 shadow-xs space-y-3 ${className}`}>
    <div className="flex items-center justify-between">
      <AppleSkeleton width="45%" height="14px" rounded="full" />
      <AppleSkeleton width="28px" height="28px" rounded="lg" />
    </div>
    <AppleSkeleton width="60%" height="28px" rounded="lg" />
    <AppleSkeleton width="80%" height="12px" rounded="full" />
  </div>
);

/* =========================================================================
   Apple-Style Event Card Skeleton (Grid layout)
   ========================================================================= */
export const AppleSkeletonEventCard: React.FC = () => (
  <div className="rounded-2xl sm:rounded-[24px] bg-white/90 dark:bg-[#16212F]/90 border border-[#E2E8F0] dark:border-white/10 overflow-hidden shadow-xs flex flex-col">
    {/* Image Poster Area */}
    <div className="relative h-44 sm:h-48 w-full">
      <AppleSkeleton width="100%" height="100%" rounded="none" />
      <div className="absolute top-3 left-3">
        <AppleSkeleton width="80px" height="22px" rounded="full" />
      </div>
      <div className="absolute top-3 right-3">
        <AppleSkeleton width="65px" height="22px" rounded="full" />
      </div>
    </div>

    {/* Content Area */}
    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
      <div className="space-y-2.5">
        <AppleSkeleton width="35%" height="12px" rounded="full" />
        <AppleSkeleton width="90%" height="20px" rounded="md" />
        <AppleSkeleton width="70%" height="16px" rounded="md" />
        
        {/* Metadata lines */}
        <div className="pt-2 space-y-1.5">
          <div className="flex items-center gap-2">
            <AppleSkeleton width="14px" height="14px" rounded="full" />
            <AppleSkeleton width="55%" height="12px" rounded="full" />
          </div>
          <div className="flex items-center gap-2">
            <AppleSkeleton width="14px" height="14px" rounded="full" />
            <AppleSkeleton width="45%" height="12px" rounded="full" />
          </div>
        </div>
      </div>

      {/* Button & Speaker footer */}
      <div className="pt-4 border-t border-[#E2E8F0] dark:border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AppleSkeleton width="28px" height="28px" rounded="full" />
          <AppleSkeleton width="70px" height="12px" rounded="full" />
        </div>
        <AppleSkeleton width="85px" height="32px" rounded="full" />
      </div>
    </div>
  </div>
);

/* =========================================================================
   Apple-Style Table Skeleton (for Attendee Roster, Registrations, Ledgers)
   ========================================================================= */
export const AppleSkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
}) => (
  <div className="w-full rounded-2xl bg-white/90 dark:bg-[#16212F]/90 border border-[#E2E8F0] dark:border-white/10 overflow-hidden shadow-xs">
    {/* Table Header Skeleton */}
    <div className="px-5 py-3.5 bg-slate-50/80 dark:bg-white/[0.03] border-b border-[#E2E8F0] dark:border-white/10 flex items-center justify-between gap-4">
      <AppleSkeleton width="20%" height="14px" rounded="full" />
      <AppleSkeleton width="15%" height="14px" rounded="full" />
      <AppleSkeleton width="18%" height="14px" rounded="full" />
      <AppleSkeleton width="12%" height="14px" rounded="full" />
      <AppleSkeleton width="10%" height="14px" rounded="full" />
    </div>

    {/* Table Rows */}
    <div className="divide-y divide-[#E2E8F0]/70 dark:divide-white/5">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-1/4">
            <AppleSkeleton width="34px" height="34px" rounded="full" className="shrink-0" />
            <div className="space-y-1.5 w-full">
              <AppleSkeleton width="80%" height="14px" rounded="md" />
              <AppleSkeleton width="50%" height="10px" rounded="full" />
            </div>
          </div>
          <AppleSkeleton width="14%" height="14px" rounded="full" />
          <AppleSkeleton width="16%" height="14px" rounded="full" />
          <AppleSkeleton width="12%" height="22px" rounded="full" />
          <AppleSkeleton width="80px" height="28px" rounded="full" />
        </div>
      ))}
    </div>
  </div>
);

/* =========================================================================
   Apple-Style Announcement / Circular Notice Skeleton
   ========================================================================= */
export const AppleSkeletonAnnouncement: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, idx) => (
      <div
        key={idx}
        className="p-5 sm:p-6 rounded-2xl bg-white/90 dark:bg-[#16212F]/90 border border-[#E2E8F0] dark:border-white/10 shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AppleSkeleton width="80px" height="20px" rounded="full" />
            <AppleSkeleton width="100px" height="12px" rounded="full" />
          </div>
          <AppleSkeleton width="20px" height="20px" rounded="full" />
        </div>
        <AppleSkeleton width="65%" height="20px" rounded="md" />
        <div className="space-y-1.5">
          <AppleSkeleton width="100%" height="12px" rounded="full" />
          <AppleSkeleton width="85%" height="12px" rounded="full" />
        </div>
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AppleSkeleton width="24px" height="24px" rounded="full" />
            <AppleSkeleton width="90px" height="12px" rounded="full" />
          </div>
          <AppleSkeleton width="70px" height="20px" rounded="full" />
        </div>
      </div>
    ))}
  </div>
);

/* =========================================================================
   Apple-Style Certificate Card Skeleton
   ========================================================================= */
export const AppleSkeletonCertificate: React.FC = () => (
  <div className="rounded-2xl bg-white/90 dark:bg-[#16212F]/90 border border-[#E2E8F0] dark:border-white/10 p-5 space-y-4 shadow-xs">
    <div className="flex items-center justify-between">
      <AppleSkeleton width="90px" height="22px" rounded="full" />
      <AppleSkeleton width="28px" height="28px" rounded="full" />
    </div>
    <div className="space-y-2">
      <AppleSkeleton width="85%" height="18px" rounded="md" />
      <AppleSkeleton width="50%" height="12px" rounded="full" />
    </div>
    <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-[#E2E8F0]/80 dark:border-white/5 space-y-1.5">
      <AppleSkeleton width="40%" height="10px" rounded="full" />
      <AppleSkeleton width="75%" height="12px" rounded="full" />
    </div>
    <div className="flex items-center justify-between pt-2">
      <AppleSkeleton width="80px" height="12px" rounded="full" />
      <AppleSkeleton width="100px" height="32px" rounded="full" />
    </div>
  </div>
);

/* =========================================================================
   Apple-Style Hero / Banner Skeleton
   ========================================================================= */
export const AppleSkeletonHero: React.FC = () => (
  <div className="relative rounded-[28px] lg:rounded-[36px] bg-slate-100 dark:bg-[#141A26] border border-[#E2E8F0] dark:border-white/10 p-6 sm:p-10 overflow-hidden shadow-md">
    <div className="space-y-4 max-w-2xl">
      <AppleSkeleton width="140px" height="24px" rounded="full" />
      <AppleSkeleton width="90%" height="42px" rounded="xl" />
      <AppleSkeleton width="70%" height="32px" rounded="xl" />
      <div className="space-y-2 pt-2">
        <AppleSkeleton width="95%" height="14px" rounded="full" />
        <AppleSkeleton width="80%" height="14px" rounded="full" />
      </div>
      <div className="pt-4 flex flex-wrap gap-3">
        <AppleSkeleton width="130px" height="42px" rounded="full" />
        <AppleSkeleton width="110px" height="42px" rounded="full" />
      </div>
    </div>
  </div>
);

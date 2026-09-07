import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Announcement, AnnouncementCategory } from '../../types';
import { AppleCard } from '../common/AppleCard';
import { AppleButton } from '../common/AppleButton';
import { EmptyState } from '../common/EmptyState';
import { AppleSkeletonAnnouncement } from '../common/AppleSkeleton';
import { 
  Megaphone, 
  Pin, 
  Calendar, 
  CheckCheck, 
  Filter, 
  Search, 
  Bell, 
  Sparkles,
  Building2,
  ChevronRight
} from 'lucide-react';

export const AnnouncementsView: React.FC = () => {
  const { announcements, markAnnouncementAsRead, markAllAnnouncementsAsRead, studentUser } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAnnouncement, setActiveAnnouncement] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCategoryChange = (cat: string) => {
    setIsLoading(true);
    setSelectedCategory(cat);
    setTimeout(() => setIsLoading(false), 250);
  };

  const categories = ['All', 'Talk Series', 'Auditions', 'Circular', 'Academic', 'Campus Life'];

  const filteredAnnouncements = announcements
    .filter((a) => {
      if (selectedCategory !== 'All' && a.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = a.title.toLowerCase().includes(query);
        const matchesContent = a.content.toLowerCase().includes(query);
        const matchesAuthor = a.authorName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesContent && !matchesAuthor) return false;
      }
      return true;
    })
    // Sort pinned to top, then chronological date
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const unreadCount = announcements.filter((a) => !a.readBy.includes(studentUser.id)).length;

  const handleCardClick = (ann: Announcement) => {
    markAnnouncementAsRead(ann.id);
    setActiveAnnouncement(ann);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FF9500]/10 text-[#FF9500]">
              Official Circulars
            </span>
            <span className="text-xs text-[#86868B]">Yeshwanthpur Campus SWO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
            Announcements & Notices
          </h2>
          <p className="text-sm text-[#86868B] mt-1">
            Stay updated with audition calls, talk series guidelines, volunteer recruitments, and student welfare notices.
          </p>
        </div>

        {unreadCount > 0 && (
          <AppleButton
            variant="secondary"
            size="sm"
            icon={<CheckCheck className="w-4 h-4 text-[#0071E3]" />}
            onClick={markAllAnnouncementsAsRead}
          >
            Mark All as Read ({unreadCount})
          </AppleButton>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search announcements by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-full bg-white border border-black/[0.08] text-xs sm:text-sm text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`min-h-[40px] px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center justify-center ${
                selectedCategory === cat
                  ? 'bg-[#002147] text-white font-semibold shadow-xs'
                  : 'bg-white text-[#515154] hover:text-[#1D1D1F] border border-black/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcement Cards List */}
      {isLoading ? (
        <div className="space-y-3.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <AppleSkeletonAnnouncement key={i} />
          ))}
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="w-7 h-7" />}
          title="No Announcements Found"
          description="There are currently no active announcements matching your query. Check back shortly for university notices."
          actionLabel="View All Categories"
          onAction={() => {
            handleCategoryChange('All');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="space-y-3.5">
          {filteredAnnouncements.map((ann) => {
            const isRead = ann.readBy.includes(studentUser.id);

            return (
              <AppleCard
                key={ann.id}
                hoverEffect
                padding="none"
                onClick={() => handleCardClick(ann)}
                className={`p-4 sm:p-5 cursor-pointer border transition-all duration-200 ${
                  ann.isPinned
                    ? 'border-[#C59B27]/40 bg-gradient-to-r from-amber-500/[0.02] to-transparent'
                    : 'border-black/[0.06]'
                } ${!isRead ? 'ring-1 ring-[#0071E3]/30' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    {/* Header Chips */}
                    <div className="flex flex-wrap items-center gap-2">
                      {ann.isPinned && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C59B27]/15 text-[#9A7B1C] flex items-center gap-1">
                          <Pin className="w-3 h-3 fill-current" /> Pinned Notice
                        </span>
                      )}

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0071E3]/10 text-[#0071E3]">
                        {ann.category}
                      </span>

                      <span className="text-xs text-[#86868B] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#86868B]" />
                        {new Date(ann.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>

                      {!isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#0071E3]" title="Unread" />
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-[#1D1D1F] tracking-tight leading-snug">
                      {ann.title}
                    </h3>

                    {/* Content Preview */}
                    <p className="text-xs sm:text-sm text-[#515154] leading-relaxed line-clamp-2">
                      {ann.content}
                    </p>

                    {/* Metadata Footer */}
                    <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-[#86868B]">
                      <span>Issued by: <strong className="text-[#1D1D1F]">{ann.authorName}</strong> ({ann.authorRole})</span>
                      <span>•</span>
                      <span>Target: {ann.targetDept} ({ann.targetYear})</span>
                    </div>
                  </div>

                  <div className="self-center text-[#86868B] hover:text-[#1D1D1F]">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </AppleCard>
            );
          })}
        </div>
      )}

      {/* Expanded Announcement Modal */}
      {activeAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/[0.08] space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-black/[0.05] pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#002147] text-white">
                  {activeAnnouncement.category}
                </span>
                {activeAnnouncement.isPinned && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C59B27]/15 text-[#9A7B1C] flex items-center gap-1">
                    <Pin className="w-3 h-3 fill-current" /> Pinned
                  </span>
                )}
              </div>
              <button
                onClick={() => setActiveAnnouncement(null)}
                aria-label="Close modal"
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-black/5 text-[#86868B] transition-colors"
              >
                ✕
              </button>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight leading-snug">
                {activeAnnouncement.title}
              </h2>
              <div className="mt-2 flex items-center gap-3 text-xs text-[#86868B]">
                <span>{new Date(activeAnnouncement.date).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
                <span>•</span>
                <span>Target: {activeAnnouncement.targetDept}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.04] text-xs sm:text-sm text-[#3A3A3C] leading-relaxed whitespace-pre-line">
              {activeAnnouncement.content}
            </div>

            <div className="p-3.5 rounded-xl bg-[#002147]/5 border border-[#002147]/10 flex items-center gap-3 text-xs">
              <Building2 className="w-5 h-5 text-[#002147] shrink-0" />
              <div>
                <p className="font-semibold text-[#1D1D1F]">{activeAnnouncement.authorName}</p>
                <p className="text-[11px] text-[#86868B]">{activeAnnouncement.authorRole} • Student Welfare Office</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <AppleButton
                variant="primary"
                size="sm"
                onClick={() => setActiveAnnouncement(null)}
              >
                Close Notice
              </AppleButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

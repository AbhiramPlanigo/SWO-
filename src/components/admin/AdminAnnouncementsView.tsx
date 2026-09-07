import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Announcement, AnnouncementCategory } from '../../types';
import { AppleCard } from '../common/AppleCard';
import { AppleButton } from '../common/AppleButton';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { 
  Megaphone, 
  Plus, 
  Pin, 
  Trash2, 
  Calendar, 
  Search, 
  Building2,
  Users,
  CheckCircle2
} from 'lucide-react';

interface AdminAnnouncementsViewProps {
  isCreateOpenInitially?: boolean;
  onCloseCreateInitial?: () => void;
}

export const AdminAnnouncementsView: React.FC<AdminAnnouncementsViewProps> = ({
  isCreateOpenInitially = false,
  onCloseCreateInitial,
}) => {
  const { announcements, addAnnouncement, deleteAnnouncement, togglePinAnnouncement, adminUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(isCreateOpenInitially);

  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: '',
    category: 'Circular',
    content: '',
    targetDept: 'All Departments',
    targetYear: 'All Years',
    isPinned: false,
  });

  const categories: AnnouncementCategory[] = [
    'Talk Series',
    'Auditions',
    'Circular',
    'Academic',
    'Campus Life',
  ];

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      category: 'Circular',
      content: '',
      targetDept: 'All Departments',
      targetYear: 'All Years',
      isPinned: false,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: formData.title || 'Untitled Notice',
      category: formData.category || 'Circular',
      content: formData.content || '',
      date: new Date().toISOString().split('T')[0],
      isPinned: !!formData.isPinned,
      authorName: adminUser.name,
      authorRole: adminUser.role,
      targetDept: formData.targetDept || 'All Departments',
      targetYear: formData.targetYear || 'All Years',
      readBy: [],
    };

    addAnnouncement(newAnn);
    setIsModalOpen(false);
    if (onCloseCreateInitial) onCloseCreateInitial();
  };

  const filteredAnnouncements = announcements.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.authorName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FF9500]/10 text-[#FF9500]">
              Broadcast System
            </span>
            <span className="text-xs text-[#86868B]">Yeshwanthpur Campus SWO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
            Official Notices & Circulars
          </h2>
          <p className="text-sm text-[#86868B] mt-1">
            Dispatch urgent circulars, audition announcements, and academic updates directly to student feeds.
          </p>
        </div>

        <AppleButton
          variant="navy"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          Publish Circular
        </AppleButton>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search circulars by keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-black/[0.08] text-xs sm:text-sm text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 shadow-xs"
        />
      </div>

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="w-7 h-7" />}
          title="No Notices Found"
          description="There are currently no active circulars matching your search."
          actionLabel="Publish First Circular"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="space-y-3.5">
          {filteredAnnouncements.map((ann) => (
            <AppleCard
              key={ann.id}
              padding="none"
              className={`p-5 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                ann.isPinned ? 'border-[#C59B27]/40 bg-amber-500/[0.015]' : 'border-black/[0.06]'
              }`}
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {ann.isPinned && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C59B27]/15 text-[#9A7B1C] flex items-center gap-1">
                      <Pin className="w-3 h-3 fill-current" /> Pinned
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0071E3]/10 text-[#0071E3]">
                    {ann.category}
                  </span>
                  <span className="text-xs text-[#86868B] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#86868B]" />
                    {new Date(ann.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#1D1D1F] tracking-tight">
                  {ann.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#515154] leading-relaxed line-clamp-2">
                  {ann.content}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#86868B] pt-1">
                  <span>Target: <strong className="text-[#1D1D1F]">{ann.targetDept}</strong> ({ann.targetYear})</span>
                  <span>•</span>
                  <span>Issued By: {ann.authorName}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <AppleButton
                  variant="secondary"
                  size="sm"
                  icon={<Pin className={`w-3.5 h-3.5 ${ann.isPinned ? 'fill-current text-[#C59B27]' : ''}`} />}
                  onClick={() => togglePinAnnouncement(ann.id)}
                >
                  {ann.isPinned ? 'Unpin' : 'Pin to Top'}
                </AppleButton>

                <button
                  onClick={() => {
                    if (confirm(`Delete circular "${ann.title}"?`)) {
                      deleteAnnouncement(ann.id);
                    }
                  }}
                  className="p-2 rounded-xl text-[#FF3B30] hover:bg-[#FF3B30]/10 transition-colors"
                  title="Delete Circular"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </AppleCard>
          ))}
        </div>
      )}

      {/* Create Circular Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish Official SWO Circular"
        subtitle="Broadcast notices to Yeshwanthpur student body"
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Notice Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Mandatory Auditorium Seating Protocols for Darpan 2026"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as AnnouncementCategory })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Target Department</label>
              <select
                value={formData.targetDept}
                onChange={(e) => setFormData({ ...formData, targetDept: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
              >
                <option value="All Departments">All Departments</option>
                <option value="School of Engineering & Tech">School of Engineering & Tech</option>
                <option value="Department of Management Studies">Department of Management Studies</option>
                <option value="Department of Media Studies">Department of Media Studies</option>
                <option value="Department of Sciences">Department of Sciences</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Full Circular Text *</label>
            <textarea
              required
              rows={5}
              placeholder="Enter official directives, schedules, and reporting guidelines..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-black/[0.02] border border-black/[0.05]">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1D1D1F]">
              <input
                type="checkbox"
                checked={formData.isPinned}
                onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                className="rounded text-[#0071E3] focus:ring-[#0071E3]"
              />
              <span>Pin this notice to top of student feed</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/[0.05]">
            <AppleButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </AppleButton>
            <AppleButton type="submit" variant="primary" size="sm">
              Publish Notice
            </AppleButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EventItem, EventCategory, EventStatus, CustomField } from '../../types';
import { AppleCard } from '../common/AppleCard';
import { AppleButton } from '../common/AppleButton';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { AppleSkeletonTable } from '../common/AppleSkeleton';
import { 
  Calendar, 
  Plus, 
  Edit3, 
  Trash2, 
  Sliders, 
  Search, 
  Sparkles, 
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  Eye,
  Layers,
  ArrowUpDown
} from 'lucide-react';

interface AdminEventsViewProps {
  isCreateOpenInitially?: boolean;
  onCloseCreateInitial?: () => void;
}

export const AdminEventsView: React.FC<AdminEventsViewProps> = ({
  isCreateOpenInitially = false,
  onCloseCreateInitial,
}) => {
  const { events, addEvent, updateEvent, deleteEvent } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(isCreateOpenInitially);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCategorySelect = (cat: string) => {
    setIsLoading(true);
    setSelectedCategory(cat);
    setTimeout(() => setIsLoading(false), 300);
  };

  // Form State
  const initialFormState: Partial<EventItem> = {
    title: '',
    subtitle: '',
    category: 'Talk Series',
    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    time: '02:00 PM – 04:30 PM',
    venue: 'Main Auditorium, Central Block, Christ University',
    description: '',
    capacity: 250,
    registrationDeadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'Published',
    organizingCommittee: 'SWO Cultural Core Wing',
    eligibility: 'Open to all undergraduate and postgraduate students of Yeshwanthpur Campus',
    bannerUrl: 'https://farm66.staticflickr.com/65535/53890794279_c2e8e2a4bc_b.jpg',
    inCarousel: false,
    carouselOrder: 1,
    speaker: {
      name: '',
      role: '',
      avatar: 'https://farm66.staticflickr.com/65535/53188337164_f346df7a8f_b.jpg',
      bio: '',
    },
    customFields: [],
  };

  const [formData, setFormData] = useState<Partial<EventItem>>(initialFormState);

  const categories: EventCategory[] = [
    'Talk Series',
    'Cultural',
    'Literary',
    'Well-Being',
    'Tech & Innovation',
    'Social Welfare',
    'Sports & Fitness',
  ];

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt: EventItem) => {
    setEditingEvent(evt);
    setFormData(evt);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingEvent) {
      updateEvent(editingEvent.id, formData);
    } else {
      const newEvt: EventItem = {
        id: `evt-${Date.now()}`,
        title: formData.title || 'Untitled Event',
        subtitle: formData.subtitle || '',
        category: formData.category || 'Cultural',
        date: formData.date || new Date().toISOString().split('T')[0],
        time: formData.time || '02:00 PM',
        venue: formData.venue || 'Auditorium',
        description: formData.description || '',
        capacity: Number(formData.capacity) || 100,
        registeredCount: 0,
        registrationDeadline: formData.registrationDeadline || new Date().toISOString(),
        status: (formData.status as EventStatus) || 'Published',
        organizingCommittee: formData.organizingCommittee || 'SWO',
        eligibility: formData.eligibility || 'Open to all',
        bannerUrl: formData.bannerUrl || 'https://farm66.staticflickr.com/65535/53890794279_c2e8e2a4bc_b.jpg',
        inCarousel: !!formData.inCarousel,
        carouselOrder: Number(formData.carouselOrder) || 1,
        speaker: formData.speaker?.name ? formData.speaker : undefined,
        customFields: formData.customFields || [],
      };
      addEvent(newEvt);
    }

    setIsModalOpen(false);
    if (onCloseCreateInitial) onCloseCreateInitial();
  };

  const toggleCarouselFlag = (evt: EventItem) => {
    updateEvent(evt.id, { inCarousel: !evt.inCarousel });
  };

  const filteredEvents = events.filter((e) => {
    if (selectedCategory !== 'All' && e.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.organizingCommittee.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0071E3]/10 text-[#0071E3]">
              Curator Controls
            </span>
            <span className="text-xs text-[#86868B]">Yeshwanthpur Campus SWO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
            Events & Banner Management
          </h2>
          <p className="text-sm text-[#86868B] mt-1">
            Create campus programs, assign auditorium seating limits, customize registration forms, and curate the homepage carousel.
          </p>
        </div>

        <AppleButton
          variant="navy"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          Create Event
        </AppleButton>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events by title, venue, or committee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-black/[0.08] text-xs sm:text-sm text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 no-scrollbar">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#002147] text-white font-semibold'
                  : 'bg-white text-[#515154] hover:text-[#1D1D1F] border border-black/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table / List */}
      {isLoading ? (
        <AppleSkeletonTable rows={5} />
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          title="No Events Found"
          description="No programs match your current filter parameters."
          actionLabel="Create First Event"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="space-y-3.5">
          {filteredEvents.map((evt) => {
            const fillPct = Math.min(100, Math.round((evt.registeredCount / evt.capacity) * 100));

            return (
              <AppleCard
                key={evt.id}
                padding="none"
                className="p-5 border border-black/[0.06] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
              >
                {/* Event summary info */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={evt.bannerUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover"
                    />
                    {evt.inCarousel && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#FFD60A] text-[#1D1D1F]">
                        #{evt.carouselOrder}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#002147]/10 text-[#002147]">
                        {evt.category}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          evt.status === 'Published'
                            ? 'bg-[#34C759]/15 text-[#28A745]'
                            : evt.status === 'Draft'
                            ? 'bg-black/[0.06] text-[#86868B]'
                            : 'bg-[#FF3B30]/15 text-[#FF3B30]'
                        }`}
                      >
                        {evt.status}
                      </span>

                      <span className="text-xs text-[#86868B]">
                        {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {evt.time}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#1D1D1F] tracking-tight truncate">
                      {evt.title}
                    </h3>

                    <p className="text-xs text-[#86868B] truncate">
                      {evt.venue} • {evt.organizingCommittee}
                    </p>
                  </div>
                </div>

                {/* Capacity & Carousel status */}
                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                  {/* Capacity Bar */}
                  <div className="w-36 text-xs">
                    <div className="flex items-center justify-between text-[#86868B] mb-1">
                      <span>Seats</span>
                      <span className="font-semibold text-[#1D1D1F]">{evt.registeredCount}/{evt.capacity}</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0071E3] rounded-full"
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Carousel toggle pill */}
                  <button
                    onClick={() => toggleCarouselFlag(evt)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                      evt.inCarousel
                        ? 'bg-[#002147] text-white border-[#002147]'
                        : 'bg-black/[0.02] text-[#86868B] border-black/[0.08] hover:border-black/[0.15]'
                    }`}
                  >
                    {evt.inCarousel ? `★ In Carousel (#${evt.carouselOrder})` : '+ Add to Carousel'}
                  </button>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5">
                    <AppleButton
                      variant="secondary"
                      size="sm"
                      icon={<Edit3 className="w-3.5 h-3.5" />}
                      onClick={() => handleOpenEdit(evt)}
                    >
                      Edit
                    </AppleButton>

                    <button
                      onClick={() => {
                        if (confirm(`Delete "${evt.title}"? This cannot be undone.`)) {
                          deleteEvent(evt.id);
                        }
                      }}
                      className="p-2 rounded-xl text-[#FF3B30] hover:bg-[#FF3B30]/10 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </AppleCard>
            );
          })}
        </div>
      )}

      {/* Create / Edit Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Edit Event Details' : 'Create New SWO Event'}
        subtitle="Configure auditorium capacity, registration criteria, and hero carousel visibility."
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveEvent} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Event Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Ignite Talk Series: The Future of Quantum Architecture"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Subtitle / Punchline</label>
              <input
                type="text"
                value={formData.subtitle || ''}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. A premier national symposium on emerging computing paradigm"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
              >
                <option value="Published">Published (Open for Registration)</option>
                <option value="Draft">Draft (Hidden from Student Portal)</option>
                <option value="Closed">Closed (Archived)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Time Slot *</label>
              <input
                type="text"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g. 02:00 PM – 04:30 PM"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Campus Venue *</label>
              <input
                type="text"
                required
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="e.g. Main Auditorium, Central Block"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Capacity (Max Seats) *</label>
              <input
                type="number"
                required
                min={10}
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Banner Image URL *</label>
              <input
                type="url"
                required
                value={formData.bannerUrl}
                onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                placeholder="https://farm66.staticflickr.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
              />
            </div>

            {/* Carousel settings */}
            <div className="sm:col-span-2 p-3.5 rounded-2xl bg-black/[0.02] border border-black/[0.05] flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.inCarousel}
                    onChange={(e) => setFormData({ ...formData, inCarousel: e.target.checked })}
                    className="rounded text-[#0071E3] focus:ring-[#0071E3]"
                  />
                  <span>Feature in Student Portal Homepage Carousel</span>
                </label>
                <p className="text-[11px] text-[#86868B] mt-0.5">
                  Display this event as a prime rotating slide with CTA on the home banner.
                </p>
              </div>

              {formData.inCarousel && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#1D1D1F]">Order:</span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.carouselOrder}
                    onChange={(e) => setFormData({ ...formData, carouselOrder: parseInt(e.target.value) || 1 })}
                    className="w-16 px-2 py-1 rounded-lg border border-black/[0.1] text-xs text-center font-bold"
                  />
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Full Description *</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide detailed itinerary, dress code, and expectations..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Organizing Committee *</label>
              <input
                type="text"
                required
                value={formData.organizingCommittee}
                onChange={(e) => setFormData({ ...formData, organizingCommittee: e.target.value })}
                placeholder="e.g. SWO University Cultural Committee"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-black/[0.05]">
            <AppleButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </AppleButton>
            <AppleButton type="submit" variant="primary" size="sm">
              {editingEvent ? 'Save Changes' : 'Create & Publish'}
            </AppleButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

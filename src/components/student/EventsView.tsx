import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EventItem, EventCategory } from '../../types';
import { AppleCard } from '../common/AppleCard';
import { AppleButton } from '../common/AppleButton';
import { EmptyState } from '../common/EmptyState';
import { AppleSkeletonEventCard } from '../common/AppleSkeleton';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Clock, 
  Filter, 
  LayoutGrid, 
  List, 
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface EventsViewProps {
  onSelectEvent: (event: EventItem) => void;
  onRegisterEvent: (event: EventItem) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  onSelectEvent,
  onRegisterEvent,
}) => {
  const { events, registrations, studentUser, openLoginModal } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);

  const handleCategoryChange = (cat: string) => {
    setIsLoading(true);
    setSelectedCategory(cat);
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleDateFilterChange = (filter: 'all' | 'upcoming' | 'past') => {
    setIsLoading(true);
    setDateFilter(filter);
    setTimeout(() => setIsLoading(false), 250);
  };

  const handleRegisterClick = (evt: EventItem) => {
    if (!studentUser) {
      openLoginModal(
        `Institutional Login Required: Sign in with your official @christuniversity.in account to register for ${evt.title}.`,
        () => onRegisterEvent(evt)
      );
      return;
    }
    onRegisterEvent(evt);
  };

  const categories: (string | EventCategory)[] = [
    'All',
    'Talk Series',
    'Cultural',
    'Literary',
    'Well-Being',
    'Tech & Innovation',
    'Social Welfare',
    'Sports & Fitness',
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Must be published
      if (evt.status !== 'Published') return false;

      // Category filter
      if (selectedCategory !== 'All' && evt.category !== selectedCategory) {
        return false;
      }

      // Search query (title, subtitle, venue, speaker, committee)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = evt.title.toLowerCase().includes(query);
        const matchesSubtitle = evt.subtitle.toLowerCase().includes(query);
        const matchesVenue = evt.venue.toLowerCase().includes(query);
        const matchesSpeaker = evt.speaker?.name.toLowerCase().includes(query) || false;
        const matchesCommittee = evt.organizingCommittee.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSubtitle && !matchesVenue && !matchesSpeaker && !matchesCommittee) {
          return false;
        }
      }

      // Date filter
      const eventDate = new Date(evt.date).getTime();
      const today = new Date().setHours(0, 0, 0, 0);

      if (dateFilter === 'upcoming' && eventDate < today) return false;
      if (dateFilter === 'past' && eventDate >= today) return false;

      return true;
    });
  }, [events, selectedCategory, searchQuery, dateFilter]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Description */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0071E3]/10 text-[#0071E3]">
              Official Schedule
            </span>
            <span className="text-xs text-[#86868B]">Yeshwanthpur Campus</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
            Campus Events & Talk Series
          </h2>
          <p className="text-sm text-[#86868B] mt-1 max-w-xl">
            Explore and register for flagship dialogues, cultural auditions, hackathons, and departmental initiatives organized under the Student Welfare Office.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 self-start md:self-auto bg-black/[0.04] p-1 rounded-full border border-black/[0.05]">
          <button
            onClick={() => setViewMode('grid')}
            className={`w-10 h-10 min-w-[40px] min-h-[40px] sm:w-8 sm:h-8 sm:min-w-[32px] sm:min-h-[32px] flex items-center justify-center rounded-full text-xs transition-colors ${
              viewMode === 'grid' ? 'bg-[#3A5982] text-white shadow-xs' : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`w-10 h-10 min-w-[40px] min-h-[40px] sm:w-8 sm:h-8 sm:min-w-[32px] sm:min-h-[32px] flex items-center justify-center rounded-full text-xs transition-colors ${
              viewMode === 'list' ? 'bg-[#3A5982] text-white shadow-xs' : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="space-y-3">
        {/* Search input and date filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by event title, speaker, committee, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-full bg-white border border-black/[0.08] text-xs sm:text-sm text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#3A5982]/20 focus:border-[#3A5982] transition-all shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white p-1 rounded-full border border-black/[0.08] shadow-xs">
            <button
              onClick={() => handleDateFilterChange('all')}
              className={`min-h-[40px] px-3.5 py-2 sm:py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center justify-center ${
                dateFilter === 'all' ? 'bg-[#3A5982] text-white' : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              All Dates
            </button>
            <button
              onClick={() => handleDateFilterChange('upcoming')}
              className={`min-h-[40px] px-3.5 py-2 sm:py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center justify-center ${
                dateFilter === 'upcoming' ? 'bg-[#3A5982] text-white' : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => handleDateFilterChange('past')}
              className={`min-h-[40px] px-3.5 py-2 sm:py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center justify-center ${
                dateFilter === 'past' ? 'bg-[#3A5982] text-white' : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              Past
            </button>
          </div>
        </div>

        {/* Category Pills (Apple Horizontal Scroll Strip) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat as string)}
                className={`min-h-[42px] px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border flex items-center justify-center ${
                  isSelected
                    ? 'bg-[#1B283A] text-white border-[#1B283A] shadow-xs'
                    : 'bg-white text-[#515154] hover:text-[#1D1D1F] border-black/[0.08] hover:border-black/[0.15]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Results Header */}
      <div className="flex items-center justify-between text-xs text-[#86868B] px-1">
        <span>Showing {filteredEvents.length} events</span>
        {selectedCategory !== 'All' && (
          <button
            onClick={() => {
              handleCategoryChange('All');
              setSearchQuery('');
            }}
            className="text-[#0071E3] hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Events Grid or List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <AppleSkeletonEventCard key={i} />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          title="No Matching Events Found"
          description="Try adjusting your search keywords, clearing selected category filters, or checking back soon for newly published talk series."
          actionLabel="Reset Search & Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
            setDateFilter('all');
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredEvents.map((evt) => {
            const isRegistered = registrations.some(
              (r) => r.eventId === evt.id && r.studentId === studentUser?.id && r.status !== 'Cancelled'
            );
            const isFull = evt.registeredCount >= evt.capacity;
            const fillPct = Math.min(100, Math.round((evt.registeredCount / evt.capacity) * 100));

            return (
              <AppleCard
                key={evt.id}
                hoverEffect
                padding="none"
                className="overflow-hidden flex flex-col justify-between border border-black/[0.06] rounded-[24px] bg-white"
              >
                <div>
                  {/* Banner Image with category chip */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={evt.bannerUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-[#1B283A] shadow-xs">
                        {evt.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      {isRegistered ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#34C759] text-white shadow-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                        </span>
                      ) : isFull ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FF9500] text-white shadow-xs">
                          Waitlist Only
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white">
                          Open
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-1.5 text-xs text-[#3A5982] font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A063]" />
                      <span>
                        {new Date(evt.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <Clock className="w-3.5 h-3.5 text-[#86868B]" />
                      <span className="text-[#515154] truncate">{evt.time}</span>
                    </div>

                    <h3
                      onClick={() => onSelectEvent(evt)}
                      className="text-base font-bold text-[#1D1D1F] tracking-tight mt-2 line-clamp-2 hover:text-[#3A5982] cursor-pointer transition-colors"
                    >
                      {evt.title}
                    </h3>

                    <p className="text-xs text-[#86868B] mt-1.5 line-clamp-2 leading-relaxed">
                      {evt.subtitle || evt.description}
                    </p>

                    <div className="mt-3 flex items-center gap-1.5 text-xs text-[#515154]">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>

                    {/* Speaker preview if present */}
                    {evt.speaker && (
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                        <img
                          src={evt.speaker.avatar}
                          alt={evt.speaker.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#1D1D1F] truncate">
                            {evt.speaker.name}
                          </p>
                          <p className="text-[10px] text-[#86868B] truncate">
                            {evt.speaker.role}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Capacity & Action */}
                <div className="p-4 sm:p-5 pt-0">
                  <div className="border-t border-black/[0.05] pt-3">
                    <div className="flex items-center justify-between text-xs text-[#86868B] mb-1.5">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#C5A063]" /> Seats Booked
                      </span>
                      <span className="font-semibold text-[#1D1D1F]">
                        {evt.registeredCount} / {evt.capacity}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-black/[0.06] rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          fillPct > 90 ? 'bg-rose-500' : fillPct > 70 ? 'bg-amber-500' : 'bg-[#3A5982]'
                        }`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <AppleButton
                        variant="secondary"
                        size="sm"
                        className="w-full text-xs min-h-[44px]"
                        onClick={() => onSelectEvent(evt)}
                      >
                        Details
                      </AppleButton>

                      <AppleButton
                        variant={isRegistered ? 'navy' : 'primary'}
                        size="sm"
                        className="w-full text-xs min-h-[44px]"
                        onClick={() => handleRegisterClick(evt)}
                      >
                        {isRegistered ? 'View Ticket' : isFull ? 'Join Waitlist' : 'Register'}
                      </AppleButton>
                    </div>
                  </div>
                </div>
              </AppleCard>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredEvents.map((evt) => {
            const isRegistered = registrations.some(
              (r) => r.eventId === evt.id && r.studentId === studentUser?.id && r.status !== 'Cancelled'
            );

            return (
              <AppleCard
                key={evt.id}
                hoverEffect
                padding="none"
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-black/[0.06] rounded-2xl"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={evt.bannerUrl}
                    alt={evt.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 hidden sm:block"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#3A5982]/10 text-[#3A5982]">
                        {evt.category}
                      </span>
                      <span className="text-xs text-[#3A5982] font-semibold">
                        {new Date(evt.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        • {evt.time}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectEvent(evt)}
                      className="text-sm sm:text-base font-bold text-[#1D1D1F] hover:text-[#3A5982] cursor-pointer mt-1"
                    >
                      {evt.title}
                    </h3>
                    <p className="text-xs text-[#86868B] flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" /> {evt.venue} • {evt.organizingCommittee}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <AppleButton
                    variant="secondary"
                    size="sm"
                    className="text-xs min-h-[44px] w-full sm:w-auto"
                    onClick={() => onSelectEvent(evt)}
                  >
                    View Details
                  </AppleButton>

                  <AppleButton
                    variant={isRegistered ? 'navy' : 'primary'}
                    size="sm"
                    className="text-xs min-h-[44px] w-full sm:w-auto"
                    onClick={() => handleRegisterClick(evt)}
                  >
                    {isRegistered ? 'Ticket Pass' : 'Register'}
                  </AppleButton>
                </div>
              </AppleCard>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { EventItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  MapPin, 
  ArrowUpRight, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2, 
  Bell,
  PlusCircle,
  Clock,
  X,
  Sparkles,
  Upload,
  Gauge
} from 'lucide-react';

interface ScrollingBannersSectionProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onQuickRegister?: (event: EventItem) => void;
  onExploreAll: () => void;
}

export const ScrollingBannersSection: React.FC<ScrollingBannersSectionProps> = ({
  events,
  onSelectEvent,
  onQuickRegister,
  onExploreAll,
}) => {
  const { studentUser, registrations, addEvent, showToast } = useApp();
  
  // Speed control: user requested "slow speed should be there"
  const [isSlowSpeed, setIsSlowSpeed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isPostReelOpen, setIsPostReelOpen] = useState(false);

  // New post reel form state
  const [reelForm, setReelForm] = useState({
    title: '',
    subtitle: '',
    category: 'Cultural' as EventItem['category'],
    date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    time: '04:00 PM - 06:30 PM',
    venue: 'Main Auditorium',
    organizingCommittee: 'SWO Student Council',
    capacity: 250,
    bannerUrl: 'https://farm66.staticflickr.com/65535/53890794279_c2e8e2a4bc_b.jpg'
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Filter published events with rich imagery
  const displayEvents = events.filter((e) => e.status === 'Published');
  // Duplicate array 3 times for a seamless infinite loop
  const duplicatedEvents = [...displayEvents, ...displayEvents, ...displayEvents];

  // RequestAnimationFrame ticker strictly scrolling towards the left (from left to right direction)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (container.scrollLeft === 0) {
      container.scrollLeft = container.scrollWidth / 3;
    }

    const speedMultiplier = isSlowSpeed ? 0.75 : 1.4;

    const scrollLoop = () => {
      if (!isHovered && container) {
        const oneThird = container.scrollWidth / 3;
        // Strictly scrolling towards the left
        container.scrollLeft += speedMultiplier;
        if (container.scrollLeft >= oneThird * 2) {
          container.scrollLeft -= oneThird;
        }
      }
      animFrameIdRef.current = requestAnimationFrame(scrollLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(scrollLoop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isHovered, isSlowSpeed, displayEvents.length]);

  const handleRegisterClick = (e: React.MouseEvent, event: EventItem) => {
    e.stopPropagation();
    if (onQuickRegister) {
      onQuickRegister(event);
    } else {
      onSelectEvent(event);
    }
  };

  const nudgeScroll = (amount: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handlePostReelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelForm.title.trim()) {
      showToast('Title Required', 'Please enter a title for the campus highlight.', 'error');
      return;
    }

    addEvent({
      title: reelForm.title,
      subtitle: reelForm.subtitle || 'Official Campus Reel Highlight',
      description: reelForm.subtitle || 'Featured student activity and campus initiative.',
      category: reelForm.category,
      date: reelForm.date,
      time: reelForm.time,
      venue: reelForm.venue,
      capacity: Number(reelForm.capacity),
      status: 'Published',
      organizingCommittee: reelForm.organizingCommittee,
      bannerUrl: reelForm.bannerUrl,
      isInHeroCarousel: true,
      carouselOrder: 1,
      attendanceCode: 'REEL' + Math.floor(100 + Math.random() * 900)
    });

    showToast('Reel Highlight Posted', `"${reelForm.title}" is now streaming on the live campus reel!`, 'success');
    setIsPostReelOpen(false);
    setReelForm({
      title: '',
      subtitle: '',
      category: 'Cultural',
      date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      time: '04:00 PM - 06:30 PM',
      venue: 'Main Auditorium',
      organizingCommittee: 'SWO Student Council',
      capacity: 250,
      bannerUrl: 'https://farm66.staticflickr.com/65535/53890794279_c2e8e2a4bc_b.jpg'
    });
  };

  return (
    <div id="campus-scrolling-reel" className="w-full space-y-4">
      {/* =========================================================================
          TOP CONTROL & TITLE BAR
          ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A5982]/10 dark:bg-[#60A5FA]/15 text-[#3A5982] dark:text-[#93C5FD] text-[11px] font-bold tracking-widest uppercase border border-[#3A5982]/20 dark:border-[#60A5FA]/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              LIVE CAMPUS REEL
            </span>
            <span className="text-xs font-semibold text-[#8C9AA9] dark:text-[#94A3B8]">
              • Scrolling Towards Left
            </span>
            <span className="hidden sm:inline-block text-xs font-medium text-[#536275] dark:text-[#64748B]">
              (Hover card to inspect)
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#16212F] dark:text-[#F8FAFC] tracking-tight">
            Featured Banners & Campus Highlights
          </h2>
          <p className="text-xs sm:text-sm text-[#536275] dark:text-[#94A3B8] max-w-2xl">
            Streamlined real-time reel of student conclaves, inter-department fests, hackathons, and cultural performances at Bangalore Yeshwanthpur.
          </p>
        </div>

        {/* Interactive Controls Bar: Post Reel & Slow Speed Toggle */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Post Reel Button */}
          <button
            onClick={() => setIsPostReelOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#C5A063] hover:bg-[#B38E52] text-black transition-all shadow-sm active:scale-95"
            title="Post a new banner or highlight to the campus reel"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Reel</span>
          </button>

          {/* Slow Speed Toggle */}
          <button
            onClick={() => setIsSlowSpeed(!isSlowSpeed)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all ${
              isSlowSpeed
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 shadow-2xs'
                : 'bg-white dark:bg-[#1E293B] text-[#16212F] dark:text-[#F1F5F9] border-[#E2E8F0] dark:border-[#334155] hover:bg-slate-50'
            }`}
            title="Toggle between Slow Speed and Standard Speed"
          >
            <Gauge className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Speed: {isSlowSpeed ? 'Slow / Smooth' : 'Standard'}</span>
          </button>

          {/* Manual Nudge Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => nudgeScroll(-380)}
              aria-label="Nudge Left"
              className="w-8 h-8 rounded-full bg-white dark:bg-[#1E293B] hover:bg-slate-100 dark:hover:bg-[#334155] text-[#16212F] dark:text-white flex items-center justify-center border border-[#E2E8F0] dark:border-[#334155] transition-colors shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => nudgeScroll(380)}
              aria-label="Nudge Right"
              className="w-8 h-8 rounded-full bg-white dark:bg-[#1E293B] hover:bg-slate-100 dark:hover:bg-[#334155] text-[#16212F] dark:text-white flex items-center justify-center border border-[#E2E8F0] dark:border-[#334155] transition-colors shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Explore All Link */}
          <button
            onClick={onExploreAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#3A5982] dark:bg-[#4770A3] hover:bg-[#2D476C] text-white text-xs font-bold transition-all shadow-xs"
          >
            <span>All Events</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          CONTINUOUS SCROLLING BANNER TRACK (SCROLLING TOWARDS LEFT)
          ========================================================================= */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full overflow-hidden rounded-[28px] lg:rounded-[36px] bg-[#12161F] dark:bg-[#0E131F] border border-[#E2E8F0]/20 dark:border-white/10 shadow-2xl py-6 sm:py-8 group"
      >
        {/* Subtle decorative background watermark */}
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-10 dark:opacity-5 overflow-hidden">
          <span className="font-serif tracking-widest text-white text-[14vw] font-black uppercase whitespace-nowrap">
            CHRIST • REEL
          </span>
        </div>

        {/* Soft edge gradient fades */}
        <div className="absolute top-0 bottom-0 left-0 w-10 sm:w-20 bg-gradient-to-r from-[#12161F] dark:from-[#0E131F] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-10 sm:w-20 bg-gradient-to-l from-[#12161F] dark:from-[#0E131F] to-transparent z-20 pointer-events-none" />

        {/* The Animated Reel Container */}
        <div 
          ref={scrollContainerRef}
          className="relative w-full overflow-x-hidden cursor-grab active:cursor-grabbing py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-5 sm:gap-6 px-4 w-max">
            {duplicatedEvents.map((evt, idx) => {
              const isUserRegistered = registrations.some(
                (r) => r.eventId === evt.id && r.studentId === studentUser?.id && r.status !== 'Cancelled'
              );
              const spotsRemaining = Math.max(0, evt.capacity - evt.registeredCount);

              const uniqueKey = `${evt.id}_reel_${idx}`;

              return (
                <div
                  key={uniqueKey}
                  onClick={() => onSelectEvent(evt)}
                  className="relative shrink-0 w-[330px] sm:w-[440px] lg:w-[480px] h-[280px] sm:h-[310px] rounded-[24px] overflow-hidden border border-white/15 dark:border-white/10 bg-[#1A2332] dark:bg-[#161F2E] text-white shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-[#C5A063] hover:shadow-2xl flex flex-col justify-between p-5 sm:p-6 group/card"
                >
                  {/* Background Image */}
                  <img
                    src={evt.bannerUrl}
                    alt={evt.title}
                    className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.62] group-hover/card:brightness-[0.74] group-hover/card:scale-105 transition-all duration-700"
                    loading="lazy"
                  />

                  {/* Multi-stop Editorial Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/70 to-[#0B0F17]/20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17]/85 via-transparent to-transparent" />

                  {/* Top Bar inside Card */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase bg-[#C5A063] text-black shadow-xs">
                        {evt.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-black/50 backdrop-blur-md text-white/90 border border-white/15">
                        {evt.organizingCommittee.replace('SWO ', '')}
                      </span>
                    </div>

                    {isUserRegistered ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold shadow-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        Registered
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white/85 text-[10px] font-semibold border border-white/10">
                        {spotsRemaining} Seats Left
                      </span>
                    )}
                  </div>

                  {/* Middle / Bottom Content */}
                  <div className="relative z-10 space-y-2 mt-auto">
                    {/* Meta: Date & Venue */}
                    <div className="flex flex-wrap items-center gap-2.5 text-[11px] sm:text-xs text-white/90">
                      <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/10">
                        <Calendar className="w-3 h-3 text-[#C5A063]" />
                        {new Date(evt.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        • {evt.time.split(' - ')[0]}
                      </span>

                      <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/10 truncate max-w-[200px]">
                        <MapPin className="w-3 h-3 text-rose-300 shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug line-clamp-2 group-hover/card:text-[#E6C98F] transition-colors">
                      {evt.title}
                    </h3>

                    {/* Subtitle preview */}
                    <p className="text-xs text-slate-200 line-clamp-1 font-light">
                      {evt.subtitle || evt.description}
                    </p>

                    {/* Interactive Action Bar on Card */}
                    <div className="pt-2 flex items-center justify-between gap-3">
                      <button
                        onClick={(e) => handleRegisterClick(e, evt)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5 ${
                          isUserRegistered
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                            : 'bg-white hover:bg-slate-100 text-[#16212F]'
                        }`}
                      >
                        <span>{isUserRegistered ? 'View My Pass' : 'Register Now'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <span className="text-[11px] font-semibold text-white/70 group-hover/card:text-white flex items-center gap-1 transition-colors">
                        <span>Details</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            BOTTOM TICKER TAPE / MARQUEE ANNOUNCEMENTS STRIP
            ========================================================================= */}
        <div className="relative z-10 mt-5 mx-4 sm:mx-6 px-4 py-2.5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-between gap-4 text-xs text-white/85">
          <div className="flex items-center gap-2 shrink-0">
            <Bell className="w-3.5 h-3.5 text-[#C5A063] shrink-0" />
            <span className="font-bold text-[#C5A063] uppercase tracking-wider text-[10px]">
              SWO BULLETIN:
            </span>
          </div>

          <div className="overflow-hidden whitespace-nowrap min-w-0 text-[11px] text-white/80 font-medium">
            <span className="inline-block animate-pulse">
              🏆 Registrations live for Darpan 2026 Performing Categories • 🎓 Convocation QR passes available in Student Portal • 💬 Talk Series Q&A open for Amb. Vijayalakshmi Pandit • 🌿 Social action rural literacy drive this weekend
            </span>
          </div>

          <button
            onClick={onExploreAll}
            className="shrink-0 text-[11px] font-bold text-[#C5A063] hover:underline hidden sm:inline"
          >
            View Schedule →
          </button>
        </div>
      </div>

      {/* =========================================================================
          "POST REEL" MODAL / DIALOG
          ========================================================================= */}
      {isPostReelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#161D29] border border-[#E2E8F0] dark:border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 text-[#1D1D1F] dark:text-[#F8FAFC]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A063]/15 text-[#9D7A3E] dark:text-[#E2C78A] text-[11px] font-bold uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Campus Reel Submissions</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[#16212F] dark:text-white">
                  Post to Live Campus Reel
                </h3>
                <p className="text-xs text-[#536275] dark:text-[#94A3B8]">
                  Submit an upcoming club activity, fest teaser, or department highlight to the homepage marquee.
                </p>
              </div>

              <button
                onClick={() => setIsPostReelOpen(false)}
                className="p-2 rounded-full text-[#8C9AA9] hover:text-[#16212F] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handlePostReelSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#16212F] dark:text-white mb-1">
                  Event / Highlight Title *
                </label>
                <input
                  type="text"
                  required
                  value={reelForm.title}
                  onChange={(e) => setReelForm({ ...reelForm, title: e.target.value })}
                  placeholder="e.g. Talk Series: AI & Sovereign Ethics"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#2D3A4F] bg-white dark:bg-[#1F293A] text-xs font-semibold text-[#16212F] dark:text-white focus:outline-none focus:border-[#C5A063]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#16212F] dark:text-white mb-1">
                    Category
                  </label>
                  <select
                    value={reelForm.category}
                    onChange={(e) => setReelForm({ ...reelForm, category: e.target.value as EventItem['category'] })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#2D3A4F] bg-white dark:bg-[#1F293A] text-xs font-medium text-[#16212F] dark:text-white focus:outline-none focus:border-[#C5A063]"
                  >
                    <option value="Conclave">Conclave & Talk Series</option>
                    <option value="Cultural">Cultural & Performing Arts</option>
                    <option value="Technical">Technical & Hackathon</option>
                    <option value="Literary">Literary & Debates</option>
                    <option value="Sports">Sports & Athletics</option>
                    <option value="Wellness">Wellness & Social Action</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#16212F] dark:text-white mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={reelForm.date}
                    onChange={(e) => setReelForm({ ...reelForm, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#2D3A4F] bg-white dark:bg-[#1F293A] text-xs font-medium text-[#16212F] dark:text-white focus:outline-none focus:border-[#C5A063]"
                  >
                  </input>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#16212F] dark:text-white mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={reelForm.venue}
                    onChange={(e) => setReelForm({ ...reelForm, venue: e.target.value })}
                    placeholder="e.g. Main Auditorium"
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#2D3A4F] bg-white dark:bg-[#1F293A] text-xs text-[#16212F] dark:text-white focus:outline-none focus:border-[#C5A063]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#16212F] dark:text-white mb-1">
                    Organizing Wing
                  </label>
                  <input
                    type="text"
                    value={reelForm.organizingCommittee}
                    onChange={(e) => setReelForm({ ...reelForm, organizingCommittee: e.target.value })}
                    placeholder="e.g. Student Welfare Office"
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#2D3A4F] bg-white dark:bg-[#1F293A] text-xs text-[#16212F] dark:text-white focus:outline-none focus:border-[#C5A063]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#16212F] dark:text-white mb-1">
                  Banner Image URL (Christ University Gallery Asset)
                </label>
                <input
                  type="url"
                  value={reelForm.bannerUrl}
                  onChange={(e) => setReelForm({ ...reelForm, bannerUrl: e.target.value })}
                  placeholder="https://farm66.staticflickr.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#2D3A4F] bg-white dark:bg-[#1F293A] text-xs text-[#16212F] dark:text-white focus:outline-none focus:border-[#C5A063]"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPostReelOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#536275] dark:text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#C5A063] hover:bg-[#B38E52] text-black text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  Publish to Reel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

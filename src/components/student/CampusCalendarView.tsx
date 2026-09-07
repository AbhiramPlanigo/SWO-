import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EventItem, EventCategory } from '../../types';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Clock, 
  Filter, 
  Search, 
  ArrowUpRight, 
  ExternalLink, 
  Download, 
  Sparkles,
  CheckCircle2,
  Users,
  Share2,
  Bookmark,
  CalendarCheck2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CampusCalendarViewProps {
  onSelectEvent: (event: EventItem) => void;
  onRegisterEvent: (event: EventItem) => void;
}

export const CampusCalendarView: React.FC<CampusCalendarViewProps> = ({
  onSelectEvent,
  onRegisterEvent,
}) => {
  const { events, studentUser, registrations, openLoginModal } = useApp();

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

  // Reference date: September 2026 (matching university event schedule)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // 0-indexed: 8 = September
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-18');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');

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

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Filter events by published status, category, and search query
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (e.status !== 'Published') return false;
      if (selectedCategory !== 'All' && e.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.organizingCommittee.toLowerCase().includes(q) ||
          (e.speaker?.name.toLowerCase().includes(q) || false)
        );
      }
      return true;
    });
  }, [events, selectedCategory, searchQuery]);

  // Map events by date (YYYY-MM-DD)
  const eventsByDate = useMemo(() => {
    const map: Record<string, EventItem[]> = {};
    filteredEvents.forEach((evt) => {
      if (!map[evt.date]) map[evt.date] = [];
      map[evt.date].push(evt);
    });
    return map;
  }, [filteredEvents]);

  // Calendar matrix calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun, 1 = Mon...

  const calendarDays = useMemo(() => {
    const days: { dayNumber: number; dateStr: string; isCurrentMonth: boolean }[] = [];

    // Previous month padding
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = currentMonth === 0 ? 12 : currentMonth;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dayNumber: d, dateStr, isCurrentMonth: false });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dayNumber: d, dateStr, isCurrentMonth: true });
    }

    // Next month padding to fill grid
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const m = currentMonth === 11 ? 1 : currentMonth + 2;
      const y = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dayNumber: d, dateStr, isCurrentMonth: false });
    }

    return days;
  }, [currentYear, currentMonth, firstDayIndex, daysInMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(8); // September 2026
    setSelectedDate('2026-09-18');
  };

  // Events for the selected date
  const selectedDateEvents = eventsByDate[selectedDate] || [];

  // Google Calendar Link generator
  const createGoogleCalendarUrl = (evt: EventItem) => {
    const title = encodeURIComponent(`[CHRIST SWO] ${evt.title}`);
    const details = encodeURIComponent(`${evt.subtitle || evt.description}\n\nVenue: ${evt.venue}\nOrganized by: ${evt.organizingCommittee}`);
    const location = encodeURIComponent(`${evt.venue}, Christ University Yeshwanthpur Campus, Bengaluru`);
    
    // Format date string for Google: YYYYMMDDTHHmmSSZ
    const cleanDate = evt.date.replace(/-/g, '');
    const dates = `${cleanDate}T043000Z/${cleanDate}T123000Z`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  };

  // Download .ics file
  const downloadIcsFile = (evt: EventItem) => {
    const cleanDate = evt.date.replace(/-/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CHRIST University SWO//Event Calendar//EN',
      'BEGIN:VEVENT',
      `SUMMARY:[CHRIST SWO] ${evt.title}`,
      `DESCRIPTION:${evt.subtitle || evt.description}`,
      `LOCATION:${evt.venue}, Christ University Yeshwanthpur`,
      `DTSTART:${cleanDate}T090000`,
      `DTEND:${cleanDate}T180000`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${evt.id}_calendar.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Talk Series': return 'bg-amber-500 text-amber-950 border-amber-300';
      case 'Cultural': return 'bg-purple-500 text-purple-950 border-purple-300';
      case 'Tech & Innovation': return 'bg-emerald-500 text-emerald-950 border-emerald-300';
      case 'Well-Being': return 'bg-teal-500 text-teal-950 border-teal-300';
      case 'Sports & Fitness': return 'bg-rose-500 text-rose-950 border-rose-300';
      case 'Literary': return 'bg-blue-500 text-blue-950 border-blue-300';
      default: return 'bg-[#3A5982] text-white border-[#3A5982]';
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* =========================================================================
          TOP BANNER: GEN Z VIBE & HIGH PROFESSIONALISM HEADER
          ========================================================================= */}
      <div className="relative rounded-[32px] bg-gradient-to-br from-[#16212F] via-[#1B283A] to-[#2D476C] text-white p-6 sm:p-8 lg:p-10 shadow-xl overflow-hidden">
        {/* Abstract Architectural Mesh */}
        <div className="absolute right-[-40px] top-[-40px] opacity-10 pointer-events-none select-none">
          <span className="text-[160px] font-serif font-black">2026</span>
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A063]/25 border border-[#C5A063]/40 text-[#E6C98F] text-[11px] font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#C5A063] animate-ping" />
              LIVE CAMPUS CALENDAR
            </span>
            <span className="text-xs text-slate-300 font-medium">
              Academic Year 2025–2026 • Bangalore Yeshwanthpur Campus
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Campus Schedule & Flagship Calendar
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-light">
            Track intra-collegiate cultural fests, distinguished diplomatic conclaves, hackathons, and well-being forums. Sync directly with your Google or Apple Calendar.
          </p>

          {/* Quick Metrics */}
          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-white/90">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
              <CalendarCheck2 className="w-3.5 h-3.5 text-[#C5A063]" />
              <span className="font-bold text-white">{filteredEvents.length}</span> Active Events Scheduled
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-Time Seat Booking</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CONTROLS BAR: MONTH SELECTOR, CATEGORIES & VIEW SWITCHER
          ========================================================================= */}
      <div className="space-y-4">
        {/* Month Navigator & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
          {/* Month Switcher */}
          <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
            <button
              onClick={handlePrevMonth}
              aria-label="Previous Month"
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 hover:bg-slate-200 text-[#16212F] flex items-center justify-center transition-colors active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center min-w-[150px] sm:min-w-[170px]">
              <h2 className="text-base sm:text-lg font-extrabold text-[#16212F] tracking-tight">
                {monthNames[currentMonth]} {currentYear}
              </h2>
            </div>

            <button
              onClick={handleNextMonth}
              aria-label="Next Month"
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 hover:bg-slate-200 text-[#16212F] flex items-center justify-center transition-colors active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={handleToday}
              className="min-h-[40px] px-4 py-2 rounded-full text-xs font-bold text-[#3A5982] bg-[#3A5982]/10 hover:bg-[#3A5982]/20 transition-colors ml-1 flex items-center justify-center"
            >
              Today
            </button>
          </div>

          {/* Search Box & View Mode Toggle */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <div className="relative flex-1 w-full sm:w-64">
              <Search className="w-4 h-4 text-[#8C9AA9] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search event, venue, speaker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[44px] pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] text-xs text-[#16212F] focus:outline-none focus:border-[#3A5982] bg-slate-50/70"
              />
            </div>

            {/* View Mode */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-[#E2E8F0] w-full sm:w-auto justify-center">
              <button
                onClick={() => setViewMode('month')}
                className={`flex-1 sm:flex-none min-h-[38px] px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                  viewMode === 'month'
                    ? 'bg-white text-[#16212F] shadow-xs'
                    : 'text-[#536275] hover:text-[#16212F]'
                }`}
              >
                Month Grid
              </button>
              <button
                onClick={() => setViewMode('agenda')}
                className={`flex-1 sm:flex-none min-h-[38px] px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                  viewMode === 'agenda'
                    ? 'bg-white text-[#16212F] shadow-xs'
                    : 'text-[#536275] hover:text-[#16212F]'
                }`}
              >
                Agenda List
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-[#8C9AA9] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[40px] px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center justify-center ${
                selectedCategory === cat
                  ? 'bg-[#3A5982] text-white shadow-xs'
                  : 'bg-white text-[#536275] hover:text-[#16212F] border border-[#E2E8F0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          MAIN CALENDAR VIEWPORT (MONTH GRID OR AGENDA)
          ========================================================================= */}
      {viewMode === 'month' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 7-COLUMN MONTH MATRIX (LEFT 8 COLS) */}
          <div className="lg:col-span-8 bg-white rounded-[28px] border border-[#E2E8F0] shadow-sm p-4 sm:p-6 overflow-hidden">
            {/* Weekdays Header */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center text-xs font-bold text-[#8C9AA9] uppercase tracking-wider py-1 border-b border-[#E2E8F0]">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {calendarDays.map((item, idx) => {
                const dayEvents = eventsByDate[item.dateStr] || [];
                const isSelected = selectedDate === item.dateStr;
                const isToday = item.dateStr === '2026-09-18'; // Mock campus reference date

                return (
                  <div
                    key={`${item.dateStr}_${idx}`}
                    onClick={() => {
                      if (item.isCurrentMonth) {
                        setSelectedDate(item.dateStr);
                      }
                    }}
                    className={`min-h-[85px] sm:min-h-[105px] p-1.5 sm:p-2 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                      !item.isCurrentMonth
                        ? 'opacity-35 bg-slate-50/50 border-transparent cursor-default'
                        : isSelected
                        ? 'bg-[#3A5982]/10 border-[#3A5982] shadow-sm ring-2 ring-[#3A5982]/20'
                        : isToday
                        ? 'bg-amber-50/60 border-[#C5A063] hover:border-[#3A5982]'
                        : 'bg-white hover:bg-slate-50/80 border-[#E2E8F0]'
                    }`}
                  >
                    {/* Date Number and Today indicator */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected
                            ? 'bg-[#3A5982] text-white shadow-xs'
                            : isToday
                            ? 'bg-[#C5A063] text-white font-extrabold shadow-xs'
                            : 'text-[#16212F]'
                        }`}
                      >
                        {item.dayNumber}
                      </span>

                      {dayEvents.length > 0 && item.isCurrentMonth && (
                        <span className="text-[10px] font-bold text-[#3A5982] bg-[#3A5982]/15 px-1.5 rounded-full">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>

                    {/* Event indicators / chips inside cell */}
                    <div className="space-y-1 mt-1 overflow-hidden">
                      {dayEvents.slice(0, 2).map((evt) => (
                        <div
                          key={evt.id}
                          className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold truncate bg-[#16212F] text-white leading-tight"
                          title={evt.title}
                        >
                          {evt.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="text-[9px] font-bold text-[#8C9AA9] block leading-none pl-1">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DAY AGENDA INSPECTOR PANEL (RIGHT 4 COLS) */}
          <div className="lg:col-span-4 bg-white rounded-[28px] border border-[#E2E8F0] shadow-sm p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#C5A063] uppercase tracking-wider">
                  SELECTED DAY SCHEDULE
                </span>
                <h3 className="text-base sm:text-lg font-black text-[#16212F]">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#3A5982]/10 text-[#3A5982] text-xs font-bold">
                {selectedDateEvents.length} Event{selectedDateEvents.length !== 1 ? 's' : ''}
              </span>
            </div>

            {selectedDateEvents.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-[#8C9AA9]">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-[#16212F]">No events scheduled for this day</p>
                <p className="text-[11px] text-[#8C9AA9] max-w-[200px] mx-auto">
                  Select another day marked with event tags to view sessions, timings, and reserve seats.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateEvents.map((evt) => {
                  const isUserRegistered = registrations.some(
                    (r) => r.eventId === evt.id && r.studentId === studentUser?.id && r.status !== 'Cancelled'
                  );
                  const spotsRemaining = Math.max(0, evt.capacity - evt.registeredCount);

                  return (
                    <div
                      key={evt.id}
                      className="p-4 rounded-2xl border border-[#E2E8F0] bg-slate-50/50 hover:bg-slate-50 space-y-3 transition-all group"
                    >
                      {/* Top row: category & seats */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#3A5982] text-white">
                          {evt.category}
                        </span>
                        {isUserRegistered ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-[#8C9AA9]">
                            {spotsRemaining} seats remaining
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4
                        onClick={() => onSelectEvent(evt)}
                        className="text-sm font-bold text-[#16212F] hover:text-[#3A5982] cursor-pointer leading-snug line-clamp-2"
                      >
                        {evt.title}
                      </h4>

                      {/* Time & Venue */}
                      <div className="space-y-1 text-[11px] text-[#536275]">
                        <p className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#3A5982] shrink-0" />
                          <span>{evt.time}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">{evt.venue}</span>
                        </p>
                      </div>

                      {/* Interactive Buttons */}
                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#E2E8F0]">
                        <button
                          onClick={() => handleRegisterClick(evt)}
                          className={`min-h-[40px] px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                            isUserRegistered
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-[#3A5982] hover:bg-[#2D476C] text-white shadow-xs'
                          }`}
                        >
                          {isUserRegistered ? 'View My Pass' : 'Register Now'}
                        </button>

                        <div className="flex items-center gap-1">
                          {/* Add to Google Calendar */}
                          <a
                            href={createGoogleCalendarUrl(evt)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Add to Google Calendar"
                            className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-[#536275] hover:text-[#16212F] hover:bg-slate-200 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          {/* Download .ics */}
                          <button
                            onClick={() => downloadIcsFile(evt)}
                            title="Download .ics Calendar File"
                            className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-[#536275] hover:text-[#16212F] hover:bg-slate-200 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* AGENDA LIST VIEW */
        <div className="bg-white rounded-[28px] border border-[#E2E8F0] shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <h3 className="text-lg font-bold text-[#16212F]">All Upcoming Campus Events</h3>
            <span className="text-xs text-[#8C9AA9]">Showing {filteredEvents.length} events</span>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {filteredEvents.map((evt) => {
              const isUserRegistered = registrations.some(
                (r) => r.eventId === evt.id && r.studentId === studentUser?.id && r.status !== 'Cancelled'
              );

              return (
                <div
                  key={evt.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#3A5982] text-white">
                        {evt.category}
                      </span>
                      <span className="text-xs font-bold text-[#C5A063]">
                        {new Date(evt.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="text-xs text-[#8C9AA9]">• {evt.time}</span>
                    </div>

                    <h4
                      onClick={() => onSelectEvent(evt)}
                      className="text-base font-bold text-[#16212F] group-hover:text-[#3A5982] cursor-pointer"
                    >
                      {evt.title}
                    </h4>

                    <p className="text-xs text-[#536275] line-clamp-1">{evt.subtitle || evt.description}</p>
                    <p className="text-xs text-[#8C9AA9] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500" /> {evt.venue}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => handleRegisterClick(evt)}
                      className={`min-h-[44px] px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                        isUserRegistered
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-[#3A5982] hover:bg-[#2D476C] text-white shadow-xs'
                      }`}
                    >
                      {isUserRegistered ? 'View My Pass' : 'Register Now'}
                    </button>

                    <a
                      href={createGoogleCalendarUrl(evt)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-[#16212F] transition-colors"
                      title="Add to Google Calendar"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppleCard } from '../common/AppleCard';
import { AppleButton } from '../common/AppleButton';
import { AdminNavTab } from '../navigation/AdminSidebar';
import { FeaturedShowcaseEditor } from './FeaturedShowcaseEditor';
import { EventItem } from '../../types';
import { 
  Calendar, 
  Users, 
  Megaphone, 
  Award, 
  TrendingUp, 
  Plus, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  QrCode,
  Edit3,
  X,
  Check,
  Sparkles
} from 'lucide-react';

interface AdminDashboardOverviewProps {
  onNavigateTab: (tab: AdminNavTab) => void;
  onOpenCreateEvent: () => void;
  onOpenCreateAnnouncement: () => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  onNavigateTab,
  onOpenCreateEvent,
  onOpenCreateAnnouncement,
}) => {
  const { events, registrations, announcements, certificates, attendanceRecords, adminUser, updateEvent, showToast } = useApp();

  // Quick edit modal for campus event dates & details
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editVenue, setEditVenue] = useState('');
  const [editCapacity, setEditCapacity] = useState<number>(100);
  const [editTitle, setEditTitle] = useState('');

  const openQuickEditEvent = (evt: EventItem) => {
    setEditingEvent(evt);
    setEditDate(evt.date);
    setEditTime(evt.time);
    setEditVenue(evt.venue);
    setEditCapacity(evt.capacity);
    setEditTitle(evt.title);
  };

  const handleSaveQuickEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    updateEvent(editingEvent.id, {
      title: editTitle,
      date: editDate,
      time: editTime,
      venue: editVenue,
      capacity: editCapacity,
    });

    showToast('Event Schedule Updated', `Date and logistics for "${editTitle}" have been saved.`, 'success');
    setEditingEvent(null);
  };

  const publishedEvents = events.filter((e) => e.status === 'Published');
  const totalRegistrations = registrations.filter((r) => r.status !== 'Cancelled').length;
  const attendedCount = registrations.filter((r) => r.status === 'Attended').length;
  const attendanceRate = totalRegistrations > 0 
    ? Math.round((attendedCount / totalRegistrations) * 100) 
    : 84;

  const activeAnnouncements = announcements.length;
  const totalCertificatesIssued = certificates.length;

  // Recent activity logs
  const recentActivities = [
    { id: '1', text: 'Registration confirmed for Aarav Sharma (2447101) in Ignite Talk Series', time: '10 mins ago', type: 'reg' },
    { id: '2', text: 'Dr. Mathew K. Varghese published official circular on Auditorium entry guidelines', time: '1 hour ago', type: 'ann' },
    { id: '3', text: 'Bulk certificates issued for Western Acoustic Championship (18 recipients)', time: '3 hours ago', type: 'cert' },
    { id: '4', text: 'Banner added to Homepage Carousel: Darpan 2026 Extravaganza', time: 'Yesterday', type: 'evt' },
    { id: '5', text: 'Attendance marked for 45 volunteers in Daksha Rural Outreach drive', time: '2 days ago', type: 'att' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100/80 dark:border-emerald-800/40 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Authenticated SWO Staff Session
            </span>
            <span className="text-xs text-[#86868B] dark:text-slate-400">Yeshwanthpur Campus SWO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] dark:text-white tracking-tight mt-1">
            Student Welfare Office Overview
          </h2>
          <p className="text-sm text-[#86868B] dark:text-slate-400 mt-0.5">
            Real-time event registries, student footfalls, certificate dispatches, and campus welfare controls.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <AppleButton
            variant="secondary"
            size="sm"
            icon={<Megaphone className="w-4 h-4 text-orange-600" />}
            onClick={onOpenCreateAnnouncement}
          >
            Post Notice
          </AppleButton>
          <AppleButton
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={onOpenCreateEvent}
          >
            New Event
          </AppleButton>
        </div>
      </div>

      {/* FEATURED GUESTS & HOMEPAGE BANNER SHOWCASE MANAGER (REQUESTED FEATURE) */}
      <FeaturedShowcaseEditor />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <AppleCard padding="sm" className="flex flex-col justify-between dark:bg-[#141A26] dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#86868B] dark:text-slate-400 uppercase tracking-wider">Live Events</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100/70 dark:border-blue-900/40 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] dark:text-white tracking-tight">{publishedEvents.length}</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">Across 6 disciplines</p>
          </div>
        </AppleCard>

        {/* KPI 2 */}
        <AppleCard padding="sm" className="flex flex-col justify-between dark:bg-[#141A26] dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#86868B] dark:text-slate-400 uppercase tracking-wider">Registrations</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100/70 dark:border-emerald-900/40 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] dark:text-white tracking-tight">{totalRegistrations}</p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1">+24% vs last month</p>
          </div>
        </AppleCard>

        {/* KPI 3 */}
        <AppleCard padding="sm" className="flex flex-col justify-between dark:bg-[#141A26] dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#86868B] dark:text-slate-400 uppercase tracking-wider">Attendance Rate</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100/70 dark:border-purple-900/40 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] dark:text-white tracking-tight">{attendanceRate}%</p>
            <p className="text-[11px] text-[#86868B] dark:text-slate-400 font-medium mt-1">Checked in at gates</p>
          </div>
        </AppleCard>

        {/* KPI 4 */}
        <AppleCard padding="sm" className="flex flex-col justify-between dark:bg-[#141A26] dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#86868B] dark:text-slate-400 uppercase tracking-wider">Certificates</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100/70 dark:border-amber-900/40 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] dark:text-white tracking-tight">{totalCertificatesIssued}</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">E-signed & pushed</p>
          </div>
        </AppleCard>

        {/* KPI 5 */}
        <AppleCard padding="sm" className="col-span-2 lg:col-span-1 flex flex-col justify-between dark:bg-[#141A26] dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#86868B] dark:text-slate-400 uppercase tracking-wider">Circulars</span>
            <div className="w-9 h-9 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-100/70 dark:border-orange-900/40 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] dark:text-white tracking-tight">{activeAnnouncements}</p>
            <p className="text-[11px] text-[#86868B] dark:text-slate-400 font-medium mt-1">Campus-wide broadcast</p>
          </div>
        </AppleCard>
      </div>

      {/* Main Content Split: Upcoming Events Live Status & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events Management Radar (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#1D1D1F] dark:text-white tracking-tight">
                Active Event Registrations
              </h3>
              <p className="text-xs text-[#86868B] dark:text-slate-400">
                Click "Edit Details & Dates" on any event to update dates, capacity, or venue.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('events')}
              className="text-xs font-semibold text-[#0071E3] dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Manage All Events <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {events.slice(0, 5).map((evt) => {
              const fillPct = Math.min(100, Math.round((evt.registeredCount / evt.capacity) * 100));

              return (
                <AppleCard
                  key={evt.id}
                  padding="sm"
                  className="border border-black/[0.06] dark:border-white/10 dark:bg-[#141A26] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={evt.bannerUrl}
                      alt={evt.title}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#002147]/10 dark:bg-white/10 text-[#002147] dark:text-white">
                          {evt.category}
                        </span>
                        {evt.inCarousel && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFD60A]/20 text-[#B78103] dark:text-[#FFD60A]">
                            Carousel (Rank #{evt.carouselOrder})
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-[#1D1D1F] dark:text-white truncate mt-0.5">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-[#86868B] dark:text-slate-400 flex items-center gap-1.5 truncate">
                        <Calendar className="w-3 h-3 text-[#3A5982] dark:text-blue-400 shrink-0" />
                        <span className="font-semibold text-[#16212F] dark:text-slate-200">{evt.date}</span>
                        <span>•</span>
                        <MapPin className="w-3 h-3 text-[#FF3B30] shrink-0" /> {evt.venue}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                    <div className="w-32 sm:w-36 text-xs">
                      <div className="flex items-center justify-between text-[#86868B] dark:text-slate-400 mb-1">
                        <span>Bookings</span>
                        <span className="font-semibold text-[#1D1D1F] dark:text-white">
                          {evt.registeredCount} / {evt.capacity}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-black/[0.06] dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0071E3] rounded-full"
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openQuickEditEvent(evt)}
                      className="p-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/10 text-[#16212F] dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-colors flex items-center gap-1"
                      title="Edit Date, Time & Venue for this event"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Edit Dates</span>
                    </button>
                  </div>
                </AppleCard>
              );
            })}
          </div>
        </div>

        {/* Live Directorate Activity Feed (1 column) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1D1D1F] dark:text-white tracking-tight">
              Activity Stream
            </h3>
            <span className="text-xs text-[#34C759] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-ping" /> Live
            </span>
          </div>

          <AppleCard padding="sm" className="border border-black/[0.06] dark:border-white/10 dark:bg-[#141A26] space-y-4">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-start gap-3 pb-3 border-b border-black/[0.04] dark:border-white/5 last:border-0 last:pb-0">
                <div className="w-7 h-7 rounded-xl bg-black/[0.03] dark:bg-white/5 flex items-center justify-center text-[#0071E3] shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-[#1D1D1F] dark:text-slate-200 leading-snug font-medium">
                    {act.text}
                  </p>
                  <span className="text-[10px] text-[#86868B] dark:text-slate-400 mt-0.5 block">{act.time}</span>
                </div>
              </div>
            ))}
          </AppleCard>

          {/* Quick Scanner Shortcut */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#002147] to-[#0A2540] text-white space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase">
              <QrCode className="w-4 h-4 text-[#FFD60A]" /> Fast Gate Check-In
            </div>
            <h4 className="text-sm font-bold">Launch Auditorium Gate Scanner</h4>
            <p className="text-xs text-white/80">
              Check in registered students via camera or optical smartcard barcode reader.
            </p>
            <div className="pt-2">
              <AppleButton
                variant="gold"
                size="sm"
                className="w-full text-xs"
                onClick={() => onNavigateTab('attendance')}
              >
                Open Gate Check-In
              </AppleButton>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK EVENT DATES & DETAILS MODAL */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141A26] border border-gray-200 dark:border-white/10 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#3A5982]/10 text-[#3A5982] dark:text-blue-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#16212F] dark:text-white">
                    Modify Event Date & Schedule
                  </h3>
                  <p className="text-xs text-[#536275] dark:text-slate-400">
                    Quickly reschedule or adjust venue for this event.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#16212F] dark:text-white mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-white/15 text-xs text-[#16212F] dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#3A5982]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#16212F] dark:text-white mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    placeholder="e.g. 2026-03-24 or March 24, 2026"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-white/15 text-xs text-[#16212F] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#3A5982]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#16212F] dark:text-white mb-1">
                    Time Window
                  </label>
                  <input
                    type="text"
                    required
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    placeholder="e.g. 10:00 AM - 1:00 PM"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-white/15 text-xs text-[#16212F] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#3A5982]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#16212F] dark:text-white mb-1">
                    Auditorium / Venue
                  </label>
                  <input
                    type="text"
                    required
                    value={editVenue}
                    onChange={(e) => setEditVenue(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-white/15 text-xs text-[#16212F] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#3A5982]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#16212F] dark:text-white mb-1">
                    Seat Capacity
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-white/15 text-xs text-[#16212F] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#3A5982]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-[#3A5982] hover:bg-[#2D476C] text-white shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Update Schedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

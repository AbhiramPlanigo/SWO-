import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Registration, RegistrationStatus } from '../../types';
import { AppleCard } from '../common/AppleCard';
import { AppleButton } from '../common/AppleButton';
import { EmptyState } from '../common/EmptyState';
import { Modal } from '../common/Modal';
import { QRCodeDisplay } from '../common/QRCodeDisplay';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  QrCode, 
  Ticket, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock3, 
  Download,
  Share2,
  Sparkles
} from 'lucide-react';

interface MyRegistrationsViewProps {
  onExploreEvents: () => void;
}

export const MyRegistrationsView: React.FC<MyRegistrationsViewProps> = ({
  onExploreEvents,
}) => {
  const { registrations, cancelRegistration, studentUser } = useApp();

  const [activeTicket, setActiveTicket] = useState<Registration | null>(null);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter registrations for current student
  const studentRegs = registrations.filter((r) => r.studentId === studentUser.id);

  const filteredRegs = studentRegs.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case 'Registered':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#34C759]/15 text-[#248A3D] dark:text-[#34C759] flex items-center gap-1.5 border border-[#34C759]/25 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34C759]"></span>
            </span>
            Active Pass
          </span>
        );
      case 'Attended':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0071E3]/15 text-[#0071E3] flex items-center gap-1 border border-[#0071E3]/20">
            <Sparkles className="w-3.5 h-3.5" /> Attended ✓
          </span>
        );
      case 'Waitlisted':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FF9500]/15 text-[#FF9500] flex items-center gap-1.5 border border-[#FF9500]/25">
            <span className="h-2 w-2 rounded-full bg-[#FF9500] animate-pulse"></span>
            Waitlisted
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/[0.06] dark:bg-white/[0.06] text-[#86868B]">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#34C759]/10 text-[#34C759]">
              Active Passes
            </span>
            <span className="text-xs text-[#86868B]">Student: {studentUser.name}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
            My Event Registrations
          </h2>
          <p className="text-sm text-[#86868B] mt-1">
            View your entry QR tickets, status updates, and venue instructions for registered SWO events.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-black/[0.08] shadow-xs self-start sm:self-auto overflow-x-auto max-w-full no-scrollbar">
          {['all', 'Registered', 'Attended', 'Waitlisted'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`min-h-[38px] px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center justify-center ${
                statusFilter === st ? 'bg-[#002147] text-white font-semibold shadow-xs' : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              {st === 'all' ? 'All' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Registrations List */}
      {filteredRegs.length === 0 ? (
        <EmptyState
          icon={<Ticket className="w-7 h-7" />}
          title="No Registrations Found"
          description="You haven't registered for any events matching this filter. Explore upcoming talk series and campus fests to secure your seat."
          actionLabel="Browse Events"
          onAction={onExploreEvents}
        />
      ) : (
        <div className="space-y-3.5">
          {filteredRegs.map((reg) => {
            const isActive = reg.status === 'Registered';
            return (
              <AppleCard
                key={reg.id}
                hoverEffect
                padding="none"
                className={`relative overflow-hidden p-5 transition-all duration-300 ${
                  isActive
                    ? 'border border-[#0071E3]/25 dark:border-[#2997FF]/30 active-pass-pulse bg-gradient-to-r from-white via-[#F8FAFC] to-white dark:from-[#151D2A] dark:via-[#192436] dark:to-[#151D2A]'
                    : 'border border-black/[0.06] dark:border-white/[0.08]'
                } flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}
              >
                {/* Active Pass Subtle Shimmer & Brand Accent Strip */}
                {isActive && (
                  <>
                    <div className="ticket-shimmer-effect" aria-hidden="true" />
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#0071E3] via-[#34C759] to-[#0071E3] rounded-l-full" />
                  </>
                )}

                <div className="space-y-1.5 min-w-0 z-10 pl-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(reg.status)}
                    <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-md border ${
                      isActive 
                        ? 'text-[#0071E3] dark:text-[#2997FF] bg-[#0071E3]/8 dark:bg-[#0071E3]/20 border-[#0071E3]/20 shadow-2xs' 
                        : 'text-[#86868B] bg-black/[0.03] dark:bg-white/[0.05] border-black/[0.05] dark:border-white/[0.05]'
                    }`}>
                      Ticket: {reg.ticketCode}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#1D1D1F] dark:text-white tracking-tight">
                    {reg.eventTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#515154] dark:text-[#94A3B8]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#0071E3]" />
                      {new Date(reg.eventDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#86868B]" />
                      {reg.eventTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#FF3B30]" />
                      {reg.eventVenue}
                    </span>
                  </div>

                  {reg.customAnswers && Object.keys(reg.customAnswers).length > 0 && (
                    <div className="text-[11px] text-[#86868B] pt-1">
                      Preferences:{' '}
                      {Object.entries(reg.customAnswers)
                        .map(([_, v]) => v)
                        .filter(Boolean)
                        .join(' • ')}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end md:self-center shrink-0 z-10 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/[0.05]">
                  {reg.status !== 'Cancelled' && (
                    <AppleButton
                      variant="primary"
                      size="sm"
                      icon={<QrCode className="w-4 h-4" />}
                      onClick={() => setActiveTicket(reg)}
                      className={isActive ? 'shadow-md shadow-[#0071E3]/15 flex-1 sm:flex-none justify-center' : 'flex-1 sm:flex-none justify-center'}
                    >
                      View QR Pass
                    </AppleButton>
                  )}

                  {reg.status === 'Registered' && (
                    <AppleButton
                      variant="secondary"
                      size="sm"
                      className="text-[#FF3B30] hover:bg-[#FF3B30]/10 flex-1 sm:flex-none justify-center"
                      onClick={() => setCancelTargetId(reg.id)}
                    >
                      Cancel
                    </AppleButton>
                  )}
                </div>
              </AppleCard>
            );
          })}
        </div>
      )}

      {/* Ticket Pass Modal */}
      {activeTicket && (
        <Modal
          isOpen={!!activeTicket}
          onClose={() => setActiveTicket(null)}
          title="Official Event Pass"
          subtitle="Christ University Student Welfare Office"
          maxWidth="md"
        >
          <div className="space-y-6 text-center">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#002147] to-[#0A2540] text-white text-left shadow-lg relative overflow-hidden">
              {/* Subtle metallic sweep animation on active modal pass */}
              <div className="ticket-shimmer-effect opacity-30" aria-hidden="true" />
              <div className="border-b border-white/10 pb-3 mb-3 relative z-10">
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                  ENTRY PASS • YESHWANTHPUR AUDITORIUM
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {activeTicket.eventTitle}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div>
                  <span className="text-[10px] text-white/60 block">Student</span>
                  <span className="font-semibold text-white">{activeTicket.studentName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/60 block">Register Number</span>
                  <span className="font-mono font-bold text-[#FFD60A]">{activeTicket.studentRegNo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/60 block">Date</span>
                  <span className="text-white/90">
                    {new Date(activeTicket.eventDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-white/60 block">Venue</span>
                  <span className="text-white/90 truncate block">{activeTicket.eventVenue}</span>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="p-4 rounded-2xl bg-white text-[#1D1D1F] flex flex-col items-center justify-center shadow-inner">
                <div className="p-1">
                  <QRCodeDisplay
                    value={activeTicket.ticketCode}
                    size={140}
                    fgColor="#002147"
                    centerLogo={true}
                  />
                </div>
                <p className="font-mono text-xs font-bold tracking-wider text-[#002147] mt-1">
                  {activeTicket.ticketCode}
                </p>
                <p className="text-[10px] text-[#86868B] mt-0.5">
                  Valid for 1 Student • Check-In Active
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <AppleButton
                variant="secondary"
                size="md"
                icon={<Download className="w-4 h-4" />}
                onClick={() => window.print()}
              >
                Print / Save PDF
              </AppleButton>
              <AppleButton
                variant="primary"
                size="md"
                onClick={() => setActiveTicket(null)}
              >
                Close Pass
              </AppleButton>
            </div>
          </div>
        </Modal>
      )}

      {/* Cancel Confirmation Dialog */}
      {cancelTargetId && (
        <Modal
          isOpen={!!cancelTargetId}
          onClose={() => setCancelTargetId(null)}
          title="Cancel Registration?"
          subtitle="Are you sure you want to release your seat for this event?"
          maxWidth="sm"
        >
          <div className="space-y-4 pt-2">
            <p className="text-xs text-[#515154] leading-relaxed">
              Cancelling your registration will immediately release this seat to the next waitlisted student on campus.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <AppleButton
                variant="secondary"
                size="sm"
                onClick={() => setCancelTargetId(null)}
              >
                Keep Seat
              </AppleButton>
              <AppleButton
                variant="danger"
                size="sm"
                onClick={() => {
                  cancelRegistration(cancelTargetId);
                  setCancelTargetId(null);
                }}
              >
                Yes, Cancel Pass
              </AppleButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

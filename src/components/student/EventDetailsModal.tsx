import React from 'react';
import { useApp } from '../../context/AppContext';
import { EventItem } from '../../types';
import { Modal } from '../common/Modal';
import { AppleButton } from '../common/AppleButton';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  UserCheck, 
  HelpCircle,
  ArrowRight,
  Ticket
} from 'lucide-react';

interface EventDetailsModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (event: EventItem) => void;
  onViewTicket?: (ticketCode: string) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  isOpen,
  onClose,
  onRegister,
  onViewTicket,
}) => {
  const { registrations, studentUser } = useApp();

  if (!event) return null;

  const existingRegistration = registrations.find(
    (r) => r.eventId === event.id && r.studentId === studentUser.id && r.status !== 'Cancelled'
  );

  const fillPct = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));
  const isFull = event.registeredCount >= event.capacity;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="space-y-6">
        {/* Banner with Badge Overlay */}
        <div className="relative h-56 sm:h-64 w-full rounded-2xl overflow-hidden bg-slate-100 -mt-2">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#002147] text-white shadow-md">
              {event.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-[#1D1D1F]">
              {event.organizingCommittee}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
              {event.title}
            </h2>
            {event.subtitle && (
              <p className="text-xs sm:text-sm text-white/80 mt-1 line-clamp-1">
                {event.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Existing Registration Alert Pill */}
        {existingRegistration && (
          <div className="p-3.5 rounded-2xl bg-[#34C759]/10 border border-[#34C759]/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#34C759]" />
              <div>
                <p className="text-xs font-bold text-[#1D1D1F]">
                  You are registered for this event!
                </p>
                <p className="text-[11px] text-[#515154]">
                  Ticket Pass: <strong className="font-mono">{existingRegistration.ticketCode}</strong> ({existingRegistration.status})
                </p>
              </div>
            </div>
            {onViewTicket && (
              <AppleButton
                variant="primary"
                size="sm"
                icon={<Ticket className="w-3.5 h-3.5" />}
                onClick={() => {
                  onClose();
                  onViewTicket(existingRegistration.ticketCode);
                }}
              >
                View Pass
              </AppleButton>
            )}
          </div>
        )}

        {/* Schedule, Venue & Eligibility Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-black/[0.02] border border-black/[0.05] space-y-2">
            <div className="flex items-center gap-2 text-[#0071E3] font-semibold">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#515154]">
              <Clock className="w-4 h-4 text-[#86868B]" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-[#515154]">
              <MapPin className="w-4 h-4 text-[#FF3B30]" />
              <span className="font-medium text-[#1D1D1F]">{event.venue}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/[0.02] border border-black/[0.05] space-y-2">
            <div className="flex items-center gap-2 text-[#1D1D1F] font-semibold">
              <UserCheck className="w-4 h-4 text-[#34C759]" />
              <span>Eligibility & Audience</span>
            </div>
            <p className="text-[#515154] leading-relaxed">
              {event.eligibility}
            </p>
            <p className="text-[11px] text-[#86868B]">
              Deadline: {new Date(event.registrationDeadline).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
        </div>

        {/* Event Description */}
        <div>
          <h4 className="text-sm font-bold text-[#1D1D1F] uppercase tracking-wider text-[#86868B] mb-2">
            About This Event
          </h4>
          <p className="text-sm text-[#3A3A3C] leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* Distinguished Speaker / Mentor if present */}
        {event.speaker && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#002147]/5 to-[#0071E3]/5 border border-[#002147]/10 flex items-start gap-4">
            <img
              src={event.speaker.avatar}
              alt={event.speaker.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-sm shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#002147] text-white">
                  Featured Speaker
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#1D1D1F] mt-1">
                {event.speaker.name}
              </h4>
              <p className="text-xs text-[#0071E3] font-medium mt-0.5">
                {event.speaker.role}
              </p>
              <p className="text-xs text-[#515154] mt-1.5 leading-relaxed">
                {event.speaker.bio}
              </p>
            </div>
          </div>
        )}

        {/* Capacity Progress */}
        <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.05]">
          <div className="flex items-center justify-between text-xs text-[#86868B] mb-2">
            <span className="flex items-center gap-1.5 font-medium text-[#1D1D1F]">
              <Users className="w-4 h-4 text-[#0071E3]" /> Registration Capacity
            </span>
            <span className="font-semibold text-[#1D1D1F]">
              {event.registeredCount} booked of {event.capacity} seats ({fillPct}%)
            </span>
          </div>
          <div className="w-full h-2 bg-black/[0.06] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                fillPct > 90 ? 'bg-[#FF3B30]' : fillPct > 70 ? 'bg-[#FF9500]' : 'bg-[#0071E3]'
              }`}
              style={{ width: `${fillPct}%` }}
            />
          </div>
          {isFull && (
            <p className="text-[11px] text-[#FF9500] font-medium mt-2 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> All standard seats allocated. New registrations will be automatically placed on the waitlist.
            </p>
          )}
        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-black/[0.05] flex items-center justify-between gap-3">
          <AppleButton variant="secondary" size="md" onClick={onClose}>
            Close
          </AppleButton>

          {!existingRegistration ? (
            <AppleButton
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => {
                onClose();
                onRegister(event);
              }}
            >
              {isFull ? 'Join Priority Waitlist' : 'Proceed to Registration'}
            </AppleButton>
          ) : (
            <span className="text-xs text-[#34C759] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Registration Active
            </span>
          )}
        </div>
      </div>
    </Modal>
  );
};

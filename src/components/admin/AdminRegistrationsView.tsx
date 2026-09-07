import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Registration, RegistrationStatus } from '../../types';
import { AppleCard } from '../common/AppleCard';
import { AppleButton } from '../common/AppleButton';
import { EmptyState } from '../common/EmptyState';
import { AppleSkeletonStat, AppleSkeletonTable } from '../common/AppleSkeleton';
import { QRCodeDisplay } from '../common/QRCodeDisplay';
import { Modal } from '../common/Modal';
import { 
  Users, 
  Search, 
  Download, 
  Filter, 
  CheckCircle2, 
  Clock3, 
  XCircle, 
  Sparkles,
  Ticket,
  Mail,
  GraduationCap
} from 'lucide-react';

export const AdminRegistrationsView: React.FC = () => {
  const { registrations, events, updateRegistrationStatus } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [inspectPass, setInspectPass] = useState<Registration | null>(null);

  // Trigger quick skeleton animation on filter change
  const handleEventFilterChange = (id: string) => {
    setIsLoading(true);
    setSelectedEventId(id);
    setTimeout(() => setIsLoading(false), 350);
  };

  const handleStatusFilterChange = (st: string) => {
    setIsLoading(true);
    setSelectedStatus(st);
    setTimeout(() => setIsLoading(false), 300);
  };

  // Filter registrations
  const filteredRegistrations = registrations.filter((r) => {
    if (selectedEventId !== 'all' && r.eventId !== selectedEventId) return false;
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = r.studentName.toLowerCase().includes(q);
      const matchesReg = r.studentRegNo.toLowerCase().includes(q);
      const matchesDept = r.studentDept.toLowerCase().includes(q);
      const matchesTicket = r.ticketCode.toLowerCase().includes(q);
      const matchesEvent = r.eventTitle.toLowerCase().includes(q);
      if (!matchesName && !matchesReg && !matchesDept && !matchesTicket && !matchesEvent) {
        return false;
      }
    }
    return true;
  });

  // Export CSV Functionality
  const handleExportCSV = () => {
    const headers = [
      'Registration ID',
      'Student Name',
      'Register Number',
      'Email',
      'Department',
      'Event Title',
      'Ticket Code',
      'Status',
      'Registered At',
    ];

    const rows = filteredRegistrations.map((r) => [
      `"${r.id}"`,
      `"${r.studentName}"`,
      `"${r.studentRegNo}"`,
      `"${r.studentEmail}"`,
      `"${r.studentDept}"`,
      `"${r.eventTitle}"`,
      `"${r.ticketCode}"`,
      `"${r.status}"`,
      `"${r.registeredAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SWO_Registrations_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#34C759]/10 text-[#34C759]">
              Attendee Roster
            </span>
            <span className="text-xs text-[#86868B]">Yeshwanthpur Campus SWO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
            Registration & Waitlist Controls
          </h2>
          <p className="text-sm text-[#86868B] mt-1">
            Audit student applications, promote waitlisted attendees, manage tickets, and export verified rosters.
          </p>
        </div>

        <AppleButton
          variant="secondary"
          size="sm"
          icon={<Download className="w-4 h-4 text-[#0071E3]" />}
          onClick={handleExportCSV}
          disabled={filteredRegistrations.length === 0}
        >
          Export CSV ({filteredRegistrations.length})
        </AppleButton>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative sm:col-span-1">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student, reg no, or ticket..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-black/[0.08] text-xs text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 shadow-xs"
          />
        </div>

        {/* Event Select Filter */}
        <div>
          <select
            value={selectedEventId}
            onChange={(e) => handleEventFilterChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-full bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 shadow-xs"
          >
            <option value="all">All Events ({events.length})</option>
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title}
              </option>
            ))}
          </select>
        </div>

        {/* Status Select Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-full bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 shadow-xs"
          >
            <option value="all">All Statuses</option>
            <option value="Registered">Registered</option>
            <option value="Waitlisted">Waitlisted</option>
            <option value="Attended">Attended</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Registrations List Table */}
      {isLoading ? (
        <AppleSkeletonTable rows={6} />
      ) : filteredRegistrations.length === 0 ? (
        <EmptyState
          icon={<Users className="w-7 h-7" />}
          title="No Registrations Found"
          description="No student passes match the active search and filter combinations."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedEventId('all');
            setSelectedStatus('all');
          }}
        />
      ) : (
        <AppleCard padding="none" className="border border-black/[0.06] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/[0.02] border-b border-black/[0.06] text-[#86868B] font-semibold">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Register No</th>
                <th className="p-4">Program & Event</th>
                <th className="p-4">Ticket Pass</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {filteredRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-black/[0.015] transition-colors">
                  {/* Student */}
                  <td className="p-4">
                    <p className="font-bold text-[#1D1D1F]">{reg.studentName}</p>
                    <p className="text-[11px] text-[#86868B] truncate max-w-[180px]">{reg.studentEmail}</p>
                  </td>

                  {/* Reg No & Dept */}
                  <td className="p-4">
                    <span className="font-mono font-semibold text-[#0071E3] block">{reg.studentRegNo}</span>
                    <span className="text-[11px] text-[#86868B]">{reg.studentDept}</span>
                  </td>

                  {/* Event */}
                  <td className="p-4">
                    <p className="font-semibold text-[#1D1D1F] line-clamp-1 max-w-xs">{reg.eventTitle}</p>
                    <p className="text-[11px] text-[#86868B]">{reg.eventVenue}</p>
                  </td>

                  {/* Ticket */}
                  <td className="p-4">
                    <button
                      onClick={() => setInspectPass(reg)}
                      className="px-2 py-1 rounded-md bg-black/[0.04] hover:bg-[#0071E3]/10 text-[#0071E3] font-mono font-bold transition-colors flex items-center gap-1.5"
                      title="Inspect Pass QR Code"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>{reg.ticketCode}</span>
                    </button>
                  </td>

                  {/* Status Dropdown */}
                  <td className="p-4">
                    <select
                      value={reg.status}
                      onChange={(e) => updateRegistrationStatus(reg.id, e.target.value as RegistrationStatus)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border focus:outline-none ${
                        reg.status === 'Registered'
                          ? 'bg-[#34C759]/15 text-[#28A745] border-[#34C759]/30'
                          : reg.status === 'Attended'
                          ? 'bg-[#0071E3]/15 text-[#0071E3] border-[#0071E3]/30'
                          : reg.status === 'Waitlisted'
                          ? 'bg-[#FF9500]/15 text-[#FF9500] border-[#FF9500]/30'
                          : 'bg-black/[0.05] text-[#86868B] border-black/[0.1]'
                      }`}
                    >
                      <option value="Registered">Registered</option>
                      <option value="Waitlisted">Waitlisted</option>
                      <option value="Attended">Attended</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* Quick Action */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setInspectPass(reg)}
                        className="p-1.5 rounded-lg text-[#0071E3] hover:bg-[#0071E3]/10 transition-colors"
                        title="View Official QR Ticket"
                      >
                        <Ticket className="w-4 h-4" />
                      </button>
                      {reg.status !== 'Attended' && (
                        <AppleButton
                          variant="secondary"
                          size="sm"
                          className="text-[11px] py-1 px-2.5"
                          onClick={() => updateRegistrationStatus(reg.id, 'Attended')}
                        >
                          Check In
                        </AppleButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AppleCard>
      )}

      {/* Pass Inspection Modal with Real QR Code */}
      {inspectPass && (
        <Modal
          isOpen={!!inspectPass}
          onClose={() => setInspectPass(null)}
          title="Verified Attendance Pass"
          subtitle="Christ University Student Welfare Office"
          maxWidth="sm"
        >
          <div className="space-y-4 text-center py-2">
            <div className="p-5 rounded-3xl bg-[#002147] text-white space-y-3 shadow-lg">
              <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase">
                Gate Entry Verification Pass
              </span>
              <h4 className="text-base font-extrabold leading-snug">{inspectPass.eventTitle}</h4>
              
              <div className="p-3 bg-white rounded-2xl inline-block shadow-inner">
                <QRCodeDisplay
                  value={inspectPass.ticketCode}
                  size={150}
                  fgColor="#002147"
                  centerLogo={true}
                />
              </div>

              <div className="text-xs space-y-0.5">
                <p className="font-mono font-bold text-[#FFD60A] text-sm">{inspectPass.ticketCode}</p>
                <p className="font-bold text-sm">{inspectPass.studentName}</p>
                <p className="text-white/70 font-mono text-[11px]">{inspectPass.studentRegNo} • {inspectPass.studentDept}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <AppleButton variant="secondary" size="sm" onClick={() => window.print()}>
                Print Pass
              </AppleButton>
              <AppleButton variant="primary" size="sm" onClick={() => setInspectPass(null)}>
                Done
              </AppleButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

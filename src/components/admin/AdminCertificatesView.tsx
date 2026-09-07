import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Certificate, CertificateType } from '../../types';
import { AppleCard } from '../common/AppleCard';
import { AppleButton } from '../common/AppleButton';
import { Modal } from '../common/Modal';
import { ChristLogo } from '../common/ChristLogo';
import { EmptyState } from '../common/EmptyState';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Send, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  Search, 
  Calendar,
  Layers
} from 'lucide-react';

export const AdminCertificatesView: React.FC = () => {
  const { events, registrations, certificates, bulkGenerateCertificates, adminUser } = useApp();

  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [certType, setCertType] = useState<CertificateType>('Participation');
  const [authorizedBy, setAuthorizedBy] = useState('Dr. Mathew K. Varghese');
  const [designation, setDesignation] = useState('Director, Student Welfare Office');
  const [searchIssued, setSearchIssued] = useState('');
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const [generationNotice, setGenerationNotice] = useState<string | null>(null);

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];

  // Eligible attendees for selected event
  const eligibleAttendees = registrations.filter(
    (r) => r.eventId === currentEvent?.id && r.status === 'Attended'
  );

  const handleBulkGenerate = () => {
    if (!currentEvent) return;

    if (eligibleAttendees.length === 0) {
      alert('No attendees marked as "Attended" for this event yet. Please mark attendance at gates first!');
      return;
    }

    bulkGenerateCertificates(currentEvent.id, certType, authorizedBy, designation);

    // Confetti
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#AF52DE', '#0071E3', '#C59B27'],
    });

    setGenerationNotice(
      `Successfully generated and pushed ${eligibleAttendees.length} verified certificates to students' portals!`
    );

    setTimeout(() => {
      setGenerationNotice(null);
    }, 5000);
  };

  const filteredIssued = certificates.filter((c) => {
    if (!searchIssued.trim()) return true;
    const q = searchIssued.toLowerCase();
    return (
      c.studentName.toLowerCase().includes(q) ||
      c.studentRegNo.toLowerCase().includes(q) ||
      c.certificateNo.toLowerCase().includes(q) ||
      c.eventTitle.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#AF52DE]/10 text-[#AF52DE]">
              Credential Dispatch Engine
            </span>
            <span className="text-xs text-[#86868B]">Yeshwanthpur Campus SWO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
            Certificate Generation & Issuance
          </h2>
          <p className="text-sm text-[#86868B] mt-1">
            Design, sign, and bulk-dispatch tamper-proof digital certificates directly into students' individual portals.
          </p>
        </div>
      </div>

      {/* Generation Console (Split Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config Form (1 Col) */}
        <AppleCard padding="lg" className="border border-black/[0.06] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#002147] uppercase tracking-wider">
            <Award className="w-4 h-4 text-[#AF52DE]" /> Bulk Dispatch Pipeline
          </div>

          <div>
            <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Select Event *</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs font-medium text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Credential Type *</label>
            <select
              value={certType}
              onChange={(e) => setCertType(e.target.value as CertificateType)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs font-medium text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20"
            >
              <option value="Participation">Certificate of Participation</option>
              <option value="Merit">Certificate of Merit</option>
              <option value="Winner">Certificate of Winner (1st / 2nd / 3rd)</option>
              <option value="Excellence">Certificate of Excellence</option>
              <option value="Organizing Committee">Certificate of Organizing Committee</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Authorized Signatory *</label>
            <input
              type="text"
              value={authorizedBy}
              onChange={(e) => setAuthorizedBy(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Signatory Title *</label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20"
            />
          </div>

          {/* Eligible Count Pill */}
          <div className="p-3 rounded-xl bg-black/[0.02] border border-black/[0.05] flex items-center justify-between text-xs">
            <span className="text-[#86868B]">Verified Attendees:</span>
            <span className="font-bold text-[#28A745] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {eligibleAttendees.length} students
            </span>
          </div>

          {generationNotice && (
            <div className="p-3 rounded-xl bg-[#34C759]/10 border border-[#34C759]/30 text-xs text-[#28A745] flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{generationNotice}</span>
            </div>
          )}

          <div className="pt-2">
            <AppleButton
              variant="primary"
              size="md"
              className="w-full text-xs"
              icon={<Send className="w-4 h-4" />}
              onClick={handleBulkGenerate}
            >
              Sign & Bulk Dispatch ({eligibleAttendees.length})
            </AppleButton>
          </div>
        </AppleCard>

        {/* Live Template Preview (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#86868B]">
              Real-time Output Preview
            </h3>
            <span className="text-xs text-[#86868B]">Official Christ University Format</span>
          </div>

          {/* Certificate Miniature Frame */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-white border-4 border-[#002147] shadow-sm text-center space-y-3 overflow-hidden select-none">
            <div className="absolute inset-2 border border-[#C59B27]/40 pointer-events-none rounded-xl" />
            
            <div className="flex flex-col items-center">
              <ChristLogo size="md" showText={false} />
              <h4 className="text-base sm:text-lg font-serif font-extrabold uppercase tracking-wider text-[#002147] mt-1">
                CHRIST (Deemed to be University)
              </h4>
              <p className="text-[10px] tracking-widest text-[#C59B27] uppercase">
                Yeshwanthpur Campus, Bengaluru
              </p>
            </div>

            <div>
              <p className="text-lg sm:text-xl font-serif italic font-bold text-[#002147]">
                Certificate of {certType}
              </p>
              <p className="text-[10px] text-[#86868B] uppercase tracking-wider mt-0.5">
                Conferred upon verified participant
              </p>
            </div>

            <div className="py-2">
              <h5 className="text-base sm:text-lg font-bold text-[#1D1D1F] border-b border-[#002147]/20 inline-block px-6">
                [Student Full Name]
              </h5>
              <p className="text-[11px] text-[#515154] mt-1">
                Register Number: <span className="font-mono font-bold text-[#002147]">[244XXXX]</span>
              </p>
            </div>

            <p className="text-xs text-[#515154] max-w-md mx-auto leading-relaxed">
              for active and verified attendance in <strong className="text-[#002147]">{currentEvent?.title || 'Campus Event'}</strong> conducted by the Student Welfare Office on {currentEvent?.date}.
            </p>

            {/* Signature row */}
            <div className="pt-4 border-t border-black/[0.06] grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-serif italic text-[#002147]">Fr. Lijo P. Thomas</p>
                <p className="text-[10px] text-[#86868B]">Director, Yeshwanthpur</p>
              </div>
              <div>
                <p className="font-serif italic text-[#002147]">{authorizedBy}</p>
                <p className="text-[10px] text-[#86868B]">{designation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Already Dispatched Certificates Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-[#1D1D1F] tracking-tight">
            Issued Credentials Registry ({certificates.length})
          </h3>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#86868B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search issued certificates..."
              value={searchIssued}
              onChange={(e) => setSearchIssued(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 shadow-xs"
            />
          </div>
        </div>

        <AppleCard padding="none" className="border border-black/[0.06] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/[0.02] border-b border-black/[0.06] text-[#86868B] font-semibold">
              <tr>
                <th className="p-3.5">Certificate ID</th>
                <th className="p-3.5">Recipient</th>
                <th className="p-3.5">Register No</th>
                <th className="p-3.5">Event Title</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Issued Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {filteredIssued.map((c) => (
                <tr key={c.id} className="hover:bg-black/[0.01]">
                  <td className="p-3.5 font-mono font-bold text-[#0071E3]">{c.certificateNo}</td>
                  <td className="p-3.5 font-bold text-[#1D1D1F]">{c.studentName}</td>
                  <td className="p-3.5 font-mono text-[#515154]">{c.studentRegNo}</td>
                  <td className="p-3.5 text-[#515154] max-w-xs truncate">{c.eventTitle}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#AF52DE]/15 text-[#AF52DE]">
                      {c.type}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#86868B]">{c.issuedDate}</td>
                  <td className="p-3.5 text-right">
                    <AppleButton
                      variant="secondary"
                      size="sm"
                      className="text-[10px] py-1 px-2.5"
                      onClick={() => setPreviewCert(c)}
                    >
                      View
                    </AppleButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AppleCard>
      </div>

      {/* Certificate Modal */}
      {previewCert && (
        <Modal
          isOpen={!!previewCert}
          onClose={() => setPreviewCert(null)}
          title={`Certificate: ${previewCert.certificateNo}`}
          subtitle={`${previewCert.studentName} • ${previewCert.eventTitle}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-center">
            <div className="p-6 rounded-2xl bg-black/[0.02] border border-black/[0.06] text-xs space-y-2">
              <p className="font-bold text-sm text-[#1D1D1F]">{previewCert.eventTitle}</p>
              <p className="text-[#515154]">Awarded to <strong>{previewCert.studentName}</strong> ({previewCert.studentRegNo})</p>
              <p className="text-[11px] text-[#86868B]">Authorized by {previewCert.authorizedBy} ({previewCert.designation})</p>
            </div>

            <div className="flex justify-end pt-2">
              <AppleButton
                variant="primary"
                size="sm"
                onClick={() => setPreviewCert(null)}
              >
                Close
              </AppleButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

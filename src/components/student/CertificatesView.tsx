import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Certificate } from '../../types';
import { AppleCard } from '../common/AppleCard';
import { AppleButton } from '../common/AppleButton';
import { EmptyState } from '../common/EmptyState';
import { Modal } from '../common/Modal';
import { ChristLogo } from '../common/ChristLogo';
import { 
  Award, 
  Download, 
  Printer, 
  ExternalLink, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  QrCode
} from 'lucide-react';

interface CertificatesViewProps {
  onExploreEvents: () => void;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ onExploreEvents }) => {
  const { certificates, studentUser } = useApp();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  // Filter certificates for current student
  const studentCerts = certificates.filter(
    (c) => c.studentRegNo === studentUser.regNo || c.studentName.toLowerCase().includes(studentUser.name.toLowerCase().split(' ')[0])
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#AF52DE]/10 text-[#AF52DE]">
              Digital Credentials
            </span>
            <span className="text-xs text-[#86868B]">Yeshwanthpur Campus SWO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
            My Earned Certificates
          </h2>
          <p className="text-sm text-[#86868B] mt-1">
            Tamper-proof digital certificates authorized by the Student Welfare Office with unique cryptographic verification codes.
          </p>
        </div>

        <span className="text-xs text-[#86868B] font-medium self-start sm:self-auto">
          {studentCerts.length} Verified Credentials Available
        </span>
      </div>

      {/* Certificates Grid */}
      {studentCerts.length === 0 ? (
        <EmptyState
          icon={<Award className="w-7 h-7" />}
          title="No Certificates Issued Yet"
          description="Certificates are published directly to your portal once event attendance is marked and validated by SWO organizers."
          actionLabel="Browse Upcoming Events"
          onAction={onExploreEvents}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {studentCerts.map((cert) => (
            <AppleCard
              key={cert.id}
              hoverEffect
              padding="none"
              className="border border-black/[0.06] overflow-hidden flex flex-col justify-between"
            >
              {/* Certificate Preview Card Header */}
              <div className="p-6 bg-gradient-to-b from-[#002147]/5 via-white to-white border-b border-black/[0.05]">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#002147] text-white">
                    {cert.type}
                  </span>
                  <span className="text-[10px] font-mono text-[#86868B]">
                    {cert.certificateNo}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#1D1D1F] tracking-tight line-clamp-2">
                  {cert.eventTitle}
                </h3>
                <p className="text-xs text-[#0071E3] font-medium mt-1">
                  Presented to {cert.studentName}
                </p>
              </div>

              {/* Card Details & Actions */}
              <div className="p-5 space-y-4">
                <div className="space-y-1 text-xs text-[#515154]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#86868B]">Event Date:</span>
                    <span className="font-medium text-[#1D1D1F]">{cert.eventDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#86868B]">Issued On:</span>
                    <span className="font-medium text-[#1D1D1F]">{cert.issuedDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#86868B]">Authorized By:</span>
                    <span className="font-medium text-[#1D1D1F] truncate max-w-[150px]">{cert.authorizedBy}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-black/[0.05] flex items-center gap-2">
                  <AppleButton
                    variant="primary"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setSelectedCert(cert)}
                  >
                    View Full Certificate
                  </AppleButton>
                  <AppleButton
                    variant="secondary"
                    size="sm"
                    className="p-2 shrink-0"
                    title="Print"
                    onClick={() => {
                      setSelectedCert(cert);
                      setTimeout(() => window.print(), 300);
                    }}
                  >
                    <Printer className="w-4 h-4" />
                  </AppleButton>
                </div>
              </div>
            </AppleCard>
          ))}
        </div>
      )}

      {/* Official Certificate Full Screen Modal & Printable View */}
      {selectedCert && (
        <Modal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          maxWidth="3xl"
        >
          <div className="space-y-6">
            {/* Printable Certificate Template */}
            <div
              id="printable-certificate"
              className="relative p-8 sm:p-12 rounded-3xl bg-white border-8 border-[#002147] shadow-xl text-center space-y-6 overflow-hidden select-none"
            >
              {/* Gold Filigree Inner Border */}
              <div className="absolute inset-3 border-2 border-[#C59B27]/60 pointer-events-none rounded-2xl" />
              <div className="absolute inset-4 border border-[#C59B27]/30 pointer-events-none rounded-xl" />

              {/* Watermark Crest Emblem */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
                <ChristLogo size="xl" showText={false} className="scale-[3.5]" />
              </div>

              {/* Certificate Header */}
              <div className="relative z-10 flex flex-col items-center">
                <ChristLogo size="lg" showText={false} />
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-wider text-[#002147] mt-3 font-serif uppercase">
                  CHRIST (Deemed to be University)
                </h1>
                <p className="text-xs font-semibold tracking-widest text-[#C59B27] uppercase mt-0.5">
                  Yeshwanthpur Campus, Bengaluru
                </p>
                <div className="h-0.5 w-24 bg-[#C59B27] my-2" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#515154]">
                  Student Welfare Office
                </p>
              </div>

              {/* Award Title */}
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#002147] capitalize">
                  Certificate of {selectedCert.type}
                </h2>
                <p className="text-xs text-[#86868B] uppercase tracking-wider mt-1">
                  This is proudly conferred upon
                </p>
              </div>

              {/* Recipient Name & Department */}
              <div className="relative z-10 my-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] tracking-tight border-b border-[#002147]/20 inline-block px-8 pb-1">
                  {selectedCert.studentName}
                </h3>
                <p className="text-xs font-medium text-[#515154] mt-2">
                  Register Number: <strong className="font-mono text-[#002147]">{selectedCert.studentRegNo}</strong> • {selectedCert.department}
                </p>
              </div>

              {/* Citation Body */}
              <div className="relative z-10 max-w-xl mx-auto text-xs sm:text-sm text-[#3A3A3C] leading-relaxed">
                in recognition of outstanding participation and exemplary contribution to{' '}
                <strong className="text-[#002147]">{selectedCert.eventTitle}</strong> organized by the Student Welfare Office, Yeshwanthpur Campus, on {selectedCert.eventDate}.
              </div>

              {/* Signatures & Seal Footer */}
              <div className="relative z-10 pt-6 border-t border-black/[0.08] grid grid-cols-3 items-end gap-4 text-xs">
                {/* Director Signature */}
                <div className="text-center">
                  <div className="h-10 flex items-center justify-center font-serif italic text-base text-[#002147]">
                    Fr. Lijo P. Thomas
                  </div>
                  <div className="h-0.5 w-32 mx-auto bg-black/20 my-1" />
                  <p className="font-bold text-[#1D1D1F] text-[11px]">Rev. Fr. Director</p>
                  <p className="text-[9px] text-[#86868B]">Yeshwanthpur Campus</p>
                </div>

                {/* Official Gold Seal Graphic */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#C59B27] via-[#D4AF37] to-[#FFF2B2] border-2 border-white shadow-md flex items-center justify-center text-[#002147] font-black text-xs uppercase tracking-tighter ring-2 ring-[#C59B27]/50">
                    <div className="text-center">
                      <span className="block text-[8px] font-bold">OFFICIAL</span>
                      <span className="block text-[9px] font-black">SEAL</span>
                      <span className="block text-[7px]">SWO</span>
                    </div>
                  </div>
                </div>

                {/* SWO Officer Signature */}
                <div className="text-center">
                  <div className="h-10 flex items-center justify-center font-serif italic text-base text-[#002147]">
                    Mathew K. Varghese
                  </div>
                  <div className="h-0.5 w-32 mx-auto bg-black/20 my-1" />
                  <p className="font-bold text-[#1D1D1F] text-[11px]">{selectedCert.authorizedBy}</p>
                  <p className="text-[9px] text-[#86868B]">{selectedCert.designation}</p>
                </div>
              </div>

              {/* Cryptographic Verification Footer */}
              <div className="relative z-10 pt-2 flex items-center justify-between text-[10px] text-[#86868B] border-t border-black/[0.04]">
                <span className="font-mono">Cert ID: {selectedCert.certificateNo}</span>
                <span className="flex items-center gap-1 text-[#28A745] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Digitally Signed & Blockchain Verified
                </span>
                <span>Issued: {selectedCert.issuedDate}</span>
              </div>
            </div>

            {/* Modal Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs text-[#86868B]">
                This credential is permanently registered with Christ University SWO records.
              </span>
              <div className="flex items-center gap-2">
                <AppleButton
                  variant="secondary"
                  size="md"
                  icon={<Printer className="w-4 h-4" />}
                  onClick={handlePrint}
                >
                  Print Certificate
                </AppleButton>
                <AppleButton
                  variant="primary"
                  size="md"
                  icon={<Download className="w-4 h-4" />}
                  onClick={handlePrint}
                >
                  Download Official PDF
                </AppleButton>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

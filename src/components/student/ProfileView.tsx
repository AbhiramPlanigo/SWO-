import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppleCard } from '../common/AppleCard';
import { AppleButton } from '../common/AppleButton';
import { Modal } from '../common/Modal';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  GraduationCap, 
  MapPin, 
  Edit3, 
  Calendar, 
  Award, 
  Ticket, 
  CheckCircle2,
  ShieldCheck,
  Camera
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { studentUser, updateStudentProfile, registrations, certificates } = useApp();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: studentUser.name,
    phone: studentUser.phone,
    department: studentUser.department,
    year: studentUser.year,
    avatar: studentUser.avatar,
  });

  const totalRegistered = registrations.filter(
    (r) => r.studentId === studentUser.id && r.status !== 'Cancelled'
  ).length;

  const totalAttended = registrations.filter(
    (r) => r.studentId === studentUser.id && r.status === 'Attended'
  ).length;

  const totalCerts = certificates.filter(
    (c) => c.studentRegNo === studentUser.regNo
  ).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile(formData);
    setIsEditOpen(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0071E3]/10 text-[#0071E3]">
              University Records
            </span>
            <span className="text-xs text-[#86868B]">Yeshwanthpur Campus, Bengaluru</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
            Student Identity Profile
          </h2>
          <p className="text-sm text-[#86868B] mt-1">
            Official student record linked to SWO event attendances, club memberships, and issued credentials.
          </p>
        </div>

        <AppleButton
          variant="secondary"
          size="sm"
          icon={<Edit3 className="w-4 h-4 text-[#0071E3]" />}
          onClick={() => {
            setFormData({
              name: studentUser.name,
              phone: studentUser.phone,
              department: studentUser.department,
              year: studentUser.year,
              avatar: studentUser.avatar,
            });
            setIsEditOpen(true);
          }}
        >
          Edit Profile
        </AppleButton>
      </div>

      {/* Main Profile Hero Card */}
      <AppleCard padding="lg" className="border border-black/[0.06] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <img
              src={studentUser.avatar}
              alt={studentUser.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-[#0071E3]/10 shadow-md"
            />
            <span className="absolute bottom-1 right-1 p-1.5 rounded-full bg-[#34C759] text-white ring-2 ring-white" title="Active Student">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] tracking-tight">
                {studentUser.name}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#002147] text-white">
                {studentUser.regNo}
              </span>
            </div>

            <p className="text-sm font-medium text-[#0071E3] flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              {studentUser.department} • {studentUser.year}
            </p>

            <p className="text-xs text-[#86868B] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF3B30]" />
              {studentUser.campus}
            </p>
          </div>
        </div>

        {/* Co-Curricular Summary Stats */}
        <div className="mt-8 pt-6 border-t border-black/[0.05] grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-2xl bg-black/[0.02]">
            <p className="text-2xl font-extrabold text-[#0071E3]">{totalRegistered}</p>
            <p className="text-xs text-[#86868B] font-medium mt-0.5">Events Registered</p>
          </div>
          <div className="p-3 rounded-2xl bg-black/[0.02]">
            <p className="text-2xl font-extrabold text-[#34C759]">{totalAttended}</p>
            <p className="text-xs text-[#86868B] font-medium mt-0.5">Attended & Verified</p>
          </div>
          <div className="p-3 rounded-2xl bg-black/[0.02]">
            <p className="text-2xl font-extrabold text-[#AF52DE]">{totalCerts}</p>
            <p className="text-xs text-[#86868B] font-medium mt-0.5">Digital Certificates</p>
          </div>
        </div>
      </AppleCard>

      {/* Profile Information Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Contact & Registration Information */}
        <AppleCard padding="md" className="border border-black/[0.06] space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#86868B]">
            Official Communication
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-black/[0.02] flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#0071E3] shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-[#86868B] block">Christ University Institutional Email</span>
                <span className="font-semibold text-[#1D1D1F] truncate block">{studentUser.email}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/[0.02] flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#34C759] shrink-0" />
              <div>
                <span className="text-[10px] text-[#86868B] block">Primary Mobile (SMS Alerts)</span>
                <span className="font-semibold text-[#1D1D1F]">{studentUser.phone}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/[0.02] flex items-center gap-3">
              <Building className="w-4 h-4 text-[#FF9500] shrink-0" />
              <div>
                <span className="text-[10px] text-[#86868B] block">Affiliated Academic School</span>
                <span className="font-semibold text-[#1D1D1F]">School of Engineering & Technology</span>
              </div>
            </div>
          </div>
        </AppleCard>

        {/* SWO Leadership & Committee Wing Affiliation */}
        <AppleCard padding="md" className="border border-black/[0.06] space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#86868B]">
            SWO Committee Wing Affiliation
          </h4>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#002147]/5 to-[#0071E3]/5 border border-[#002147]/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#002147] text-white">
                Leadership Core
              </span>
              <span className="text-[10px] text-[#86868B]">AY 2026-27</span>
            </div>
            <h5 className="text-sm font-bold text-[#1D1D1F]">
              SWO Media, Design & Tech Wing
            </h5>
            <p className="text-xs text-[#0071E3] font-semibold">
              Designation: Tech Lead & Webmaster
            </p>
            <p className="text-xs text-[#515154] leading-relaxed">
              Leading the digital experience engineering team for campus festivals, registration portals, and electronic event verification.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#34C759] font-medium pt-1">
            <ShieldCheck className="w-4 h-4" /> Good Academic & Disciplinary Standing (Verified)
          </div>
        </AppleCard>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Student Profile"
        subtitle="Update contact preferences and avatar"
        maxWidth="md"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Mobile Contact</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Avatar Photo URL</label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
            />
            <p className="text-[10px] text-[#86868B] mt-1">Provide a direct high-res square photo URL.</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-black/[0.05]">
            <AppleButton type="button" variant="secondary" size="sm" onClick={() => setIsEditOpen(false)}>
              Cancel
            </AppleButton>
            <AppleButton type="submit" variant="primary" size="sm">
              Save Changes
            </AppleButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

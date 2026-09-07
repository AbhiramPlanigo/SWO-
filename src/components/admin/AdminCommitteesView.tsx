import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Committee, CommitteeMember } from '../../types';
import { AppleCard } from '../common/AppleCard';
import { AppleButton } from '../common/AppleButton';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { 
  Users, 
  Plus, 
  Mail, 
  Phone, 
  UserCheck, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  Search,
  Trash2
} from 'lucide-react';

export const AdminCommitteesView: React.FC = () => {
  const { committees, addCommitteeMember, removeCommitteeMember } = useApp();

  const [selectedCommitteeId, setSelectedCommitteeId] = useState<string>(committees[0]?.id || '');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [searchMember, setSearchMember] = useState('');

  const [memberForm, setMemberForm] = useState<Partial<CommitteeMember>>({
    name: '',
    regNo: '',
    role: 'Core Volunteer',
    email: '',
    phone: '+91 98',
    assignedEvents: [],
  });

  const activeCommittee = committees.find((c) => c.id === selectedCommitteeId) || committees[0];

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCommittee) return;

    const newMem: CommitteeMember = {
      id: `mem-${Date.now()}`,
      name: memberForm.name || 'Student Volunteer',
      regNo: memberForm.regNo || '2447000',
      role: memberForm.role || 'Member',
      department: memberForm.department || 'School of Engineering & Tech',
      email: memberForm.email || 'student@res.christuniversity.in',
      phone: memberForm.phone || '+91 9800000000',
      assignedEvents: memberForm.assignedEvents || ['General Operations'],
    };

    addCommitteeMember(activeCommittee.id, newMem);
    setIsAddMemberOpen(false);
    setMemberForm({
      name: '',
      regNo: '',
      role: 'Core Volunteer',
      email: '',
      phone: '+91 98',
      assignedEvents: [],
    });
  };

  const filteredMembers = activeCommittee?.members.filter((m) => {
    if (!searchMember.trim()) return true;
    const q = searchMember.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.regNo.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q)
    );
  }) || [];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#002147]/10 text-[#002147]">
              Student Leadership
            </span>
            <span className="text-xs text-[#86868B]">Yeshwanthpur Campus SWO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
            Committees & Volunteer Wings
          </h2>
          <p className="text-sm text-[#86868B] mt-1">
            Supervise student leadership teams, assign event portfolios, and track volunteer deployments.
          </p>
        </div>

        <AppleButton
          variant="navy"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddMemberOpen(true)}
        >
          Add Committee Member
        </AppleButton>
      </div>

      {/* Committee Select Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {committees.map((comm) => (
          <button
            key={comm.id}
            onClick={() => setSelectedCommitteeId(comm.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border ${
              selectedCommitteeId === comm.id
                ? 'bg-[#002147] text-white border-[#002147] shadow-sm'
                : 'bg-white text-[#515154] hover:text-[#1D1D1F] border-black/[0.06]'
            }`}
          >
            {comm.name} ({comm.members.length})
          </button>
        ))}
      </div>

      {/* Active Committee Details Card */}
      {activeCommittee && (
        <AppleCard padding="lg" className="border border-black/[0.06] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[0.05] pb-4">
            <div>
              <span className="text-xs font-bold text-[#0071E3] uppercase tracking-wider">
                {activeCommittee.wing}
              </span>
              <h3 className="text-xl font-bold text-[#1D1D1F] mt-0.5">
                {activeCommittee.name}
              </h3>
              <p className="text-xs text-[#515154] mt-1 max-w-2xl leading-relaxed">
                {activeCommittee.description}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-black/[0.02] border border-black/[0.04] text-xs">
              <span className="text-[10px] text-[#86868B] block">Faculty Coordinator</span>
              <span className="font-bold text-[#1D1D1F]">{activeCommittee.facultyCoordinator}</span>
            </div>
          </div>

          {/* Members Search & Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#86868B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search member by name, role, or reg no..."
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 shadow-xs"
              />
            </div>

            <span className="text-xs text-[#86868B]">
              Showing {filteredMembers.length} of {activeCommittee.members.length} members
            </span>
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {filteredMembers.map((mem) => (
              <div
                key={mem.id}
                className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.05] space-y-3 relative group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-[#1D1D1F] tracking-tight">{mem.name}</h4>
                    <p className="text-xs font-semibold text-[#0071E3]">{mem.role}</p>
                    <p className="text-[11px] font-mono text-[#86868B] mt-0.5">{mem.regNo}</p>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Remove ${mem.name} from ${activeCommittee.name}?`)) {
                        removeCommitteeMember(activeCommittee.id, mem.id);
                      }
                    }}
                    className="p-1 rounded-lg text-[#86868B] hover:text-[#FF3B30] opacity-60 hover:opacity-100 transition-opacity"
                    title="Remove Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1 text-xs text-[#515154] border-t border-black/[0.04] pt-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-[#86868B] shrink-0" />
                    <span className="truncate">{mem.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#34C759] shrink-0" />
                    <span>{mem.phone}</span>
                  </div>
                </div>

                {mem.assignedEvents && mem.assignedEvents.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {mem.assignedEvents.map((evtName, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#002147]/5 text-[#002147] border border-[#002147]/10"
                      >
                        {evtName}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </AppleCard>
      )}

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        title={`Add Member to ${activeCommittee?.name || 'Committee'}`}
        subtitle="Appoint student leader or volunteer"
        maxWidth="md"
      >
        <form onSubmit={handleAddMemberSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Student Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Diya Menon"
              value={memberForm.name}
              onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Register Number *</label>
              <input
                type="text"
                required
                placeholder="2447109"
                value={memberForm.regNo}
                onChange={(e) => setMemberForm({ ...memberForm, regNo: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs font-mono text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Committee Role *</label>
              <select
                value={memberForm.role}
                onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
              >
                <option value="Student Head">Student Head</option>
                <option value="Deputy Lead">Deputy Lead</option>
                <option value="Technical Lead">Technical Lead</option>
                <option value="Auditorium Stage Manager">Auditorium Stage Manager</option>
                <option value="Core Volunteer">Core Volunteer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">University Email *</label>
            <input
              type="email"
              required
              placeholder="diya.m@bba.christuniversity.in"
              value={memberForm.email}
              onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Phone *</label>
            <input
              type="text"
              required
              placeholder="+91 98450 11223"
              value={memberForm.phone}
              onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/[0.05]">
            <AppleButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsAddMemberOpen(false)}
            >
              Cancel
            </AppleButton>
            <AppleButton type="submit" variant="primary" size="sm">
              Confirm Appointment
            </AppleButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

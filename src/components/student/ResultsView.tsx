import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EventResult } from '../../types';
import { AppleCard } from '../common/AppleCard';
import { AppleButton } from '../common/AppleButton';
import { 
  Trophy, 
  Medal, 
  Award, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Search,
  MessageSquare
} from 'lucide-react';

interface ResultsViewProps {
  onViewCertificates: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ onViewCertificates }) => {
  const { results, studentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResults = results.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.eventTitle.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.positions.some((p) => p.winnerName.toLowerCase().includes(q) || p.department.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFD60A]/20 text-[#B78103]">
              Official Outcomes
            </span>
            <span className="text-xs text-[#86868B]">Yeshwanthpur Campus SWO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
            Competition Results & Honors
          </h2>
          <p className="text-sm text-[#86868B] mt-1">
            Official scorecards, winner podiums, and adjudicator remarks for completed festivals and championships.
          </p>
        </div>

        <AppleButton
          variant="secondary"
          size="sm"
          icon={<Award className="w-4 h-4 text-[#AF52DE]" />}
          onClick={onViewCertificates}
        >
          View My Certificates
        </AppleButton>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by championship, team name, or department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-full bg-white border border-black/[0.08] text-xs sm:text-sm text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] shadow-xs"
        />
      </div>

      {/* Results List */}
      <div className="space-y-5">
        {filteredResults.map((res) => {
          // Check if current student is in the winners
          const studentWon = res.positions.some(
            (p) => p.regNo === studentUser.regNo || p.winnerName.includes(studentUser.name.split(' ')[0])
          );

          return (
            <AppleCard key={res.id} padding="lg" className="border border-black/[0.06] space-y-5">
              {/* Event Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/[0.05] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#002147]/10 text-[#002147]">
                      {res.category}
                    </span>
                    <span className="text-xs text-[#86868B] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(res.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {studentWon && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#34C759]/15 text-[#28A745] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> You Placed on Podium!
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-[#1D1D1F] tracking-tight">
                    {res.eventTitle}
                  </h3>
                </div>

                {res.certificateEligible && (
                  <AppleButton
                    variant="ghost"
                    size="sm"
                    className="self-start sm:self-auto text-xs"
                    onClick={onViewCertificates}
                  >
                    Claim Digital Certificate →
                  </AppleButton>
                )}
              </div>

              {/* Podium Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {res.positions.map((pos) => {
                  const isCurrentStudentWinner =
                    pos.regNo === studentUser.regNo || pos.winnerName.includes(studentUser.name.split(' ')[0]);

                  const medalColors = {
                    1: 'bg-amber-400/20 text-amber-700 border-amber-300/40',
                    2: 'bg-slate-300/30 text-slate-700 border-slate-300/50',
                    3: 'bg-orange-300/20 text-orange-700 border-orange-300/40',
                  }[pos.rank] || 'bg-blue-100 text-blue-700 border-blue-200';

                  return (
                    <div
                      key={pos.rank}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCurrentStudentWinner
                          ? 'bg-[#34C759]/5 border-[#34C759]/30 ring-1 ring-[#34C759]/30'
                          : 'bg-black/[0.015] border-black/[0.05]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${medalColors} flex items-center gap-1`}>
                          <Trophy className="w-3 h-3" />
                          {pos.title}
                        </span>
                        {pos.prize && (
                          <span className="text-[10px] font-semibold text-[#86868B]">{pos.prize}</span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-[#1D1D1F] tracking-tight">
                        {pos.winnerName}
                      </h4>
                      <p className="text-xs text-[#515154] mt-0.5">
                        {pos.department}
                      </p>
                      <p className="text-[10px] font-mono text-[#86868B] mt-1">
                        Reg: {pos.regNo}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Judges' Remarks */}
              {res.judgesRemarks && (
                <div className="p-3.5 rounded-2xl bg-black/[0.02] border border-black/[0.04] text-xs text-[#515154] flex items-start gap-2.5">
                  <MessageSquare className="w-4 h-4 text-[#0071E3] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1D1D1F] block mb-0.5">Adjudicators' Official Citation</span>
                    <p className="italic leading-relaxed text-[#515154]">"{res.judgesRemarks}"</p>
                  </div>
                </div>
              )}
            </AppleCard>
          );
        })}
      </div>
    </div>
  );
};

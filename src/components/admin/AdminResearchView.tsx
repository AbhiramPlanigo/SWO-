import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ResearchSurvey } from '../../types';
import { AppleCard } from '../common/AppleCard';
import { AppleButton } from '../common/AppleButton';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import { 
  BarChart3, 
  FileText, 
  Plus, 
  Download, 
  Calendar, 
  CheckCircle2, 
  Users, 
  TrendingUp,
  Search,
  Sparkles
} from 'lucide-react';

export const AdminResearchView: React.FC = () => {
  const { researchSurveys, addResearchSurvey } = useApp();

  const [selectedSurvey, setSelectedSurvey] = useState<ResearchSurvey | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ResearchSurvey>>({
    title: '',
    category: 'Well-Being',
    description: '',
    deadline: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    targetSample: 500,
    status: 'Active',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newSurvey: ResearchSurvey = {
      id: `survey-${Date.now()}`,
      title: formData.title || 'Untitled Initiative',
      category: formData.category || 'Feedback',
      description: formData.description || '',
      deadline: formData.deadline || new Date().toISOString().split('T')[0],
      totalResponses: 0,
      targetSample: Number(formData.targetSample) || 200,
      status: 'Active',
      questionsCount: 12,
    };
    addResearchSurvey(newSurvey);
    setIsCreateOpen(false);
  };

  const handleDownloadCSV = (survey: ResearchSurvey) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Response ID,Student Reg No,Department,Score (1-10),Feedback,Timestamp',
        'RESP-01,2447101,School of Engg,9,"Great support system and initiatives",2026-03-01T10:00:00Z',
        'RESP-02,2311405,Media Studies,8,"More cultural workshops requested",2026-03-01T11:20:00Z',
        'RESP-03,2220199,Management,9,"Well structured surveys and rapid SWO response",2026-03-02T09:15:00Z',
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${survey.title.replace(/\s+/g, '_')}_Responses.csv`);
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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#AF52DE]/10 text-[#AF52DE]">
              SWO Research & Analytics Wing
            </span>
            <span className="text-xs text-[#86868B]">Yeshwanthpur Campus</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
            Research & Campus Welfare Surveys
          </h2>
          <p className="text-sm text-[#86868B] mt-1">
            Official student well-being audits, auditorium acoustics feedback, and co-curricular impact studies.
          </p>
        </div>

        <AppleButton
          variant="navy"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateOpen(true)}
        >
          New Survey
        </AppleButton>
      </div>

      {/* Survey Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {researchSurveys.map((survey) => {
          const progress = Math.min(100, Math.round((survey.totalResponses / survey.targetSample) * 100));

          return (
            <AppleCard
              key={survey.id}
              hoverEffect
              padding="none"
              className="border border-black/[0.06] flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#002147]/10 text-[#002147]">
                    {survey.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      survey.status === 'Active'
                        ? 'bg-[#34C759]/15 text-[#28A745]'
                        : 'bg-black/[0.06] text-[#86868B]'
                    }`}
                  >
                    {survey.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#1D1D1F] tracking-tight">
                  {survey.title}
                </h3>

                <p className="text-xs text-[#515154] leading-relaxed line-clamp-2">
                  {survey.description}
                </p>

                <div className="pt-2 text-xs text-[#86868B] flex items-center justify-between">
                  <span>Target Deadline:</span>
                  <span className="font-semibold text-[#1D1D1F]">{survey.deadline}</span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs text-[#86868B]">
                    <span>Sample Collected</span>
                    <span className="font-semibold text-[#1D1D1F]">
                      {survey.totalResponses} / {survey.targetSample} ({progress}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-black/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#AF52DE] rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-black/[0.05] flex items-center gap-2">
                  <AppleButton
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setSelectedSurvey(survey)}
                  >
                    View Metrics
                  </AppleButton>
                  <AppleButton
                    variant="primary"
                    size="sm"
                    className="p-2 shrink-0"
                    title="Export Raw Data"
                    onClick={() => handleDownloadCSV(survey)}
                  >
                    <Download className="w-4 h-4" />
                  </AppleButton>
                </div>
              </div>
            </AppleCard>
          );
        })}
      </div>

      {/* Metrics Inspector Modal */}
      {selectedSurvey && (
        <Modal
          isOpen={!!selectedSurvey}
          onClose={() => setSelectedSurvey(null)}
          title={selectedSurvey.title}
          subtitle={`SWO Research Initiative • ${selectedSurvey.category}`}
          maxWidth="lg"
        >
          <div className="space-y-5">
            <p className="text-xs sm:text-sm text-[#515154] leading-relaxed">
              {selectedSurvey.description}
            </p>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-black/[0.02]">
                <p className="text-xl font-extrabold text-[#0071E3]">{selectedSurvey.totalResponses}</p>
                <p className="text-[11px] text-[#86868B] mt-0.5">Responses Logged</p>
              </div>
              <div className="p-3 rounded-2xl bg-black/[0.02]">
                <p className="text-xl font-extrabold text-[#34C759]">98.4%</p>
                <p className="text-[11px] text-[#86868B] mt-0.5">Completion Rate</p>
              </div>
              <div className="p-3 rounded-2xl bg-black/[0.02]">
                <p className="text-xl font-extrabold text-[#AF52DE]">4.7 / 5</p>
                <p className="text-[11px] text-[#86868B] mt-0.5">Satisfaction Index</p>
              </div>
            </div>

            {/* Department Breakdown */}
            <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.05] space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#86868B]">
                Sample Distribution by School
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[#515154] mb-1">
                    <span>School of Engineering & Technology</span>
                    <span className="font-semibold">46%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-[#0071E3]" style={{ width: '46%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[#515154] mb-1">
                    <span>Department of Management Studies</span>
                    <span className="font-semibold">32%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-[#34C759]" style={{ width: '32%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[#515154] mb-1">
                    <span>Media Studies & Sciences</span>
                    <span className="font-semibold">22%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-[#AF52DE]" style={{ width: '22%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/[0.05]">
              <AppleButton
                variant="secondary"
                size="sm"
                icon={<Download className="w-3.5 h-3.5" />}
                onClick={() => handleDownloadCSV(selectedSurvey)}
              >
                Export CSV Dataset
              </AppleButton>
              <AppleButton
                variant="primary"
                size="sm"
                onClick={() => setSelectedSurvey(null)}
              >
                Close Inspector
              </AppleButton>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Survey Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Launch Research or Feedback Initiative"
        subtitle="Configure student welfare survey"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Survey Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Mid-Term Student Health & Counseling Audit"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Research Domain *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
              >
                <option value="Well-Being">Well-Being & Health</option>
                <option value="Facilities">Auditorium & Facilities</option>
                <option value="Cultural">Cultural & Arts</option>
                <option value="Academic">Academic Support</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Target Sample *</label>
              <input
                type="number"
                min={50}
                required
                value={formData.targetSample}
                onChange={(e) => setFormData({ ...formData, targetSample: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">Description & Purpose *</label>
            <textarea
              required
              rows={3}
              placeholder="Explain how this study contributes to campus welfare..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.08] text-xs text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3]/20 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/[0.05]">
            <AppleButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </AppleButton>
            <AppleButton type="submit" variant="primary" size="sm">
              Launch Initiative
            </AppleButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

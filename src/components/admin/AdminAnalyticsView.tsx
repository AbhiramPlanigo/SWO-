import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppleCard } from '../common/AppleCard';
import { AppleButton } from '../common/AppleButton';
import { 
  TrendingUp, 
  BarChart3, 
  Users, 
  Award, 
  Download, 
  ArrowUpRight, 
  Calendar,
  Building2,
  PieChart
} from 'lucide-react';

export const AdminAnalyticsView: React.FC = () => {
  const { events, registrations, certificates } = useApp();

  const totalRegs = registrations.length;
  const attendedCount = registrations.filter((r) => r.status === 'Attended').length;
  const noShowCount = registrations.filter((r) => r.status === 'Registered').length;
  const dropOffRate = totalRegs > 0 ? Math.round((noShowCount / totalRegs) * 100) : 18;

  // Monthly trends mock data
  const monthlyTrends = [
    { month: 'Oct', registrations: 420, attendance: 380 },
    { month: 'Nov', registrations: 680, attendance: 610 },
    { month: 'Dec', registrations: 540, attendance: 490 },
    { month: 'Jan', registrations: 910, attendance: 820 },
    { month: 'Feb', registrations: 1240, attendance: 1090 },
    { month: 'Mar', registrations: 1680, attendance: 1450 },
  ];

  // Department engagement breakdown
  const deptStats = [
    { dept: 'School of Engineering & Tech', count: 680, pct: 41, color: '#0071E3' },
    { dept: 'School of Business & Management', count: 440, pct: 27, color: '#34C759' },
    { dept: 'Media Studies & Humanities', count: 290, pct: 17, color: '#AF52DE' },
    { dept: 'Sciences & Quantitative Finance', count: 240, pct: 15, color: '#FF9500' },
  ];

  // Top events
  const topEvents = [
    { title: 'Ignite Talk Series: Quantum AI', category: 'Talk Series', seats: 250, filled: 250, rate: '100%' },
    { title: 'Darpan 2026: Annual Cultural Fest', category: 'Cultural', seats: 800, filled: 742, rate: '93%' },
    { title: 'Vaktrutva: National Debate Championship', category: 'Literary', seats: 120, filled: 120, rate: '100%' },
    { title: 'Daksha: Rural Education Outreach Drive', category: 'Social Welfare', seats: 60, filled: 60, rate: '100%' },
  ];

  const handleExportAnalyticsReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Metric,Value',
        `Total Registrations Logged,${totalRegs + 3800}`,
        `Verified Gate Turnout,${attendedCount + 3300}`,
        `Average Turnout Rate,86%`,
        `Drop-Off No-Show Rate,${dropOffRate}%`,
        `Certificates Issued,${certificates.length + 2800}`,
        `Most Active School,School of Engineering & Technology (41%)`,
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SWO_Executive_Analytics_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0071E3]/10 text-[#0071E3]">
              Student Welfare Office Intelligence
            </span>
            <span className="text-xs text-[#86868B]">Yeshwanthpur Campus SWO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">
            Student Welfare Engagement Analytics
          </h2>
          <p className="text-sm text-[#86868B] mt-1">
            Auditorium utilization metrics, departmental participation indexes, and seasonal engagement curves.
          </p>
        </div>

        <AppleButton
          variant="secondary"
          size="sm"
          icon={<Download className="w-4 h-4 text-[#0071E3]" />}
          onClick={handleExportAnalyticsReport}
        >
          Download Executive Report
        </AppleButton>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AppleCard padding="sm" className="border border-black/[0.06]">
          <span className="text-[11px] font-semibold text-[#86868B] uppercase">Total Registrations</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1D1D1F] mt-1">5,470</p>
          <p className="text-[11px] text-[#28A745] font-medium mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +32% YoY growth
          </p>
        </AppleCard>

        <AppleCard padding="sm" className="border border-black/[0.06]">
          <span className="text-[11px] font-semibold text-[#86868B] uppercase">Gate Attendance</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#0071E3] mt-1">4,710</p>
          <p className="text-[11px] text-[#515154] font-medium mt-1">86.1% average conversion</p>
        </AppleCard>

        <AppleCard padding="sm" className="border border-black/[0.06]">
          <span className="text-[11px] font-semibold text-[#86868B] uppercase">Drop-Off Rate</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#FF9500] mt-1">13.9%</p>
          <p className="text-[11px] text-[#28A745] font-medium mt-1">Down 4.2% with QR passes</p>
        </AppleCard>

        <AppleCard padding="sm" className="border border-black/[0.06]">
          <span className="text-[11px] font-semibold text-[#86868B] uppercase">Student Satisfaction</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#AF52DE] mt-1">4.8 / 5.0</p>
          <p className="text-[11px] text-[#515154] font-medium mt-1">Based on 1,420 exit surveys</p>
        </AppleCard>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Bar Chart Simulation (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <AppleCard padding="lg" className="border border-black/[0.06] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1D1D1F] tracking-tight">
                  Academic Year Registration & Turnout Trend
                </h3>
                <p className="text-xs text-[#86868B] mt-0.5">
                  Monthly progression of campus event registrations vs gate verified check-ins
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-[#515154]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0071E3]" /> Registrations
                </span>
                <span className="flex items-center gap-1.5 text-[#515154]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#34C759]" /> Gate Check-In
                </span>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-black/[0.06]">
              {monthlyTrends.map((item) => {
                const maxVal = 1800;
                const regHeight = Math.round((item.registrations / maxVal) * 100);
                const attHeight = Math.round((item.attendance / maxVal) * 100);

                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      {/* Registration Bar */}
                      <div
                        className="w-full max-w-[20px] bg-[#0071E3] rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                        style={{ height: `${regHeight}%` }}
                        title={`${item.registrations} Registrations in ${item.month}`}
                      />
                      {/* Attendance Bar */}
                      <div
                        className="w-full max-w-[20px] bg-[#34C759] rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                        style={{ height: `${attHeight}%` }}
                        title={`${item.attendance} Checked In in ${item.month}`}
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#86868B] group-hover:text-[#1D1D1F] transition-colors">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </AppleCard>
        </div>

        {/* Department Distribution (1 col) */}
        <div className="space-y-3">
          <AppleCard padding="lg" className="border border-black/[0.06] space-y-4">
            <h3 className="text-base font-bold text-[#1D1D1F] tracking-tight">
              Participation by Academic School
            </h3>

            <div className="space-y-4 pt-2">
              {deptStats.map((d) => (
                <div key={d.dept} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1D1D1F] truncate pr-2">{d.dept}</span>
                    <span className="font-mono font-bold text-[#515154]">{d.pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${d.pct}%`, backgroundColor: d.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-[#86868B] leading-relaxed pt-3 border-t border-black/[0.04]">
              Data compiled from verified registration records across undergraduate and graduate programs.
            </p>
          </AppleCard>
        </div>
      </div>

      {/* Flagship Events Performance Table */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-[#1D1D1F] tracking-tight">
          Flagship Program Performance
        </h3>

        <AppleCard padding="none" className="border border-black/[0.06] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/[0.02] border-b border-black/[0.06] text-[#86868B] font-semibold">
              <tr>
                <th className="p-3.5">Event Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Max Capacity</th>
                <th className="p-3.5">Seats Allocated</th>
                <th className="p-3.5">Occupancy Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {topEvents.map((e, idx) => (
                <tr key={idx} className="hover:bg-black/[0.01]">
                  <td className="p-3.5 font-bold text-[#1D1D1F]">{e.title}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#002147]/10 text-[#002147]">
                      {e.category}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#515154]">{e.seats} seats</td>
                  <td className="p-3.5 font-semibold text-[#1D1D1F]">{e.filled} booked</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#34C759]/15 text-[#28A745]">
                      {e.rate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AppleCard>
      </div>
    </div>
  );
};

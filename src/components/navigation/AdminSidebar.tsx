import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChristLogo } from '../common/ChristLogo';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  QrCode, 
  Megaphone, 
  BarChart3, 
  Award, 
  Network, 
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';

export type AdminNavTab = 
  | 'dashboard'
  | 'events'
  | 'registrations'
  | 'attendance'
  | 'announcements'
  | 'research'
  | 'certificates'
  | 'committees'
  | 'analytics';

interface AdminSidebarProps {
  currentTab: AdminNavTab;
  onSelectTab: (tab: AdminNavTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onExitToPublic?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  onExitToPublic,
}) => {
  const { switchRole } = useApp();

  const handleExit = () => {
    if (onExitToPublic) {
      onExitToPublic();
    } else {
      switchRole('student');
    }
  };

  const navItems = [
    { id: 'dashboard' as AdminNavTab, label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'events' as AdminNavTab, label: 'Events', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'registrations' as AdminNavTab, label: 'Registration', icon: <Users className="w-4 h-4" /> },
    { id: 'attendance' as AdminNavTab, label: 'Attendance', icon: <QrCode className="w-4 h-4" /> },
    { id: 'announcements' as AdminNavTab, label: 'Announcements', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'research' as AdminNavTab, label: 'Research & Surveys', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'certificates' as AdminNavTab, label: 'Certificates', icon: <Award className="w-4 h-4" /> },
    { id: 'committees' as AdminNavTab, label: 'Committees', icon: <Network className="w-4 h-4" /> },
    { id: 'analytics' as AdminNavTab, label: 'User Analytics', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-white/95 dark:bg-[#141A26]/95 backdrop-blur-xl border-r border-gray-200/60 dark:border-white/10 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Top Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-gray-100 dark:border-white/10 shrink-0">
        <div className="flex items-center overflow-hidden">
          <ChristLogo size="sm" showText={!collapsed} subtext="SWO Admin Portal" />
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-[#86868B] dark:text-slate-400 hover:text-[#1D1D1F] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Admin Privilege Badge */}
      {!collapsed && (
        <div className="mx-4 my-3 p-2.5 rounded-2xl bg-[#C5A063]/15 border border-[#C5A063]/25 flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#9D7A3E] dark:text-[#E6C98F] shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#16212F] dark:text-white leading-tight">SWO Admin Portal</p>
            <p className="text-[10px] text-[#536275] dark:text-slate-400 truncate">Yeshwanthpur Campus Control</p>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 px-2.5 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#3A5982] text-white shadow-sm font-semibold'
                  : 'text-[#536275] dark:text-slate-400 hover:text-[#16212F] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
              } ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Footer Switcher to Public Website View */}
      <div className="p-3 border-t border-[#E2E8F0] dark:border-white/10 shrink-0">
        <button
          onClick={handleExit}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#3A5982] dark:text-blue-300 bg-[#3A5982]/10 dark:bg-white/10 hover:bg-[#3A5982]/15 dark:hover:bg-white/20 transition-colors ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
          title="Return to Public Campus Website"
        >
          <div className="flex items-center gap-2 truncate">
            <ArrowUpRight className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate font-semibold">Public Website</span>}
          </div>
          {!collapsed && <span className="text-[10px] text-[#8C9AA9] dark:text-slate-400">Live View</span>}
        </button>
      </div>
    </aside>
  );
};

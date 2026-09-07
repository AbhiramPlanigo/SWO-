import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChristLogo } from '../common/ChristLogo';
import { 
  Home, 
  Calendar as CalendarIcon, 
  ClipboardList, 
  Bell, 
  Trophy, 
  Award, 
  User as UserIcon,
  ChevronDown,
  Menu,
  X,
  LogIn,
  LogOut,
  ShieldCheck,
  Search,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type StudentNavTab = 
  | 'home' 
  | 'events' 
  | 'calendar'
  | 'my-registrations' 
  | 'announcements' 
  | 'results' 
  | 'certificates' 
  | 'profile';

export type CampusNavTab = StudentNavTab;

interface StudentNavbarProps {
  currentTab: StudentNavTab;
  onSelectTab: (tab: StudentNavTab) => void;
  unreadAnnouncementsCount: number;
}

interface NavItem {
  id: StudentNavTab;
  label: string;
  icon: React.ReactNode;
  highlight?: boolean;
  badge?: number | string;
}

export const StudentNavbar: React.FC<StudentNavbarProps> = ({
  currentTab,
  onSelectTab,
  unreadAnnouncementsCount,
}) => {
  const { studentUser, logoutStudent, openLoginModal, theme, toggleTheme } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Nav items: Core public items + authenticated student tabs
  const publicNavItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'events', label: 'Events & Fests', icon: <CalendarIcon className="w-4 h-4" /> },
    { id: 'calendar', label: 'Campus Calendar', icon: <CalendarIcon className="w-4 h-4" />, highlight: true },
    { 
      id: 'announcements', 
      label: 'Circulars', 
      icon: <Bell className="w-4 h-4" />,
      badge: unreadAnnouncementsCount > 0 ? unreadAnnouncementsCount : undefined,
    },
    { id: 'results', label: 'Results', icon: <Trophy className="w-4 h-4" /> },
  ];

  const authenticatedNavItems: NavItem[] = [
    { id: 'my-registrations', label: 'My Passes', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'certificates', label: 'Certificates', icon: <Award className="w-4 h-4" /> },
  ];

  const navItems = studentUser 
    ? [...publicNavItems, ...authenticatedNavItems]
    : publicNavItems;

  const handleProtectedTabClick = (tabId: StudentNavTab) => {
    if ((tabId === 'my-registrations' || tabId === 'certificates' || tabId === 'profile') && !studentUser) {
      openLoginModal(
        `Please sign in with your official @christuniversity.in account to access ${tabId === 'my-registrations' ? 'your event passes' : 'your certificates'}.`,
        () => onSelectTab(tabId)
      );
      return;
    }
    onSelectTab(tabId);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#0B0F17]/90 backdrop-blur-xl border-b border-[#E2E8F0] dark:border-white/10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo & University Campus Identity */}
          <div 
            onClick={() => onSelectTab('home')} 
            className="cursor-pointer transition-opacity hover:opacity-90 shrink-0 min-h-[44px] flex items-center pr-2"
          >
            <ChristLogo size="md" showText={true} />
          </div>

          {/* Desktop Nav Items (Pill Bar) */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F1F5F9] dark:bg-white/10 p-1 rounded-full border border-[#E2E8F0] dark:border-white/10">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleProtectedTabClick(item.id)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'text-[#3A5982] dark:text-[#93C5FD]'
                      : 'text-[#536275] dark:text-slate-200 hover:text-[#16212F] dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-white dark:bg-[#1E293B] rounded-full shadow-xs border border-[#E2E8F0] dark:border-white/15"
                      transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                    />
                  )}
                  <span className="relative z-10">{item.icon}</span>
                  <span className="relative z-10">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="relative z-10 ml-0.5 px-1.5 py-0.5 bg-[#C5A063] text-white text-[10px] font-bold rounded-full leading-none shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions: Theme Toggle, Search & Auth Status */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle Button (Dark / White Mode) */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to White Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
              className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] min-w-[44px] justify-center rounded-full text-xs font-semibold bg-[#F1F5F9] dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-[#16212F] dark:text-white border border-[#CBD5E1]/60 dark:border-white/15 transition-all shadow-2xs"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">White Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#3A5982]" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>

            <button
              onClick={() => onSelectTab('events')}
              title="Search Events & Activities"
              aria-label="Search Events"
              className="bg-[#F1F5F9] dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#536275] dark:text-white transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Authenticated vs Public State */}
            {studentUser ? (
              /* User Profile Dropdown */
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 min-h-[44px] px-2.5 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-[#E2E8F0] dark:hover:border-white/10"
                >
                  <div className="p-0.5 rounded-full bg-[#3A5982] border border-white/40 shadow-xs shrink-0">
                    <img
                      src={studentUser.avatar}
                      alt={studentUser.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-[#16212F] dark:text-white max-w-[110px] truncate">
                    {studentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8C9AA9] dark:text-slate-300" />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white/95 dark:bg-[#141A26]/95 backdrop-blur-xl border border-[#E2E8F0] dark:border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.25)] p-2 z-50 text-[#16212F] dark:text-white"
                      >
                        <div className="p-3 border-b border-[#E2E8F0] dark:border-white/10 bg-slate-50/50 dark:bg-white/5 rounded-xl mb-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-[#C5A063] uppercase tracking-wider">
                              Verified Student ID
                            </span>
                            <span className="text-[10px] font-mono text-[#8C9AA9] dark:text-slate-400">
                              {studentUser.regNo}
                            </span>
                          </div>
                          <p className="text-xs font-extrabold text-[#16212F] dark:text-white">{studentUser.name}</p>
                          <p className="text-[11px] text-[#536275] dark:text-slate-300 truncate mt-0.5">
                            {studentUser.email}
                          </p>
                          <p className="text-[10px] text-[#3A5982] dark:text-[#93C5FD] font-semibold mt-0.5 truncate">
                            {studentUser.department}
                          </p>
                        </div>

                        <div className="p-1 space-y-1 text-xs">
                          <button
                            onClick={() => {
                              onSelectTab('profile');
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2.5 font-semibold text-[#16212F] dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                          >
                            <UserIcon className="w-4 h-4 text-[#3A5982] dark:text-[#93C5FD]" />
                            Student Profile & Digital ID
                          </button>
                          <button
                            onClick={() => {
                              onSelectTab('my-registrations');
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2.5 font-semibold text-[#16212F] dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                          >
                            <ClipboardList className="w-4 h-4 text-[#3A5982] dark:text-[#93C5FD]" />
                            My Passes & QR Tickets
                          </button>
                          <button
                            onClick={() => {
                              onSelectTab('certificates');
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2.5 font-semibold text-[#16212F] dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                          >
                            <Award className="w-4 h-4 text-[#3A5982] dark:text-[#93C5FD]" />
                            Earned Certificates
                          </button>
                        </div>

                        <div className="mt-1 pt-1 border-t border-[#E2E8F0] dark:border-white/10 p-1">
                          <button
                            onClick={() => {
                              logoutStudent();
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full min-h-[44px] flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          >
                            <span>Sign Out to Public View</span>
                            <LogOut className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Public Sign In Button */
              <button
                onClick={() => openLoginModal('Sign in with your official Christ University institutional email to register for events, download passes, and claim certificates.')}
                className="flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full bg-[#3A5982] hover:bg-[#2D476C] transition-all text-xs font-bold text-white shadow-xs group"
              >
                <LogIn className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                <span>Sign In</span>
                <span className="hidden sm:inline text-[10px] font-normal opacity-75 border-l border-white/20 pl-1.5">
                  @christuniversity.in
                </span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#16212F] dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-[#E2E8F0] dark:border-white/10 bg-white/98 dark:bg-[#141A26]/98 backdrop-blur-xl px-4 py-3 space-y-1.5 overflow-hidden shadow-lg"
            >
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#E2E8F0] dark:border-white/10 mb-2">
                <span className="text-xs font-semibold text-[#536275] dark:text-[#94A3B8]">Theme Mode</span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-full text-xs font-semibold bg-[#F1F5F9] dark:bg-white/10 text-[#16212F] dark:text-white border border-[#CBD5E1]/60 dark:border-white/15"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>White Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-[#3A5982]" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>

              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    handleProtectedTabClick(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full min-h-[46px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    currentTab === item.id
                      ? 'bg-[#3A5982]/15 dark:bg-[#3A5982]/30 text-[#3A5982] dark:text-[#93C5FD]'
                      : 'text-[#16212F] dark:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 flex items-center justify-center text-[#3A5982] dark:text-[#93C5FD]">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 bg-[#C5A063] text-white text-[10px] font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}

              {!studentUser && (
                <div className="pt-2.5 border-t border-[#E2E8F0] dark:border-white/10">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openLoginModal();
                    }}
                    className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-[#3A5982] hover:bg-[#2D476C] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In with @christuniversity.in</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Floating Bottom Bar */}
      <div className="lg:hidden fixed bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-6 max-w-md mx-auto z-40 bg-white/95 dark:bg-[#141A26]/95 backdrop-blur-xl rounded-2xl border border-[#E2E8F0] dark:border-white/10 shadow-[0_8px_30px_rgba(22,33,47,0.18)] p-1.5 flex items-center justify-between gap-1">
        <button
          onClick={() => onSelectTab('home')}
          className={`flex-1 min-h-[48px] min-w-[44px] py-1.5 px-2 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 touch-manipulation ${
            currentTab === 'home' 
              ? 'bg-[#3A5982]/12 dark:bg-[#3A5982]/30 text-[#3A5982] dark:text-[#93C5FD] font-bold shadow-2xs' 
              : 'text-[#64748B] dark:text-slate-300 hover:text-[#16212F] dark:hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[11px] tracking-tight mt-0.5">Home</span>
        </button>

        <button
          onClick={() => onSelectTab('events')}
          className={`flex-1 min-h-[48px] min-w-[44px] py-1.5 px-2 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 touch-manipulation ${
            currentTab === 'events' 
              ? 'bg-[#3A5982]/12 dark:bg-[#3A5982]/30 text-[#3A5982] dark:text-[#93C5FD] font-bold shadow-2xs' 
              : 'text-[#64748B] dark:text-slate-300 hover:text-[#16212F] dark:hover:text-white'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span className="text-[11px] tracking-tight mt-0.5">Events</span>
        </button>

        <button
          onClick={() => onSelectTab('calendar')}
          className={`flex-1 min-h-[48px] min-w-[44px] py-1.5 px-2 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 touch-manipulation ${
            currentTab === 'calendar' 
              ? 'bg-[#3A5982]/12 dark:bg-[#3A5982]/30 text-[#3A5982] dark:text-[#93C5FD] font-bold shadow-2xs' 
              : 'text-[#64748B] dark:text-slate-300 hover:text-[#16212F] dark:hover:text-white'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span className="text-[11px] tracking-tight mt-0.5">Calendar</span>
        </button>

        <button
          onClick={() => onSelectTab('announcements')}
          className={`flex-1 min-h-[48px] min-w-[44px] py-1.5 px-2 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 touch-manipulation relative ${
            currentTab === 'announcements' 
              ? 'bg-[#3A5982]/12 dark:bg-[#3A5982]/30 text-[#3A5982] dark:text-[#93C5FD] font-bold shadow-2xs' 
              : 'text-[#64748B] dark:text-slate-300 hover:text-[#16212F] dark:hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span className="text-[11px] tracking-tight mt-0.5">Notices</span>
          {unreadAnnouncementsCount > 0 && (
            <span className="absolute top-1.5 right-3 w-2 h-2 bg-[#C5A063] rounded-full ring-2 ring-white dark:ring-[#141A26]" />
          )}
        </button>

        {studentUser ? (
          <button
            onClick={() => onSelectTab('profile')}
            className={`flex-1 min-h-[48px] min-w-[44px] py-1.5 px-2 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 touch-manipulation ${
              currentTab === 'profile' 
                ? 'bg-[#3A5982]/12 dark:bg-[#3A5982]/30 text-[#3A5982] dark:text-[#93C5FD] font-bold shadow-2xs' 
                : 'text-[#64748B] dark:text-slate-300 hover:text-[#16212F] dark:hover:text-white'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span className="text-[11px] tracking-tight mt-0.5">Profile</span>
          </button>
        ) : (
          <button
            onClick={() => openLoginModal()}
            className="flex-1 min-h-[48px] min-w-[44px] py-1.5 px-2 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 touch-manipulation text-[#3A5982] dark:text-[#93C5FD] font-bold"
          >
            <LogIn className="w-4 h-4" />
            <span className="text-[11px] tracking-tight mt-0.5">Sign In</span>
          </button>
        )}
      </div>
    </>
  );
};

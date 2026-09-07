import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  useNavigate, 
  useLocation, 
  Navigate 
} from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { StudentNavbar, StudentNavTab } from './components/navigation/StudentNavbar';
import { AdminSidebar, AdminNavTab } from './components/navigation/AdminSidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { ChristLoginModal } from './components/common/ChristLoginModal';

// Public Campus Views & Modals
import { HomeView } from './components/student/HomeView';
import { EventsView } from './components/student/EventsView';
import { CampusCalendarView } from './components/student/CampusCalendarView';
import { EventDetailsModal } from './components/student/EventDetailsModal';
import { RegistrationModal } from './components/student/RegistrationModal';
import { MyRegistrationsView } from './components/student/MyRegistrationsView';
import { AnnouncementsView } from './components/student/AnnouncementsView';
import { ResultsView } from './components/student/ResultsView';
import { CertificatesView } from './components/student/CertificatesView';
import { ProfileView } from './components/student/ProfileView';
import { StudentFooter } from './components/student/StudentFooter';

// Restricted Directorate Gateway & Admin Views
import { DirectorateGateway } from './components/admin/DirectorateGateway';
import { AdminDashboardOverview } from './components/admin/AdminDashboardOverview';
import { AdminEventsView } from './components/admin/AdminEventsView';
import { AdminRegistrationsView } from './components/admin/AdminRegistrationsView';
import { AdminAttendanceView } from './components/admin/AdminAttendanceView';
import { AdminAnnouncementsView } from './components/admin/AdminAnnouncementsView';
import { AdminResearchView } from './components/admin/AdminResearchView';
import { AdminCertificatesView } from './components/admin/AdminCertificatesView';
import { AdminCommitteesView } from './components/admin/AdminCommitteesView';
import { AdminAnalyticsView } from './components/admin/AdminAnalyticsView';

import { EventItem } from './types';
import { 
  Menu, 
  ShieldCheck, 
  ExternalLink, 
  LogOut, 
  Lock,
  Sun,
  Moon
} from 'lucide-react';

/* =========================================================================
   1. PUBLIC CAMPUS WEBSITE (DEFAULT ACCESSIBLE - NO LOGIN REQUIRED)
   ========================================================================= */
const PublicCampusLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    announcements, 
    studentUser 
  } = useApp();

  // Determine active tab from URL path or local state
  const getTabFromPath = (pathname: string): StudentNavTab => {
    if (pathname === '/events') return 'events';
    if (pathname === '/calendar') return 'calendar';
    if (pathname === '/announcements' || pathname === '/circulars') return 'announcements';
    if (pathname === '/results') return 'results';
    if (pathname === '/my-registrations' || pathname === '/tickets') return 'my-registrations';
    if (pathname === '/certificates') return 'certificates';
    if (pathname === '/profile') return 'profile';
    return 'home';
  };

  const [studentTab, setStudentTab] = useState<StudentNavTab>(() => getTabFromPath(location.pathname));

  // Sync tab when browser path changes
  useEffect(() => {
    setStudentTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const handleTabSelect = (tab: StudentNavTab) => {
    setStudentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL path accordingly
    const routeMap: Record<StudentNavTab, string> = {
      home: '/',
      events: '/events',
      calendar: '/calendar',
      announcements: '/announcements',
      results: '/results',
      'my-registrations': '/my-registrations',
      certificates: '/certificates',
      profile: '/profile',
    };
    navigate(routeMap[tab] || '/');
  };

  // Student modals state
  const [selectedEventForDetails, setSelectedEventForDetails] = useState<EventItem | null>(null);
  const [selectedEventForRegister, setSelectedEventForRegister] = useState<EventItem | null>(null);

  // Count unread announcements for current student safely
  const unreadAnnouncementsCount = announcements.filter(
    (a) => studentUser ? !a.readBy.includes(studentUser.id) : false
  ).length;

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F7] dark:bg-[#0B0F17] text-[#1D1D1F] dark:text-white selection:bg-[#3A5982] selection:text-white transition-colors">
      {/* Universal Institutional Navigation Header */}
      <StudentNavbar
        currentTab={studentTab}
        onSelectTab={handleTabSelect}
        unreadAnnouncementsCount={unreadAnnouncementsCount}
      />

      {/* Main Public Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {studentTab === 'home' && (
          <HomeView
            onNavigateTab={handleTabSelect}
            onNavigateToEvents={() => handleTabSelect('events')}
            onNavigateToRegistrations={() => handleTabSelect('my-registrations')}
            onNavigateToAnnouncements={() => handleTabSelect('announcements')}
            onNavigateToResults={() => handleTabSelect('results')}
            onNavigateToCertificates={() => handleTabSelect('certificates')}
            onSelectEvent={(evt) => setSelectedEventForDetails(evt)}
            onRegisterEvent={(evt) => setSelectedEventForRegister(evt)}
          />
        )}

        {studentTab === 'events' && (
          <EventsView
            onSelectEvent={(evt) => setSelectedEventForDetails(evt)}
            onRegisterEvent={(evt) => setSelectedEventForRegister(evt)}
          />
        )}

        {studentTab === 'calendar' && (
          <CampusCalendarView
            onSelectEvent={(evt) => setSelectedEventForDetails(evt)}
            onRegisterEvent={(evt) => setSelectedEventForRegister(evt)}
          />
        )}

        {studentTab === 'my-registrations' && (
          <MyRegistrationsView
            onExploreEvents={() => handleTabSelect('events')}
          />
        )}

        {studentTab === 'announcements' && (
          <AnnouncementsView />
        )}

        {studentTab === 'results' && (
          <ResultsView
            onViewCertificates={() => handleTabSelect('certificates')}
          />
        )}

        {studentTab === 'certificates' && (
          <CertificatesView
            onExploreEvents={() => handleTabSelect('events')}
          />
        )}

        {studentTab === 'profile' && (
          <ProfileView />
        )}
      </main>

      {/* University Heritage & Editorial Footer */}
      <StudentFooter 
        onSelectTab={handleTabSelect} 
        onNavigateToAdmin={() => navigate('/admin')}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEventForDetails}
        isOpen={!!selectedEventForDetails}
        onClose={() => setSelectedEventForDetails(null)}
        onRegister={(evt) => {
          setSelectedEventForDetails(null);
          setSelectedEventForRegister(evt);
        }}
        onViewTicket={() => {
          setSelectedEventForDetails(null);
          handleTabSelect('my-registrations');
        }}
      />

      {/* Registration Form Modal (Gated with Institutional @christuniversity.in Authentication) */}
      <RegistrationModal
        event={selectedEventForRegister}
        isOpen={!!selectedEventForRegister}
        onClose={() => setSelectedEventForRegister(null)}
        onRegistrationComplete={() => {
          // Handled inside modal with celebratory feedback
        }}
      />
    </div>
  );
};

/* =========================================================================
   2. RESTRICTED DIRECTORATE & SWO ADMIN PORTAL (URL-GATED: /admin)
   ========================================================================= */
const RestrictedAdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isAdminAuthenticated, 
    authenticateAdmin, 
    logoutAdmin, 
    adminUser,
    theme,
    toggleTheme
  } = useApp();

  const [adminTab, setAdminTab] = useState<AdminNavTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminMobileOpen, setAdminMobileOpen] = useState(false);

  // Admin quick creation triggers
  const [adminOpenCreateEvent, setAdminOpenCreateEvent] = useState(false);
  const [adminOpenCreateNotice, setAdminOpenCreateNotice] = useState(false);

  // If not authenticated, require directorate credentials
  if (!isAdminAuthenticated) {
    return (
      <DirectorateGateway
        onAuthenticated={authenticateAdmin}
        onExitToPublic={() => navigate('/')}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F5F5F7] dark:bg-[#0B0F17] text-[#1D1D1F] dark:text-white selection:bg-[#C5A063] selection:text-white transition-colors">
      {/* Admin Sidebar */}
      <div className={`${adminMobileOpen ? 'block' : 'hidden'} lg:block`}>
        <AdminSidebar
          currentTab={adminTab}
          onSelectTab={(tab) => {
            setAdminTab(tab);
            setAdminMobileOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onExitToPublic={() => navigate('/')}
        />
      </div>

      {/* Mobile backdrop for sidebar */}
      {adminMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setAdminMobileOpen(false)}
        />
      )}

      {/* Admin Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-18' : 'lg:pl-64'
        }`}
      >
        {/* Admin Header Bar */}
        <header className="sticky top-0 z-20 h-16 bg-white/90 dark:bg-[#141A26]/90 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/10 px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAdminMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#1D1D1F] dark:text-white hover:bg-black/[0.05] dark:hover:bg-white/10"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-[#1D1D1F] dark:text-white capitalize">
                  {adminTab === 'research' ? 'Research & Surveys' : adminTab.replace('-', ' ')}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#C5A063]/15 text-[#9D7A3E] dark:text-[#E6C98F] text-[10px] font-bold border border-[#C5A063]/25 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#C5A063]" /> Restricted URL
                </span>
              </div>
              <span className="text-[10px] text-[#86868B] dark:text-slate-300 hidden sm:inline">
                Christ University Student Welfare Office • Yeshwanthpur Campus
              </span>
            </div>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button (Dark / Light Mode) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[#16212F] dark:text-white bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
              title={theme === 'dark' ? 'Switch to Light (White) Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#FFD60A]" />
              ) : (
                <Moon className="w-4 h-4 text-[#3A5982]" />
              )}
            </button>

            {/* Direct button to open Public Website */}
            <button
              onClick={() => navigate('/')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#3A5982] dark:text-blue-300 bg-[#3A5982]/10 dark:bg-white/10 hover:bg-[#3A5982]/20 dark:hover:bg-white/20 transition-colors"
              title="Return to Public Campus Website"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>

            {/* Admin Profile chip */}
            <div className="flex items-center gap-2 pl-2 border-l border-black/[0.06] dark:border-white/10">
              <img
                src={adminUser.avatar}
                alt={adminUser.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-black/10"
              />
              <div className="text-left leading-none hidden sm:block">
                <p className="text-xs font-semibold text-[#1D1D1F] dark:text-white truncate max-w-[120px]">
                  {adminUser.name.split(' ')[0]}
                </p>
                <span className="text-[9px] text-[#86868B] dark:text-slate-300">SWO Staff</span>
              </div>
            </div>

            {/* SWO Admin Sign Out Button */}
            <button
              onClick={() => {
                logoutAdmin();
                navigate('/');
              }}
              className="p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Sign out of SWO Admin session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Admin View Render */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {adminTab === 'dashboard' && (
            <AdminDashboardOverview
              onNavigateTab={(tab) => setAdminTab(tab)}
              onOpenCreateEvent={() => {
                setAdminTab('events');
                setAdminOpenCreateEvent(true);
              }}
              onOpenCreateAnnouncement={() => {
                setAdminTab('announcements');
                setAdminOpenCreateNotice(true);
              }}
            />
          )}

          {adminTab === 'events' && (
            <AdminEventsView
              isCreateOpenInitially={adminOpenCreateEvent}
              onCloseCreateInitial={() => setAdminOpenCreateEvent(false)}
            />
          )}

          {adminTab === 'registrations' && (
            <AdminRegistrationsView />
          )}

          {adminTab === 'attendance' && (
            <AdminAttendanceView />
          )}

          {adminTab === 'announcements' && (
            <AdminAnnouncementsView
              isCreateOpenInitially={adminOpenCreateNotice}
              onCloseCreateInitial={() => setAdminOpenCreateNotice(false)}
            />
          )}

          {adminTab === 'research' && (
            <AdminResearchView />
          )}

          {adminTab === 'certificates' && (
            <AdminCertificatesView />
          )}

          {adminTab === 'committees' && (
            <AdminCommitteesView />
          )}

          {adminTab === 'analytics' && (
            <AdminAnalyticsView />
          )}
        </main>
      </div>
    </div>
  );
};

/* =========================================================================
   3. ROOT APPLICATION WITH ROUTING & GLOBAL PROVIDERS
   ========================================================================= */
const AppRoutes: React.FC = () => {
  const { 
    isLoginModalOpen, 
    closeLoginModal, 
    loginModalReason, 
    pendingSuccessCallback 
  } = useApp();

  return (
    <>
      <Routes>
        {/* Public Website Routes (No Login Required) */}
        <Route path="/" element={<PublicCampusLayout />} />
        <Route path="/events" element={<PublicCampusLayout />} />
        <Route path="/calendar" element={<PublicCampusLayout />} />
        <Route path="/announcements" element={<PublicCampusLayout />} />
        <Route path="/circulars" element={<PublicCampusLayout />} />
        <Route path="/results" element={<PublicCampusLayout />} />
        <Route path="/my-registrations" element={<PublicCampusLayout />} />
        <Route path="/tickets" element={<PublicCampusLayout />} />
        <Route path="/certificates" element={<PublicCampusLayout />} />
        <Route path="/profile" element={<PublicCampusLayout />} />

        {/* Restricted URL for Directorate, Staff & Admin */}
        <Route path="/admin" element={<RestrictedAdminLayout />} />
        <Route path="/directorate" element={<RestrictedAdminLayout />} />

        {/* Fallback to Public Homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Domain-Restricted Institutional Login Modal (@christuniversity.in) */}
      <ChristLoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        actionReason={loginModalReason}
        onSuccess={() => {
          if (pendingSuccessCallback) {
            pendingSuccessCallback();
          }
        }}
      />

      {/* Global Notification Toast Container */}
      <ToastContainer />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}



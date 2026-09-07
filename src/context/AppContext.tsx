import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  EventItem, 
  Registration, 
  Announcement, 
  EventResult, 
  Certificate, 
  Committee, 
  ResearchSurvey,
  AttendanceRecord,
  RegistrationStatus,
  CertificateType,
  UserRole,
  HeroGuest,
  HeroBannerSettings
} from '../types';
import { 
  INITIAL_STUDENT, 
  INITIAL_ADMIN, 
  INITIAL_EVENTS, 
  INITIAL_REGISTRATIONS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_RESULTS, 
  INITIAL_CERTIFICATES, 
  INITIAL_COMMITTEES, 
  INITIAL_RESEARCH_SURVEYS 
} from '../data/mockData';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentUser: User | null;
  studentUser: User | null;
  adminUser: User;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  updateStudentProfile: (updated: Partial<User>) => void;

  // Domain-restricted Student Auth
  isStudentAuthenticated: boolean;
  loginStudent: (email: string, name?: string, regNo?: string, department?: string) => { success: boolean; error?: string };
  logoutStudent: () => void;

  // Dark Mode Theme (User-selectable Apple Charcoal)
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Login Modal Trigger
  isLoginModalOpen: boolean;
  loginModalReason: string;
  openLoginModal: (reason?: string, onSuccess?: () => void) => void;
  closeLoginModal: () => void;

  // Restricted Directorate / Admin Auth
  isAdminAuthenticated: boolean;
  authenticateAdmin: () => void;
  logoutAdmin: () => void;

  // Events
  events: EventItem[];
  addEvent: (event: Omit<EventItem, 'id' | 'registeredCount'>) => EventItem;
  updateEvent: (id: string, updated: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  toggleCarousel: (id: string, inCarousel: boolean, order?: number) => void;

  // Registrations
  registrations: Registration[];
  registerForEvent: (eventId: string, customAnswers?: Record<string, string>) => { success: boolean; registration?: Registration; message?: string };
  cancelRegistration: (registrationId: string) => void;
  updateRegistrationStatus: (id: string, status: RegistrationStatus) => void;

  // Attendance
  attendanceRecords: AttendanceRecord[];
  markAttendance: (
    eventIdOrCode: string,
    studentIdOrEventId?: string,
    method?: 'QR' | 'Manual' | 'Bulk'
  ) => {
    success: boolean;
    message: string;
    record?: AttendanceRecord;
    registration?: Registration;
  };
  unmarkAttendance: (attendanceId: string) => void;
  bulkMarkAttendance: (eventId: string) => number;
  registerSpotAttendee: (
    eventId: string,
    student: { name: string; regNo: string; dept: string; email?: string; role?: string }
  ) => { success: boolean; registration?: Registration; message: string };

  // Announcements
  announcements: Announcement[];
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'readBy' | 'date' | 'authorName' | 'authorRole'>) => void;
  toggleAnnouncementPin: (id: string) => void;
  markAnnouncementAsRead: (id: string) => void;
  markAllAnnouncementsAsRead: () => void;
  deleteAnnouncement: (id: string) => void;

  // Certificates
  certificates: Certificate[];
  issueCertificate: (cert: Omit<Certificate, 'id' | 'certificateNo' | 'qrVerifyCode' | 'issuedDate'>) => Certificate;
  bulkIssueCertificatesForEvent: (eventId: string, type: CertificateType) => number;

  // Results
  results: EventResult[];

  // Committees
  committees: Committee[];
  addCommitteeMember: (committeeId: string, member: { name: string; role: string; regNo: string; department: string; email: string }) => void;

  // Research Surveys
  surveys: ResearchSurvey[];
  submitSurveyResponse: (surveyId: string, answers: Record<string, string | number>) => void;
  createSurvey: (survey: Omit<ResearchSurvey, 'id' | 'responsesCount' | 'status'>) => void;

  // Hero Banner & Featured Guests Management
  heroSettings: HeroBannerSettings;
  updateHeroSettings: (updated: Partial<HeroBannerSettings>) => void;
  resetHeroSettings: () => void;

  // UI Toast
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
}

export const INITIAL_HERO_SETTINGS: HeroBannerSettings = {
  badge: 'STUDENT WELFARE TALK SERIES • FLAGSHIP INAUGURAL',
  title: 'TALK SERIES COMING SOON',
  subtitle: 'Distinguished Voices & Vanguard Leadership at Yeshwanthpur',
  description: 'An intellectually charged semester dialogue uniting pioneering technologists, public policy changemakers, and visionary leaders with the vibrant student community of Christ University.',
  date: 'Friday, September 18, 2026',
  time: '03:30 PM – 06:00 PM IST',
  venue: 'Main University Auditorium • Tier 1 & 2',
  speakers: [
    {
      id: 'spk-1',
      name: 'Dr. Aarav Nambiar',
      role: 'Chief AI Architect & Fellow',
      org: 'DeepMind Research Lab',
      avatar: 'https://farm66.staticflickr.com/65535/53600439267_de66a73a92_b.jpg'
    },
    {
      id: 'spk-2',
      name: 'Prof. Maya Sengupta',
      role: 'Director of Cyber Ethics',
      org: 'Global Policy Council',
      avatar: 'https://farm66.staticflickr.com/65535/54775630968_3b1b6f2374_b.jpg'
    },
    {
      id: 'spk-3',
      name: 'Kavita Sundaram',
      role: 'VP Emerging Tech',
      org: 'QuantumCore Labs',
      avatar: 'https://farm66.staticflickr.com/65535/53882241965_c4806b8f4c_b.jpg'
    }
  ],
  accentColor: '#C5A063',
  bgImage: 'https://farm66.staticflickr.com/65535/53601520593_35b116390a_b.jpg',
  tags: ['Christ University Exclusive', 'Official SWO Accredited', 'OD Granted', 'Live Broadcast']
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage helpers
  const getStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`cu_swo_${key}`);
      if (!item) return fallback;
      // Auto-migrate away from any old stock unsplash placeholders
      if (item.includes('unsplash.com')) {
        localStorage.removeItem(`cu_swo_${key}`);
        return fallback;
      }
      return JSON.parse(item);
    } catch {
      return fallback;
    }
  };

  const setStored = <T,>(key: string, value: T) => {
    try {
      localStorage.setItem(`cu_swo_${key}`, JSON.stringify(value));
    } catch {
      // storage quota or private mode fallback
    }
  };

  // Public by default: studentUser starts as null unless previously signed in
  const [studentUser, setStudentUser] = useState<User | null>(() => getStored<User | null>('student_user', null));
  const [adminUser] = useState<User>(INITIAL_ADMIN);
  const [currentRole, setCurrentRole] = useState<UserRole>(() => getStored('active_role', 'student'));
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => getStored('admin_auth', false));

  // Apple-style Dark Mode & White Mode Theme State
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('cu_theme_mode');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // fallback
    }
    return 'light';
  });

  const toggleTheme = () => {
    setThemeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('cu_theme_mode', next);
      } catch {}
      return next;
    });
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('cu_theme_mode', newTheme);
    } catch {}
  };

  // Synchronize dark class and background color on html/body
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-theme', 'dark');
        document.body.style.backgroundColor = '#0B0F17';
        document.body.style.color = '#F8FAFC';
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        root.setAttribute('data-theme', 'light');
        document.body.style.backgroundColor = '#F8FAFC';
        document.body.style.color = '#16212F';
      }
    }
  }, [theme]);

  // Login Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalReason, setLoginModalReason] = useState('Sign in with your official Christ University institutional email to continue.');
  const [pendingSuccessCallback, setPendingSuccessCallback] = useState<(() => void) | null>(null);

  const isStudentAuthenticated = !!studentUser;
  const currentUser = currentRole === 'student' ? studentUser : adminUser;

  const [events, setEvents] = useState<EventItem[]>(() => getStored('events', INITIAL_EVENTS));
  const [registrations, setRegistrations] = useState<Registration[]>(() => getStored('registrations', INITIAL_REGISTRATIONS));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => getStored('announcements', INITIAL_ANNOUNCEMENTS));
  const [certificates, setCertificates] = useState<Certificate[]>(() => getStored('certificates', INITIAL_CERTIFICATES));
  const [results] = useState<EventResult[]>(INITIAL_RESULTS);
  const [committees, setCommittees] = useState<Committee[]>(() => getStored('committees', INITIAL_COMMITTEES));
  const [surveys, setSurveys] = useState<ResearchSurvey[]>(() => getStored('surveys', INITIAL_RESEARCH_SURVEYS));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => getStored('attendance', []));
  const [heroSettings, setHeroSettings] = useState<HeroBannerSettings>(() => getStored('hero_settings', INITIAL_HERO_SETTINGS));
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => { setStored('student_user', studentUser); }, [studentUser]);
  useEffect(() => { setStored('active_role', currentRole); }, [currentRole]);
  useEffect(() => { setStored('admin_auth', isAdminAuthenticated); }, [isAdminAuthenticated]);
  useEffect(() => { setStored('events', events); }, [events]);
  useEffect(() => { setStored('registrations', registrations); }, [registrations]);
  useEffect(() => { setStored('announcements', announcements); }, [announcements]);
  useEffect(() => { setStored('certificates', certificates); }, [certificates]);
  useEffect(() => { setStored('committees', committees); }, [committees]);
  useEffect(() => { setStored('surveys', surveys); }, [surveys]);
  useEffect(() => { setStored('attendance', attendanceRecords); }, [attendanceRecords]);
  useEffect(() => { setStored('hero_settings', heroSettings); }, [heroSettings]);

  const updateHeroSettings = (updated: Partial<HeroBannerSettings>) => {
    setHeroSettings((prev) => {
      const next = { ...prev, ...updated };
      setStored('hero_settings', next);
      return next;
    });
    showToast('Featured Showcase Updated', 'Homepage hero banner, dates, and guests have been updated live.', 'success');
  };

  const resetHeroSettings = () => {
    setHeroSettings(INITIAL_HERO_SETTINGS);
    setStored('hero_settings', INITIAL_HERO_SETTINGS);
    showToast('Showcase Reset', 'Reverted to default Talk Series flagship configuration.', 'info');
  };

  // Toast System
  const showToast = (title: string, description?: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openLoginModal = (reason?: string, onSuccess?: () => void) => {
    if (reason) setLoginModalReason(reason);
    if (onSuccess) {
      setPendingSuccessCallback(() => onSuccess);
    } else {
      setPendingSuccessCallback(null);
    }
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setPendingSuccessCallback(null);
  };

  const loginStudent = (
    email: string,
    name?: string,
    regNo?: string,
    department?: string
  ): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Institutional email is required.' };
    }

    if (!cleanEmail.endsWith('@christuniversity.in')) {
      return {
        success: false,
        error: 'Access Restricted: Only official Christ University accounts terminating in @christuniversity.in are permitted.'
      };
    }

    const defaultName = name?.trim() || cleanEmail
      .split('@')[0]
      .split('.')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const defaultRegNo = regNo?.trim() || ('24' + Math.floor(10000 + Math.random() * 90000));
    const defaultDept = department || 'School of Engineering and Technology';

    const newStudent: User = {
      id: 'usr_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_'),
      name: defaultName,
      role: 'student',
      regNo: defaultRegNo,
      department: defaultDept,
      year: '2nd Year (Semester 4)',
      campus: 'Yeshwanthpur Campus, Bengaluru',
      email: cleanEmail,
      phone: '+91 98450 12890',
      avatar: 'https://farm66.staticflickr.com/65535/53188337164_f346df7a8f_b.jpg',
    };

    setStudentUser(newStudent);
    showToast('Signed In', `Welcome back, ${defaultName}.`, 'success');

    if (pendingSuccessCallback) {
      setTimeout(() => {
        pendingSuccessCallback();
        setPendingSuccessCallback(null);
      }, 150);
    }

    return { success: true };
  };

  const logoutStudent = () => {
    setStudentUser(null);
    localStorage.removeItem('cu_swo_student_user');
    showToast('Signed Out', 'You are now browsing the public campus website.', 'info');
  };

  const authenticateAdmin = () => {
    setIsAdminAuthenticated(true);
    setStored('admin_auth', true);
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setStored('admin_auth', false);
    showToast('SWO Admin Signed Out', 'Returned to public university session.', 'info');
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    showToast(
      role === 'student' ? 'Switched to Public View' : 'Switched to SWO Admin Dashboard',
      role === 'student' ? (studentUser ? `Logged in as ${studentUser.name}` : 'Public Campus Explorer') : `Logged in as ${adminUser.name}`,
      'info'
    );
  };

  const updateStudentProfile = (updated: Partial<User>) => {
    if (!studentUser) return;
    setStudentUser((prev) => prev ? { ...prev, ...updated } : null);
    showToast('Profile Updated', 'Your student details have been saved successfully.', 'success');
  };

  // Event Handlers
  const addEvent = (eventData: Omit<EventItem, 'id' | 'registeredCount'>): EventItem => {
    const newId = 'evt_' + Date.now().toString(36);
    const newEvent: EventItem = {
      ...eventData,
      id: newId,
      registeredCount: 0,
    };
    setEvents((prev) => [newEvent, ...prev]);
    showToast('Event Created', `"${newEvent.title}" was successfully created and published.`, 'success');
    return newEvent;
  };

  const updateEvent = (id: string, updated: Partial<EventItem>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
    showToast('Event Updated', 'Changes were saved successfully.', 'success');
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    showToast('Event Deleted', 'The event has been removed from the schedule.', 'info');
  };

  const toggleCarousel = (id: string, inCarousel: boolean, order?: number) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            inCarousel,
            carouselOrder: order !== undefined ? order : e.carouselOrder || 1,
          };
        }
        return e;
      })
    );
    showToast('Carousel Updated', inCarousel ? 'Banner added to homepage carousel.' : 'Banner removed from homepage carousel.', 'info');
  };

  // Registration Handlers
  const registerForEvent = (eventId: string, customAnswers?: Record<string, string>) => {
    if (!studentUser) {
      return { 
        success: false, 
        message: 'Institutional login required: Please sign in with your @christuniversity.in account to register.' 
      };
    }

    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return { success: false, message: 'Event not found.' };

    // Check if already registered
    const alreadyRegistered = registrations.some(
      (r) => r.eventId === eventId && r.studentId === studentUser.id && r.status !== 'Cancelled'
    );
    if (alreadyRegistered) {
      return { success: false, message: 'You are already registered for this event.' };
    }

    // Capacity check for waitlist
    const isFull = targetEvent.registeredCount >= targetEvent.capacity;
    const status: RegistrationStatus = isFull ? 'Waitlisted' : 'Registered';
    const randCode = Math.floor(1000 + Math.random() * 9000);
    const ticketCode = `SWO-${targetEvent.category.substring(0, 4).toUpperCase()}-${studentUser.regNo}-${randCode}`;

    const newReg: Registration = {
      id: 'reg_' + Date.now().toString(36),
      eventId: targetEvent.id,
      eventTitle: targetEvent.title,
      eventDate: targetEvent.date,
      eventTime: targetEvent.time,
      eventVenue: targetEvent.venue,
      studentId: studentUser.id,
      studentName: studentUser.name,
      studentRegNo: studentUser.regNo,
      studentEmail: studentUser.email,
      studentDept: studentUser.department,
      studentYear: studentUser.year,
      registeredAt: new Date().toISOString(),
      status,
      customAnswers,
      ticketCode,
    };

    setRegistrations((prev) => [newReg, ...prev]);

    // Update count on event
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e))
    );

    showToast(
      isFull ? 'Added to Waitlist' : 'Registration Confirmed! 🎉',
      `You are ${status.toLowerCase()} for "${targetEvent.title}". Ticket: ${ticketCode}`,
      'success'
    );

    return { success: true, registration: newReg };
  };

  const cancelRegistration = (registrationId: string) => {
    const reg = registrations.find((r) => r.id === registrationId);
    if (!reg) return;

    setRegistrations((prev) =>
      prev.map((r) => (r.id === registrationId ? { ...r, status: 'Cancelled' as RegistrationStatus } : r))
    );

    // Reduce event count
    setEvents((prev) =>
      prev.map((e) => (e.id === reg.eventId ? { ...e, registeredCount: Math.max(0, e.registeredCount - 1) } : e))
    );

    showToast('Registration Cancelled', `Cancelled registration for "${reg.eventTitle}".`, 'info');
  };

  const updateRegistrationStatus = (id: string, status: RegistrationStatus) => {
    setRegistrations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    showToast('Status Updated', `Registration status updated to ${status}.`, 'info');
  };

  // Attendance Handlers
  const markAttendance = (
    eventIdOrCode: string,
    studentIdOrEventId?: string,
    method: 'QR' | 'Manual' | 'Bulk' = 'Manual'
  ) => {
    let resolvedEventId = '';
    let searchToken = '';

    // Determine if first param is eventId or ticket/student code
    if (events.some((e) => e.id === eventIdOrCode)) {
      resolvedEventId = eventIdOrCode;
      searchToken = studentIdOrEventId?.trim() || '';
    } else if (studentIdOrEventId && events.some((e) => e.id === studentIdOrEventId)) {
      resolvedEventId = studentIdOrEventId;
      searchToken = eventIdOrCode.trim();
    } else {
      // Automatic lookup from registration
      searchToken = eventIdOrCode.trim();
      const match = registrations.find(
        (r) => r.ticketCode === searchToken || r.studentRegNo === searchToken
      );
      if (match) {
        resolvedEventId = match.eventId;
      } else {
        resolvedEventId = events[0]?.id || '';
      }
    }

    if (!searchToken) {
      return { success: false, message: 'Please scan or provide a valid ticket code or registration number.' };
    }

    // Check if student is registered for this event
    const reg = registrations.find(
      (r) =>
        r.eventId === resolvedEventId &&
        (r.ticketCode.toLowerCase() === searchToken.toLowerCase() ||
          r.studentRegNo.toLowerCase() === searchToken.toLowerCase() ||
          r.studentId === searchToken)
    );

    // If not found in current event, check if registered for any other event
    if (!reg) {
      const otherReg = registrations.find(
        (r) =>
          r.ticketCode.toLowerCase() === searchToken.toLowerCase() ||
          r.studentRegNo.toLowerCase() === searchToken.toLowerCase()
      );
      if (otherReg) {
        const otherEvent = events.find((e) => e.id === otherReg.eventId);
        return {
          success: false,
          message: `Ticket is registered for "${otherEvent?.title || otherReg.eventTitle}", not this event.`,
          registration: otherReg,
        };
      }
      return {
        success: false,
        message: `No active registration found for code/number "${searchToken}".`,
      };
    }

    const targetStudentId = reg.studentId;
    const targetStudentName = reg.studentName;
    const targetStudentReg = reg.studentRegNo;
    const targetStudentDept = reg.studentDept;

    // Check if already checked in
    const alreadyAttended = attendanceRecords.some(
      (a) => a.eventId === resolvedEventId && (a.studentId === targetStudentId || a.studentRegNo === targetStudentReg)
    );
    if (alreadyAttended) {
      return {
        success: false,
        message: `${targetStudentName} (${targetStudentReg}) has already been checked in.`,
        registration: reg,
      };
    }

    const newRecord: AttendanceRecord = {
      id: 'att_' + Date.now().toString(36),
      eventId: resolvedEventId,
      studentId: targetStudentId,
      studentName: targetStudentName,
      studentRegNo: targetStudentReg,
      studentDept: targetStudentDept,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      method,
    };

    setAttendanceRecords((prev) => [newRecord, ...prev]);

    // Update registration status to 'Attended'
    setRegistrations((prev) =>
      prev.map((r) => (r.id === reg.id ? { ...r, status: 'Attended' as RegistrationStatus } : r))
    );

    showToast('Admitted & Verified ✓', `${targetStudentName} (${targetStudentReg}) admitted at Gate.`, 'success');
    return { success: true, message: 'Check-in confirmed.', record: newRecord, registration: reg };
  };

  const unmarkAttendance = (attendanceId: string) => {
    const record = attendanceRecords.find((a) => a.id === attendanceId);
    if (!record) return;

    setAttendanceRecords((prev) => prev.filter((a) => a.id !== attendanceId));

    // Revert registration status to 'Registered'
    setRegistrations((prev) =>
      prev.map((r) => {
        if (
          r.eventId === record.eventId &&
          (r.studentId === record.studentId || r.studentRegNo === record.studentRegNo)
        ) {
          return { ...r, status: 'Registered' as RegistrationStatus };
        }
        return r;
      })
    );

    showToast('Check-In Reverted', `Attendance record for ${record.studentName} removed.`, 'info');
  };

  const registerSpotAttendee = (
    eventId: string,
    student: { name: string; regNo: string; dept: string; email?: string; role?: string }
  ) => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) {
      return { success: false, message: 'Event not found.' };
    }

    const randCode = Math.floor(1000 + Math.random() * 9000);
    const prefix = student.role === 'VIP' ? 'VIP' : targetEvent.category.substring(0, 4).toUpperCase();
    const ticketCode = `SWO-${prefix}-${student.regNo}-${randCode}`;

    const newReg: Registration = {
      id: 'reg_spot_' + Date.now().toString(36),
      eventId,
      eventTitle: targetEvent.title,
      eventDate: targetEvent.date,
      eventTime: targetEvent.time,
      eventVenue: targetEvent.venue,
      studentId: 'spot_' + student.regNo,
      studentName: student.name,
      studentRegNo: student.regNo,
      studentEmail: student.email || `${student.regNo.toLowerCase()}@christuniversity.in`,
      studentDept: student.dept,
      studentYear: 'Spot Registration',
      registeredAt: new Date().toISOString().split('T')[0],
      status: 'Registered',
      ticketCode,
    };

    setRegistrations((prev) => [newReg, ...prev]);
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e))
    );

    showToast('Spot Pass Generated', `Pass issued for ${student.name}. Ticket: ${ticketCode}`, 'success');
    return { success: true, registration: newReg, message: 'Spot pass generated successfully.' };
  };

  const bulkMarkAttendance = (eventId: string) => {
    const eventRegs = registrations.filter((r) => r.eventId === eventId && r.status === 'Registered');
    if (eventRegs.length === 0) {
      showToast('No Pending Attendees', 'All registered students are already marked or no registrations exist.', 'warning');
      return 0;
    }

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newRecords: AttendanceRecord[] = eventRegs.map((r) => ({
      id: 'att_' + Math.random().toString(36).substring(2, 9),
      eventId,
      studentId: r.studentId,
      studentName: r.studentName,
      studentRegNo: r.studentRegNo,
      studentDept: r.studentDept,
      checkInTime: now,
      method: 'Bulk',
    }));

    setAttendanceRecords((prev) => [...newRecords, ...prev]);
    setRegistrations((prev) =>
      prev.map((r) => (r.eventId === eventId && r.status === 'Registered' ? { ...r, status: 'Attended' as RegistrationStatus } : r))
    );

    showToast('Bulk Attendance Marked', `Successfully checked in ${newRecords.length} attendees.`, 'success');
    return newRecords.length;
  };

  // Announcements
  const createAnnouncement = (announcementData: Omit<Announcement, 'id' | 'readBy' | 'date' | 'authorName' | 'authorRole'>) => {
    const newAnn: Announcement = {
      ...announcementData,
      id: 'ann_' + Date.now().toString(36),
      date: new Date().toISOString().split('T')[0],
      readBy: [],
      authorName: adminUser.name,
      authorRole: 'Student Welfare Office',
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast('Announcement Published', `"${newAnn.title}" is now visible to students.`, 'success');
  };

  const toggleAnnouncementPin = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
  };

  const markAnnouncementAsRead = (id: string) => {
    if (!studentUser) return;
    setAnnouncements((prev) =>
      prev.map((a) => {
        if (a.id === id && !a.readBy.includes(studentUser.id)) {
          return { ...a, readBy: [...a.readBy, studentUser.id] };
        }
        return a;
      })
    );
  };

  const markAllAnnouncementsAsRead = () => {
    if (!studentUser) return;
    setAnnouncements((prev) =>
      prev.map((a) => ({
        ...a,
        readBy: Array.from(new Set([...a.readBy, studentUser.id])),
      }))
    );
    showToast('All Marked Read', 'All circulars and announcements marked as read.', 'info');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast('Announcement Removed', 'Circular removed successfully.', 'info');
  };

  // Certificates
  const issueCertificate = (certData: Omit<Certificate, 'id' | 'certificateNo' | 'qrVerifyCode' | 'issuedDate'>): Certificate => {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const certNo = `CU-SWO-${new Date().getFullYear()}-${certData.type.substring(0, 3).toUpperCase()}-${randomHex}`;
    const newCert: Certificate = {
      ...certData,
      id: 'cert_' + Date.now().toString(36),
      certificateNo: certNo,
      issuedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      qrVerifyCode: `https://christuniversity.in/verify/cert/${certNo}`,
    };

    setCertificates((prev) => [newCert, ...prev]);
    showToast('Certificate Issued', `Issued ${newCert.type} certificate for ${newCert.studentName}.`, 'success');
    return newCert;
  };

  const bulkIssueCertificatesForEvent = (eventId: string, type: CertificateType): number => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return 0;

    // Find all attended registrations
    const attendedRegs = registrations.filter((r) => r.eventId === eventId && r.status === 'Attended');
    if (attendedRegs.length === 0) {
      showToast('No Attendees Found', 'Mark attendance for students first before issuing bulk certificates.', 'warning');
      return 0;
    }

    const issuedDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const newCerts: Certificate[] = attendedRegs.map((reg) => {
      const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
      const certNo = `CU-SWO-${new Date().getFullYear()}-${type.substring(0, 3).toUpperCase()}-${randomHex}`;
      return {
        id: 'cert_' + Math.random().toString(36).substring(2, 9),
        certificateNo: certNo,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        studentName: reg.studentName,
        studentRegNo: reg.studentRegNo,
        department: reg.studentDept,
        type,
        issuedDate,
        authorizedBy: 'Dr. Mathew K. Varghese',
        designation: 'Student Welfare Officer, Christ University',
        qrVerifyCode: `https://christuniversity.in/verify/cert/${certNo}`,
      };
    });

    setCertificates((prev) => [...newCerts, ...prev]);
    showToast('Certificates Published', `Generated and pushed ${newCerts.length} certificates to student portals.`, 'success');
    return newCerts.length;
  };

  // Committees
  const addCommitteeMember = (committeeId: string, member: { name: string; role: string; regNo: string; department: string; email: string }) => {
    setCommittees((prev) =>
      prev.map((c) => {
        if (c.id === committeeId) {
          return {
            ...c,
            memberCount: c.memberCount + 1,
            members: [...c.members, { ...member, id: 'm_' + Date.now().toString(36) }],
          };
        }
        return c;
      })
    );
    showToast('Member Added', `${member.name} added to committee team.`, 'success');
  };

  // Surveys
  const submitSurveyResponse = (surveyId: string, answers: Record<string, string | number>) => {
    setSurveys((prev) =>
      prev.map((s) => (s.id === surveyId ? { ...s, responsesCount: s.responsesCount + 1 } : s))
    );
    showToast('Survey Submitted', 'Thank you for your valuable feedback to the Student Welfare Office!', 'success');
  };

  const createSurvey = (surveyData: Omit<ResearchSurvey, 'id' | 'responsesCount' | 'status'>) => {
    const newSurvey: ResearchSurvey = {
      ...surveyData,
      id: 'surv_' + Date.now().toString(36),
      responsesCount: 0,
      status: 'Active',
    };
    setSurveys((prev) => [newSurvey, ...prev]);
    showToast('Research Survey Published', `"${newSurvey.title}" is now open for responses.`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        studentUser,
        adminUser,
        currentRole,
        switchRole,
        updateStudentProfile,

        isStudentAuthenticated,
        loginStudent,
        logoutStudent,
        theme,
        toggleTheme,
        setTheme,
        isLoginModalOpen,
        loginModalReason,
        openLoginModal,
        closeLoginModal,
        isAdminAuthenticated,
        authenticateAdmin,
        logoutAdmin,

        events,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleCarousel,

        registrations,
        registerForEvent,
        cancelRegistration,
        updateRegistrationStatus,

        attendanceRecords,
        markAttendance,
        unmarkAttendance,
        bulkMarkAttendance,
        registerSpotAttendee,

        announcements,
        createAnnouncement,
        toggleAnnouncementPin,
        markAnnouncementAsRead,
        markAllAnnouncementsAsRead,
        deleteAnnouncement,

        certificates,
        issueCertificate,
        bulkIssueCertificatesForEvent,

        results,
        committees,
        addCommitteeMember,

        surveys,
        submitSurveyResponse,
        createSurvey,

        heroSettings,
        updateHeroSettings,
        resetHeroSettings,

        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

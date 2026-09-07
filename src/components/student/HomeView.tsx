import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EventItem } from '../../types';
import { GenCiHeroSection } from './GenCiHeroSection';
import { ScrollingBannersSection } from './ScrollingBannersSection';
import { StudentNavTab } from '../navigation/StudentNavbar';
import { 
  Calendar, 
  MapPin, 
  ArrowRight, 
  ArrowUpRight, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Clock, 
  Users, 
  Building2, 
  Phone, 
  Mail,
  Sparkles,
  Award,
  Ticket,
  SlidersHorizontal
} from 'lucide-react';

interface HomeViewProps {
  onNavigateTab?: (tab: StudentNavTab) => void;
  onSelectEvent: (event: EventItem) => void;
  onQuickRegister?: (event: EventItem) => void;
  onRegisterEvent?: (event: EventItem) => void;
  onNavigateToEvents?: () => void;
  onNavigateToRegistrations?: () => void;
  onNavigateToAnnouncements?: () => void;
  onNavigateToResults?: () => void;
  onNavigateToCertificates?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateTab,
  onSelectEvent,
  onQuickRegister,
  onRegisterEvent,
  onNavigateToEvents,
  onNavigateToRegistrations,
  onNavigateToAnnouncements,
  onNavigateToResults,
  onNavigateToCertificates,
}) => {
  const { events, announcements, registrations, studentUser, openLoginModal } = useApp();

  // Navigation router helper
  const navigateTo = (tab: StudentNavTab) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else {
      if (tab === 'events' && onNavigateToEvents) onNavigateToEvents();
      if (tab === 'my-registrations' && onNavigateToRegistrations) onNavigateToRegistrations();
      if (tab === 'announcements' && onNavigateToAnnouncements) onNavigateToAnnouncements();
      if (tab === 'results' && onNavigateToResults) onNavigateToResults();
      if (tab === 'certificates' && onNavigateToCertificates) onNavigateToCertificates();
    }
  };

  const handleRegister = (evt: EventItem) => {
    if (!studentUser) {
      openLoginModal(
        `Institutional Login Required: Sign in with your official @christuniversity.in account to register for "${evt.title}".`,
        () => {
          if (onRegisterEvent) onRegisterEvent(evt);
          else if (onQuickRegister) onQuickRegister(evt);
          else onSelectEvent(evt);
        }
      );
      return;
    }
    if (onQuickRegister) onQuickRegister(evt);
    else if (onRegisterEvent) onRegisterEvent(evt);
    else onSelectEvent(evt);
  };

  // Published upcoming events
  const publishedEvents = events
    .filter((e) => e.status === 'Published')
    .slice(0, 4);

  // Latest announcements
  const latestAnnouncements = announcements.slice(0, 3);

  // Campus Venues for Section 3 (Oxford Library Showcase style)
  const venues = [
    {
      id: 'auditorium',
      number: '01 / 05',
      name: 'Main University Auditorium',
      watermark: 'AUDITORIUM',
      capacity: '1,200 Seats',
      features: 'Acoustic Soundstage • Dual Balconies • Motorized Rigging',
      description: 'The epicenter of cultural mega-fests, national conferences, academic convocations, and inter-collegiate performances at Yeshwanthpur.',
      image: 'https://farm66.staticflickr.com/65535/53890794279_c2e8e2a4bc_b.jpg',
    },
    {
      id: 'amphitheatre',
      number: '02 / 05',
      name: 'Central Open-Air Amphitheatre',
      watermark: 'AMPHITHEATRE',
      capacity: '800 Standing/Stepped',
      features: 'Stepped Seating • Natural Resonance • Sunset Vistas',
      description: 'Lush open-air arena designed for acoustic street plays, battle of the bands, poetry open-mics, and student flash mobs.',
      image: 'https://farm66.staticflickr.com/65535/53589012105_a341a3ffee_b.jpg',
    },
    {
      id: 'performing-arts',
      number: '03 / 05',
      name: 'Performing Arts & Choir Studio',
      watermark: 'STUDIO',
      capacity: '150 Rehearsal',
      features: 'Hardwood Sprung Flooring • Acoustic Paneling • Full Wall Mirrors',
      description: 'Dedicated sanctuary for university dance ensembles, university choir rehearsals, theatrical blocking, and vocal training.',
      image: 'https://farm66.staticflickr.com/65535/53662408075_e9557b0e6a_b.jpg',
    },
    {
      id: 'seminar-hall',
      number: '04 / 05',
      name: 'Executive Seminar & Conclave Hall',
      watermark: 'CONCLAVE',
      capacity: '300 Executive Seats',
      features: 'Simultaneous AV Feeds • Press Gallery • Ergonomic Seating',
      description: 'Formal venue for national youth parliaments, keynote speaker series, academic symposiums, and departmental summits.',
      image: 'https://farm66.staticflickr.com/65535/53601520593_35b116390a_b.jpg',
    },
    {
      id: 'swo-hub',
      number: '05 / 05',
      name: 'Student Welfare Council Hub',
      watermark: 'COUNCIL',
      capacity: '80 Delegate Tables',
      features: 'Modular Meeting Desks • Helpdesk Station • Digital Boardroom',
      description: 'Headquarters of the Student Welfare Office, hosting weekly council meetings, festival core committees, and peer welfare groups.',
      image: 'https://farm66.staticflickr.com/65535/53188337164_f346df7a8f_b.jpg',
    },
  ];

  const [activeVenueIdx, setActiveVenueIdx] = useState(0);
  const currentVenue = venues[activeVenueIdx];

  // Directorate Wings (Section 4 Numbered List)
  const wings = [
    {
      number: '01',
      title: 'Cultural & Performing Arts Wing',
      subtitle: 'Dance, Music, Theatre, Literary Arts & Fine Arts',
      description: 'Nurturing university teams representing Christ in national youth festivals, staging annual theatre musicals, and producing flagship cultural showcases like Blossoms and Darpan.',
      linkText: 'Explore Cultural Events',
      tab: 'events' as StudentNavTab,
    },
    {
      number: '02',
      title: 'Student Council & Leadership Wing',
      subtitle: 'University Governance, Departmental Conveners & Peer Welfare',
      description: 'The student governing body facilitating communication between university leadership and students, coordinating campus welfare initiatives, and organizing town halls.',
      linkText: 'View Circulars & Councils',
      tab: 'announcements' as StudentNavTab,
    },
    {
      number: '03',
      title: 'Student Health & Wellbeing Cell',
      subtitle: 'Mental Wellness, Peer Support Circles & Wellness Workshops',
      description: 'Dedicated to student well-being through confidential counseling sessions, stress resilience workshops, mindfulness retreats, and suicide prevention advocacy.',
      linkText: 'Access Wellness Resources',
      tab: 'announcements' as StudentNavTab,
    },
    {
      number: '04',
      title: 'Social Responsibility, Outreach & Sustainability',
      subtitle: 'Community Drives, Rural Immersion & Eco-Campus Chapters',
      description: 'Mobilizing student volunteers for blood donation drives, educational aid to rural schools in Karnataka, urban cleanups, and carbon-neutral campus projects.',
      linkText: 'Join Outreach Drives',
      tab: 'events' as StudentNavTab,
    },
  ];

  // Interactive Helpdesk Form State (Section 8)
  const [inquiryForm, setInquiryForm] = useState({
    firstName: studentUser?.name ? studentUser.name.split(' ')[0] : '',
    lastName: studentUser?.name ? studentUser.name.split(' ').slice(1).join(' ') : '',
    email: studentUser?.email || '',
    regNo: studentUser?.regNo || '',
    category: 'Event Registration',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [bannerMode, setBannerMode] = useState<'scrolling' | 'spotlight'>('scrolling');

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.message.trim()) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setInquiryForm((prev) => ({ ...prev, message: '' }));
      setFormSubmitted(false);
    }, 4000);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* =========================================================================
          HERO STAGE: BIG & FULLY FILLED GENCI UI SHOWCASE (TALK SERIES & CONCLAVE)
          Full-page immersive banner with Christ branding and customizer
          ========================================================================= */}
      <section>
        <GenCiHeroSection
          onExploreReel={() => {
            const el = document.getElementById('campus-scrolling-reel');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onNavigateToEvents={() => navigateTo('events')}
          onSelectEvent={onSelectEvent}
          onQuickRegister={handleRegister}
        />
      </section>

      {/* =========================================================================
          CAMPUS HIGHLIGHTS & FEATURED BANNERS (TOWARDS DOWN DIRECTION)
          Continuous Scrolling Reel (Scrolling Towards Left) with Post Reel & Slow Speed
          ========================================================================= */}
      <section className="space-y-3">
        <ScrollingBannersSection
          events={events}
          onSelectEvent={onSelectEvent}
          onQuickRegister={handleRegister}
          onExploreAll={() => navigateTo('events')}
        />
      </section>


      {/* =========================================================================
          SECTION 2: "CHRIST SWO AT A GLANCE" (Oxford Reference Section 2)
          Key Numbers / Stats Grid with hairline dividers & italicized gold headers
          ========================================================================= */}
      <section className="bg-white dark:bg-[#141A26] rounded-[28px] lg:rounded-[36px] border border-[#E2E8F0] dark:border-white/10 p-6 sm:p-10 lg:p-14 shadow-sm transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-[#E2E8F0] dark:border-white/10">
          
          {/* Left Column: Recap Badge & Title */}
          <div className="lg:col-span-5 space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-[#3A5982]/10 dark:bg-[#60A5FA]/15 text-[#3A5982] dark:text-[#93C5FD] text-[11px] font-bold tracking-widest uppercase border border-[#3A5982]/20 dark:border-[#60A5FA]/20">
              2025–2026 ACADEMIC RECAP
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16212F] dark:text-[#F8FAFC] tracking-tight leading-tight">
              Christ SWO at a Glance
            </h2>

            <p className="text-sm text-[#536275] dark:text-[#94A3B8] leading-relaxed max-w-md">
              The Student Welfare Office at Yeshwanthpur coordinates cultural ecosystems, student governance, holistic wellness, and verified leadership accreditations.
            </p>

            <div className="pt-2">
              <button
                onClick={() => navigateTo('events')}
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#3A5982] hover:bg-[#2D476C] text-white text-xs font-bold tracking-wide transition-all shadow-sm active:scale-95"
              >
                <span>Explore Student Welfare Initiatives</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Editorial Statement with Serif / Italic Accent like Oxford Reference */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#8C9AA9] dark:text-[#94A3B8]">
                About Us
              </span>
              <p className="mt-2 text-xl sm:text-2xl lg:text-[26px] text-[#16212F] dark:text-[#F8FAFC] font-medium leading-snug">
                Our numbers reflect a tradition of excellence and forward-thinking{' '}
                <em className="font-serif italic text-[#3A5982] dark:text-[#93C5FD] font-semibold">
                  impact in student welfare, culture, and community.
                </em>
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2 text-xs text-[#536275] dark:text-[#94A3B8]">
              <div className="w-2 h-2 rounded-full bg-[#C5A063]" />
              <span>Bangalore Yeshwanthpur Campus • Institutional Accreditation NAAC A+</span>
            </div>
          </div>

        </div>

        {/* 4-Metric Grid with Hairline Dividers (Matching Oxford Reference layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E8F0] dark:divide-white/10">
          
          {/* Stat 1 */}
          <div className="sm:px-6 first:pl-0 space-y-2 pt-6 sm:pt-0">
            <span className="text-xs font-serif italic font-semibold text-[#9D7A3E] dark:text-[#E2C78A]">
              *Students Empowered*
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#16212F] dark:text-[#F8FAFC] tracking-tight">
              12,500+
            </div>
            <p className="text-xs text-[#536275] dark:text-[#94A3B8] leading-relaxed">
              Enrolled scholars across undergraduate, postgraduate & research faculties at Yeshwanthpur.
            </p>
          </div>

          {/* Stat 2 */}
          <div className="sm:px-6 space-y-2 pt-6 sm:pt-0">
            <span className="text-xs font-serif italic font-semibold text-[#9D7A3E] dark:text-[#E2C78A]">
              *Active Societies*
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#16212F] dark:text-[#F8FAFC] tracking-tight">
              45+
            </div>
            <p className="text-xs text-[#536275] dark:text-[#94A3B8] leading-relaxed">
              Student-run cultural societies, academic forums, dance crews, choirs & welfare associations.
            </p>
          </div>

          {/* Stat 3 */}
          <div className="sm:px-6 space-y-2 pt-6 sm:pt-0">
            <span className="text-xs font-serif italic font-semibold text-[#9D7A3E] dark:text-[#E2C78A]">
              *Flagship Events*
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#16212F] dark:text-[#F8FAFC] tracking-tight">
              120+
            </div>
            <p className="text-xs text-[#536275] dark:text-[#94A3B8] leading-relaxed">
              National youth conclaves, stage festivals, inter-departmental leagues & distinguished talks.
            </p>
          </div>

          {/* Stat 4 */}
          <div className="sm:px-6 space-y-2 pt-6 sm:pt-0">
            <span className="text-xs font-serif italic font-semibold text-[#9D7A3E] dark:text-[#E2C78A]">
              *Verified Certificates*
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#16212F] dark:text-[#F8FAFC] tracking-tight">
              8,500+
            </div>
            <p className="text-xs text-[#536275] dark:text-[#94A3B8] leading-relaxed">
              Cryptographically verified, dean-signed digital credentials awarded to student participants.
            </p>
          </div>

        </div>
      </section>


      {/* =========================================================================
          SECTION 3: CAMPUS FACILITIES & VENUES SHOWCASE (Oxford Reference Section 3)
          Prestige Panoramic Card with Giant Watermark Typography & Interactive Switcher
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C9AA9] dark:text-[#94A3B8]">
              Campus Venues & Facilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16212F] dark:text-white tracking-tight mt-1">
              Exceptional Venues Designed to Support Expression & Discovery
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#3A5982] dark:text-[#93C5FD] uppercase tracking-wider">
            Available on Campus
          </span>
        </div>

        {/* Large Panoramic Showcase Card */}
        <div className="relative overflow-hidden rounded-[28px] lg:rounded-[36px] bg-[#16212F] min-h-[460px] sm:min-h-[520px] flex flex-col justify-between text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-[#E2E8F0]">
          
          {/* Background Photograph */}
          <img
            src={currentVenue.image}
            alt={currentVenue.name}
            className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.55] transition-all duration-700"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#16212F] via-[#16212F]/40 to-transparent pointer-events-none" />

          {/* Giant Translucent Architectural Display Typographic Watermark */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 overflow-hidden pointer-events-none select-none flex justify-center opacity-15">
            <span className="font-serif tracking-widest text-white text-[13vw] font-bold uppercase whitespace-nowrap">
              {currentVenue.watermark}
            </span>
          </div>

          {/* Top Row: Venue Counter & Category */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                {currentVenue.number}
              </span>
              <span className="text-white/80 text-xs hidden sm:inline">
                Christ University Yeshwanthpur
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#C5A063] text-white text-xs font-bold shadow-xs">
                Capacity: {currentVenue.capacity}
              </span>
            </div>
          </div>

          {/* Bottom Area: Venue Title, Features & Interactive Nav Buttons */}
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#C5A063] tracking-widest uppercase">
                {currentVenue.features}
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {currentVenue.name}
              </h3>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light">
                {currentVenue.description}
              </p>
            </div>

            {/* Venue Switcher Selector Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {venues.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => setActiveVenueIdx(idx)}
                  className={`min-h-[40px] px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 flex items-center justify-center ${
                    activeVenueIdx === idx
                      ? 'bg-white text-[#16212F] shadow-sm'
                      : 'bg-black/40 text-white/80 hover:bg-black/60 border border-white/15'
                  }`}
                >
                  {v.name.split(' ')[0]} {v.name.split(' ')[1] || ''}
                </button>
              ))}
            </div>
          </div>

          {/* Minimalist Prev / Next Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-white/15 text-xs text-white/80 gap-3">
            <span>Bookings coordinated via Student Welfare Office Desk</span>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setActiveVenueIdx((prev) => (prev === 0 ? venues.length - 1 : prev - 1))}
                aria-label="Previous Venue"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center border border-white/20 transition-colors active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveVenueIdx((prev) => (prev === venues.length - 1 ? 0 : prev + 1))}
                aria-label="Next Venue"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center border border-white/20 transition-colors active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
          SECTION 4: THE STUDENT WELFARE OFFICE WINGS (Oxford Reference Section 4)
          Numbered Rows with thin horizontal divider lines and companion photograph
          ========================================================================= */}
      <section className="space-y-8">
        <div className="px-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8C9AA9] dark:text-[#94A3B8]">
            Our Wings & Pillars
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16212F] dark:text-white tracking-tight mt-1">
            A World-Class Range of Student Welfare Wings for Every Ambition
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Numbered List of Student Welfare Wings */}
          <div className="lg:col-span-7 bg-white dark:bg-[#141A26] rounded-[28px] border border-[#E2E8F0] dark:border-white/10 divide-y divide-[#E2E8F0] dark:divide-white/10 shadow-sm overflow-hidden transition-colors">
            {wings.map((wing) => (
              <div
                key={wing.number}
                className="p-5 sm:p-7 lg:p-8 hover:bg-[#F8FAFC] dark:hover:bg-white/[0.03] transition-colors duration-200 group cursor-pointer"
                onClick={() => navigateTo(wing.tab)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-serif italic font-bold text-[#9D7A3E] dark:text-[#E2C78A]">
                        {wing.number}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-[#16212F] dark:text-white group-hover:text-[#3A5982] dark:group-hover:text-[#93C5FD] transition-colors">
                        {wing.title}
                      </h3>
                    </div>
                    <p className="text-xs font-medium text-[#8C9AA9] dark:text-[#94A3B8]">
                      {wing.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-[#536275] dark:text-[#94A3B8] leading-relaxed pt-1">
                      {wing.description}
                    </p>
                    <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#3A5982] dark:text-[#93C5FD] group-hover:translate-x-1 transition-transform">
                      <span>{wing.linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-[#F1F5F9] dark:bg-white/10 group-hover:bg-[#3A5982] group-hover:text-white text-[#536275] dark:text-white flex items-center justify-center shrink-0 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Architectural / Cultural Photography Card matching Oxford Reference */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-[28px] overflow-hidden border border-[#E2E8F0] dark:border-white/10 shadow-sm bg-[#16212F] relative min-h-[420px] flex flex-col justify-end p-6 text-white">
              <img
                src="https://farm66.staticflickr.com/65535/53178501137_7dd2c25b3f_b.jpg"
                alt="Christ University Campus Life"
                className="absolute inset-0 w-full h-full object-cover brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#16212F] via-[#16212F]/40 to-transparent" />
              
              <div className="relative z-10 space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#C5A063] text-white text-[11px] font-bold tracking-wider uppercase inline-block">
                  CAMPUS CULTURE
                </span>
                <h4 className="text-xl font-bold text-white leading-snug">
                  "Excellence and Service" — Where Student Potential Flourishes
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed font-light">
                  From university choirs to national debating forums, the Yeshwanthpur campus is animated by hundreds of student-driven initiatives every semester.
                </p>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="p-5 sm:p-6 rounded-[24px] bg-white dark:bg-[#141A26] border border-[#E2E8F0] dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#16212F] dark:text-white">Registered for an event?</p>
                <p className="text-xs text-[#536275] dark:text-[#94A3B8]">View your active ticket passes and QR codes</p>
              </div>
              <button
                onClick={() => navigateTo('my-registrations')}
                className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-full bg-[#3A5982] hover:bg-[#2D476C] text-white text-xs font-semibold shrink-0 transition-colors flex items-center justify-center"
              >
                My Passes
              </button>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
          SECTION 5: "A LEGACY OF EXCELLENCE, A FUTURE OF POSSIBILITY" (Oxford Ref 5)
          Prestige Dark/Light Container with 4 Architectural Feature Cards
          ========================================================================= */}
      <section className="rounded-[28px] lg:rounded-[36px] bg-white dark:bg-[#16212F] text-[#16212F] dark:text-white p-5 sm:p-10 lg:p-14 space-y-8 sm:space-y-12 border border-[#E2E8F0] dark:border-white/20 shadow-xl transition-colors">
        
        {/* Header Block */}
        <div className="max-w-3xl space-y-3">
          <span className="px-3 py-1 rounded-full bg-[#C5A063]/15 text-[#9D7A3E] dark:text-[#E2C78A] text-[11px] font-bold tracking-widest uppercase border border-[#C5A063]/30">
            WHY SWO CHRIST
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#16212F] dark:text-white tracking-tight leading-tight">
            A Legacy of Excellence, a Future of Possibility
          </h2>
          <p className="text-sm sm:text-base text-[#536275] dark:text-slate-300 font-light leading-relaxed">
            From national fest victories to compassionate student welfare advocacy, Christ University Yeshwanthpur SWO provides a holistic ecosystem recognized across India.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          
          {/* Card 1 */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#F8FAFC] dark:bg-white/[0.04] border border-[#E2E8F0] dark:border-white/10 space-y-3 hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors">
            <span className="text-sm font-serif italic text-[#9D7A3E] dark:text-[#C5A063] font-bold">01</span>
            <h3 className="text-base font-bold text-[#16212F] dark:text-white tracking-tight">
              Top-Ranked Cultural Life
            </h3>
            <p className="text-xs text-[#536275] dark:text-slate-300 leading-relaxed font-light">
              Premier university festivals drawing thousands of participants across music, dance, theatre, and fine arts.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#F8FAFC] dark:bg-white/[0.04] border border-[#E2E8F0] dark:border-white/10 space-y-3 hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors">
            <span className="text-sm font-serif italic text-[#9D7A3E] dark:text-[#C5A063] font-bold">02</span>
            <h3 className="text-base font-bold text-[#16212F] dark:text-white tracking-tight">
              Faculty Mentorship
            </h3>
            <p className="text-xs text-[#536275] dark:text-slate-300 leading-relaxed font-light">
              Experienced SWO directors, coordinators, and counselors guiding committees with institutional acumen.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#F8FAFC] dark:bg-white/[0.04] border border-[#E2E8F0] dark:border-white/10 space-y-3 hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors">
            <span className="text-sm font-serif italic text-[#9D7A3E] dark:text-[#C5A063] font-bold">03</span>
            <h3 className="text-base font-bold text-[#16212F] dark:text-white tracking-tight">
              Student Leadership
            </h3>
            <p className="text-xs text-[#536275] dark:text-slate-300 leading-relaxed font-light">
              Democratically elected student councils, welfare delegates, and conveners driving high-impact campus policy.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#F8FAFC] dark:bg-white/[0.04] border border-[#E2E8F0] dark:border-white/10 space-y-3 hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors">
            <span className="text-sm font-serif italic text-[#9D7A3E] dark:text-[#C5A063] font-bold">04</span>
            <h3 className="text-base font-bold text-[#16212F] dark:text-white tracking-tight">
              Verified Digital Accreditations
            </h3>
            <p className="text-xs text-[#536275] dark:text-slate-300 leading-relaxed font-light">
              Tamper-proof verifiable e-certificates issued for every workshop, championship, and leadership tenure.
            </p>
          </div>

        </div>
      </section>


      {/* =========================================================================
          SECTION 6: "LECTURES, CONFERENCES, CULTURAL MOMENTS & MORE" (Oxford Ref 6)
          Staggered Editorial Event Cards with Live Registration Triggers
          ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 px-1">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C9AA9] dark:text-[#94A3B8]">
              Campus Calendar
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16212F] dark:text-white tracking-tight mt-1">
              Lectures, Conferences, Cultural Moments & More
            </h2>
          </div>
          
          <button
            onClick={() => navigateTo('events')}
            className="inline-flex items-center gap-1.5 min-h-[40px] text-xs font-bold text-[#3A5982] dark:text-[#93C5FD] hover:text-[#2D476C] dark:hover:text-blue-300 transition-colors"
          >
            <span>View Full University Schedule</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Event Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {publishedEvents.map((evt) => {
            const isUserRegistered = registrations.some(
              (r) => r.eventId === evt.id && r.studentId === studentUser?.id && r.status !== 'Cancelled'
            );
            const spotsRemaining = Math.max(0, evt.capacity - evt.registeredCount);

            return (
              <div
                key={evt.id}
                className="group rounded-[24px] bg-white dark:bg-[#141A26] border border-[#E2E8F0] dark:border-white/10 shadow-sm hover:shadow-md hover:border-[#CBD5E1] dark:hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={evt.bannerUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#3A5982] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                      {evt.category}
                    </span>
                    {isUserRegistered && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                        Registered
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-[#8C9AA9] dark:text-[#94A3B8] font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A063]" />
                      <span>
                        {new Date(evt.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        • {evt.time}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectEvent(evt)}
                      className="text-base font-bold text-[#16212F] dark:text-white group-hover:text-[#3A5982] dark:group-hover:text-[#93C5FD] transition-colors cursor-pointer line-clamp-2"
                    >
                      {evt.title}
                    </h3>

                    <p className="text-xs text-[#536275] dark:text-[#94A3B8] line-clamp-2 leading-relaxed">
                      {evt.subtitle || evt.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-[#E2E8F0] dark:border-white/10">
                    <div className="flex items-center justify-between text-xs text-[#536275] dark:text-[#94A3B8]">
                      <span className="flex items-center gap-1 truncate max-w-[140px]">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </span>
                      <span className="font-semibold text-[#16212F] dark:text-white">
                        {spotsRemaining} spots left
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleRegister(evt)}
                        className={`min-h-[44px] px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center justify-center ${
                          isUserRegistered
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                            : 'bg-[#3A5982] hover:bg-[#2D476C] text-white shadow-xs active:scale-95'
                        }`}
                      >
                        {isUserRegistered ? 'My Pass' : 'Register'}
                      </button>

                      <button
                        onClick={() => onSelectEvent(evt)}
                        className="min-h-[44px] px-3 py-2 rounded-full bg-[#F1F5F9] dark:bg-white/10 hover:bg-[#E2E8F0] dark:hover:bg-white/20 text-[#16212F] dark:text-white text-xs font-semibold transition-colors flex items-center justify-center"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 6.5: INTERACTIVE CAMPUS CALENDAR & LIVE SCHEDULE PREVIEW (NEW)
          ========================================================================= */}
      <section className="rounded-[32px] bg-white dark:bg-[#16212F] text-[#16212F] dark:text-white p-5 sm:p-8 lg:p-10 border border-[#E2E8F0] dark:border-white/10 shadow-xl relative overflow-hidden space-y-6 transition-colors">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A063]/25 border border-[#C5A063]/40 text-[#9D7A3E] dark:text-[#E6C98F] text-[11px] font-bold uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                CAMPUS CALENDAR MATRIX
              </span>
              <span className="text-xs text-[#536275] dark:text-slate-300 font-medium">Bangalore Yeshwanthpur Campus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#16212F] dark:text-white tracking-tight">
              Interactive Campus Calendar & Schedule
            </h2>
            <p className="text-xs sm:text-sm text-[#536275] dark:text-slate-300">
              Browse intra-collegiate cultural fests, diplomatic conclaves, hackathons, and well-being forums. Sync events directly with your personal Google or Apple Calendar.
            </p>
          </div>

          <button
            onClick={() => navigateTo('calendar')}
            className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-full bg-[#C5A063] hover:bg-[#b08d53] text-[#16212F] text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 shrink-0 self-start md:self-auto group"
          >
            <span>Launch Full Calendar Matrix</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Featured Upcoming Schedule Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4 pt-2">
          {events.slice(0, 3).map((evt) => {
            const isUserRegistered = registrations.some(
              (r) => r.eventId === evt.id && r.studentId === studentUser?.id && r.status !== 'Cancelled'
            );

            return (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#1B283A] border border-[#E2E8F0] dark:border-white/15 hover:border-[#C5A063] transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#C5A063] text-black">
                      {evt.category}
                    </span>
                    <span className="text-[11px] font-bold text-[#9D7A3E] dark:text-[#E6C98F]">
                      {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-[#16212F] dark:text-white group-hover:text-[#3A5982] dark:group-hover:text-[#E6C98F] transition-colors line-clamp-2">
                    {evt.title}
                  </h3>

                  <div className="space-y-1 text-xs text-[#536275] dark:text-slate-300">
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C5A063]" />
                      <span className="truncate">{evt.time}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span className="truncate">{evt.venue}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] dark:border-white/10 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRegister(evt);
                    }}
                    className={`min-h-[40px] px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                      isUserRegistered
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40'
                        : 'bg-[#3A5982] hover:bg-[#2D476C] text-white'
                    }`}
                  >
                    {isUserRegistered ? 'Registered' : 'Quick Register'}
                  </button>

                  <span className="text-[11px] text-[#8C9AA9] dark:text-slate-400 group-hover:text-[#16212F] dark:group-hover:text-white flex items-center gap-1 min-h-[40px]">
                    Details <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: "DISCOVER THE LATEST NOTICES & CIRCULARS FROM SWO" (Oxford Ref 7)
          3-Column Editorial News / Notices Cards
          ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 px-1">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C9AA9] dark:text-[#94A3B8]">
              Student Welfare Office Desk
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16212F] dark:text-white tracking-tight mt-1">
              Discover the Latest Notices & Circulars from SWO
            </h2>
          </div>
          
          <button
            onClick={() => navigateTo('announcements')}
            className="inline-flex items-center gap-1.5 min-h-[40px] text-xs font-bold text-[#3A5982] dark:text-[#93C5FD] hover:text-[#2D476C] dark:hover:text-blue-300 transition-colors"
          >
            <span>All Circulars Archive</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {latestAnnouncements.map((ann) => (
            <div
              key={ann.id}
              onClick={() => navigateTo('announcements')}
              className="group cursor-pointer rounded-[24px] bg-white dark:bg-[#141A26] border border-[#E2E8F0] dark:border-white/10 shadow-sm hover:shadow-md hover:border-[#CBD5E1] dark:hover:border-white/20 transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C5A063]/15 text-[#9D7A3E] dark:text-[#E2C78A] font-bold text-[10px] tracking-wider uppercase border border-[#C5A063]/25">
                    {ann.category || 'Official Circular'}
                  </span>
                  <span className="text-[#8C9AA9] dark:text-[#94A3B8] text-[11px]">
                    {new Date(ann.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#16212F] dark:text-white group-hover:text-[#3A5982] dark:group-hover:text-[#93C5FD] transition-colors leading-snug">
                  {ann.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#536275] dark:text-[#94A3B8] leading-relaxed line-clamp-3">
                  {ann.content}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E2E8F0] dark:border-white/10 flex items-center justify-between text-xs">
                <span className="text-[#8C9AA9] dark:text-[#94A3B8]">By {ann.authorRole}</span>
                <span className="font-bold text-[#3A5982] dark:text-[#93C5FD] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 min-h-[40px]">
                  <span>Read Circular</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* =========================================================================
          SECTION 8: "HAVE QUESTIONS? WE'D LOVE TO HEAR FROM YOU." (Oxford Ref 8)
          Two-Column Contact & Helpdesk Inquiry Layout
          ========================================================================= */}
      <section className="bg-white dark:bg-[#141A26] rounded-[28px] lg:rounded-[36px] border border-[#E2E8F0] dark:border-white/10 p-5 sm:p-10 lg:p-14 shadow-sm transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Left Column: Office Details & Helplines */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#8C9AA9] dark:text-[#94A3B8]">
                Student Welfare Helpdesk
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16212F] dark:text-white tracking-tight mt-1 leading-tight">
                Have Questions? We'd Love to Hear From You.
              </h2>
              <p className="text-sm text-[#536275] dark:text-[#94A3B8] leading-relaxed mt-3">
                Whether you have questions regarding festival registrations, auditorium bookings, council delegations, or student counseling, our office is here for you.
              </p>
            </div>

            <div className="space-y-4 text-xs text-[#536275] dark:text-[#94A3B8] pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-white/[0.04] border border-[#E2E8F0] dark:border-white/10">
                <MapPin className="w-5 h-5 text-[#3A5982] dark:text-[#93C5FD] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#16212F] dark:text-white text-[13px]">Student Welfare Office Location</strong>
                  Room 104, Ground Floor, Central Academic Block, Christ University Yeshwanthpur, Bengaluru 560073
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-white/[0.04] border border-[#E2E8F0] dark:border-white/10">
                <Clock className="w-5 h-5 text-[#C5A063] shrink-0" />
                <div>
                  <strong className="block text-[#16212F] dark:text-white text-[13px]">Office Hours</strong>
                  Monday – Saturday: 08:30 AM – 05:00 PM
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-white/[0.04] border border-[#E2E8F0] dark:border-white/10">
                <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <strong className="block text-[#16212F] dark:text-white text-[13px]">Direct Line</strong>
                  +91 80 4012 9100 (Ext: 204 / SWO)
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-white/[0.04] border border-[#E2E8F0] dark:border-white/10">
                <Mail className="w-5 h-5 text-[#3A5982] dark:text-[#93C5FD] shrink-0" />
                <div>
                  <strong className="block text-[#16212F] dark:text-white text-[13px]">Official Email</strong>
                  swo.yeshwanthpur@christuniversity.in
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-End Contact Form matching Oxford Reference */}
          <div className="lg:col-span-7 bg-[#F8FAFC] dark:bg-[#1A2332] rounded-[24px] border border-[#E2E8F0] dark:border-white/10 p-6 sm:p-8 transition-colors">
            <h3 className="text-lg font-bold text-[#16212F] dark:text-white tracking-tight mb-4">
              Send an Official Student Inquiry
            </h3>

            {formSubmitted ? (
              <div className="p-8 text-center space-y-3 bg-white dark:bg-[#141A26] rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-[#16212F] dark:text-white">Inquiry Sent Successfully</h4>
                <p className="text-xs text-[#536275] dark:text-[#94A3B8]">
                  Your request has been logged with the Student Welfare Office desk. An SWO coordinator will reach out via campus email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#16212F] dark:text-white font-semibold mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.firstName}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, firstName: e.target.value })}
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white dark:bg-[#141A26] border border-[#CBD5E1] dark:border-white/15 text-[#16212F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3A5982]"
                      placeholder="e.g. Aaron"
                    />
                  </div>
                  <div>
                    <label className="block text-[#16212F] dark:text-white font-semibold mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.lastName}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, lastName: e.target.value })}
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white dark:bg-[#141A26] border border-[#CBD5E1] dark:border-white/15 text-[#16212F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3A5982]"
                      placeholder="e.g. D'Souza"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#16212F] dark:text-white font-semibold mb-1">Student University Email</label>
                    <input
                      type="email"
                      required
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white dark:bg-[#141A26] border border-[#CBD5E1] dark:border-white/15 text-[#16212F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3A5982]"
                      placeholder="name.ypr@christuniversity.in"
                    />
                  </div>
                  <div>
                    <label className="block text-[#16212F] dark:text-white font-semibold mb-1">Registration / Roll No.</label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.regNo}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, regNo: e.target.value })}
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white dark:bg-[#141A26] border border-[#CBD5E1] dark:border-white/15 text-[#16212F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3A5982]"
                      placeholder="e.g. 2320145"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#16212F] dark:text-white font-semibold mb-1">Inquiry Category</label>
                  <select
                    value={inquiryForm.category}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, category: e.target.value })}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white dark:bg-[#141A26] border border-[#CBD5E1] dark:border-white/15 text-[#16212F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3A5982]"
                  >
                    <option value="Event Registration">Event Registration & QR Entry Pass</option>
                    <option value="Auditorium Booking">Campus Venue & Stage Rehearsal Booking</option>
                    <option value="Council & Elections">Student Council & Departmental Representation</option>
                    <option value="Wellness & Counseling">Confidential Student Counseling & Support</option>
                    <option value="Certificates">Certificate Verification & Attendance Exemption</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#16212F] dark:text-white font-semibold mb-1">Your Message or Request</label>
                  <textarea
                    rows={4}
                    required
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    className="w-full p-4 rounded-xl bg-white dark:bg-[#141A26] border border-[#CBD5E1] dark:border-white/15 text-[#16212F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3A5982] resize-none"
                    placeholder="Describe your inquiry or requirement..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[48px] py-3.5 rounded-full bg-[#3A5982] hover:bg-[#2D476C] text-white font-bold text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>Send Inquiry to Student Welfare Office</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  );
};

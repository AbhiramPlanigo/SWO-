import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  ArrowDown, 
  CheckCircle2, 
  Share2, 
  Mic2, 
  Radio, 
  Edit3, 
  Layers, 
  Award,
  Clock,
  Send,
  ExternalLink,
  Flame,
  Volume2,
  Bell
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EventItem } from '../../types';

interface GenCiHeroSectionProps {
  onExploreReel: () => void;
  onNavigateToEvents: () => void;
  onSelectEvent?: (event: EventItem) => void;
  onQuickRegister?: (event: EventItem) => void;
}

interface BannerTemplate {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  speakers: { name: string; role: string; org: string; avatar: string }[];
  tags: string[];
  gradient: string;
  accentColor: string;
  bgImage: string;
  isFlagship: boolean;
}

const DEFAULT_TEMPLATES: BannerTemplate[] = [
  {
    id: 'talk-series',
    badge: 'STUDENT WELFARE TALK SERIES • FLAGSHIP INAUGURAL',
    title: 'TALK SERIES COMING SOON',
    subtitle: 'Distinguished Voices & Vanguard Leadership at Yeshwanthpur',
    description: 'An intellectually charged semester dialogue uniting pioneering technologists, public policy changemakers, and visionary leaders with the vibrant student community of Christ University.',
    date: 'Friday, September 18, 2026',
    time: '03:30 PM – 06:00 PM IST',
    venue: 'Main University Auditorium • Tier 1 & 2',
    speakers: [
      {
        name: 'Dr. Aarav Nambiar',
        role: 'Chief AI Architect & Fellow',
        org: 'DeepMind Research Lab',
        avatar: 'https://farm66.staticflickr.com/65535/53600439267_de66a73a92_b.jpg'
      },
      {
        name: 'Prof. Maya Sengupta',
        role: 'Director of Cyber Ethics',
        org: 'Global Policy Council',
        avatar: 'https://farm66.staticflickr.com/65535/54775630968_3b1b6f2374_b.jpg'
      }
    ],
    tags: ['Christ University Exclusive', 'Official SWO Accredited', 'OD Granted', 'Live Broadcast'],
    gradient: 'from-[#0A192F] via-[#1E3A5F] to-[#0A1118]',
    accentColor: '#C5A063',
    bgImage: 'https://farm66.staticflickr.com/65535/53601520593_35b116390a_b.jpg',
    isFlagship: true
  },
  {
    id: 'quantum-tech',
    badge: 'GEN-AI & QUANTUM CONCLAVE 2026',
    title: 'THE NEXT COGNITIVE EPOCH',
    subtitle: 'Autonomous Systems, Neural Architecture & Student Moonshots',
    description: 'A 2-day national symposium featuring live prototype demonstrations, enterprise sandbox workshops, and student research paper showcases.',
    date: 'October 04–05, 2026',
    time: '09:00 AM – 05:30 PM',
    venue: 'Executive Seminar Conclave • Block B',
    speakers: [
      {
        name: 'Kavita Sundaram',
        role: 'VP Emerging Tech',
        org: 'QuantumCore Labs',
        avatar: 'https://farm66.staticflickr.com/65535/54209785099_45d2370a1e_b.jpg'
      }
    ],
    tags: ['Tech Horizon', 'Hands-on Labs', 'Certificate Included'],
    gradient: 'from-[#111827] via-[#312E81] to-[#030712]',
    accentColor: '#60A5FA',
    bgImage: 'https://farm66.staticflickr.com/65535/54209949900_8938a64d67_b.jpg',
    isFlagship: false
  },
  {
    id: 'darpan-fest',
    badge: 'INTER-COLLEGIATE CULTURAL ODYSSEY',
    title: 'DARPAN 2026: UNBOUNDED',
    subtitle: 'Celebrating Music, Dance, Theatre & Creative Expression',
    description: 'Over 40 competitive collegiate categories, celebrity jury panels, and massive evening acoustic concerts celebrating the spirit of youth.',
    date: 'October 24–27, 2026',
    time: '10:00 AM – 09:00 PM',
    venue: 'Open-Air Amphitheatre & Quadrangle',
    speakers: [
      {
        name: 'University Choir Ensemble',
        role: 'Keynote Symphony',
        org: 'Christ Music Conservatory',
        avatar: 'https://farm66.staticflickr.com/65535/54979528973_772fec7f07_b.jpg'
      }
    ],
    tags: ['University Mega Fest', '40+ Trophies', 'Evening Concerts'],
    gradient: 'from-[#1A102F] via-[#4C1D95] to-[#0F081D]',
    accentColor: '#F59E0B',
    bgImage: 'https://farm66.staticflickr.com/65535/53890794279_c2e8e2a4bc_b.jpg',
    isFlagship: false
  }
];

export const GenCiHeroSection: React.FC<GenCiHeroSectionProps> = ({
  onExploreReel,
  onNavigateToEvents,
}) => {
  const { studentUser, openLoginModal, showToast, theme, heroSettings, updateHeroSettings } = useApp();

  // Selected Template
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('talk-series');
  
  // Customizable text state
  const [isEditing, setIsEditing] = useState(false);
  const [customTitle, setCustomTitle] = useState(heroSettings?.title || 'TALK SERIES COMING SOON');
  const [customSubtitle, setCustomSubtitle] = useState(heroSettings?.subtitle || 'Distinguished Voices & Vanguard Leadership at Yeshwanthpur');
  const [customBadge, setCustomBadge] = useState(heroSettings?.badge || 'STUDENT WELFARE TALK SERIES • FLAGSHIP INAUGURAL');
  const [isReserved, setIsReserved] = useState(false);

  const activeTemplate = DEFAULT_TEMPLATES.find((t) => t.id === selectedTemplateId) || DEFAULT_TEMPLATES[0];

  // Derive active settings: heroSettings take priority, then template fallback
  const displayTitle = heroSettings?.title || customTitle || activeTemplate.title;
  const displaySubtitle = heroSettings?.subtitle || customSubtitle || activeTemplate.subtitle;
  const displayBadge = heroSettings?.badge || customBadge || activeTemplate.badge;
  const displayDescription = heroSettings?.description || activeTemplate.description;
  const displayDate = heroSettings?.date || activeTemplate.date;
  const displayTime = heroSettings?.time || activeTemplate.time;
  const displayVenue = heroSettings?.venue || activeTemplate.venue;
  const displaySpeakers = (heroSettings?.speakers && heroSettings.speakers.length > 0)
    ? heroSettings.speakers
    : activeTemplate.speakers;
  const displayBgImage = heroSettings?.bgImage || activeTemplate.bgImage;

  const handleSelectTemplate = (t: BannerTemplate) => {
    setSelectedTemplateId(t.id);
    setCustomTitle(t.title);
    setCustomSubtitle(t.subtitle);
    setCustomBadge(t.badge);
    setIsEditing(false);
  };

  const handleReserve = () => {
    if (!studentUser) {
      openLoginModal(
        `Please sign in with your official @christuniversity.in account to get notified about "${customTitle}".`,
        () => {
          setIsReserved(true);
          showToast('Notification Enabled', `You will receive updates about "${customTitle}".`, 'success');
        }
      );
      return;
    }
    setIsReserved(true);
    showToast('Notification Enabled', `Updates will be sent to ${studentUser.email}.`, 'success');
  };

  return (
    <div className="relative w-full rounded-[32px] sm:rounded-[40px] overflow-hidden border border-[#E2E8F0] dark:border-white/10 shadow-2xl transition-all duration-300">
      
      {/* Background Anime / High-Gloss Canvas with Ambient Visual Depth */}
      <div className="absolute inset-0 z-0">
        <img
          src={displayBgImage}
          alt={displayTitle}
          className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.38] dark:brightness-[0.25] saturate-[1.25] transition-all duration-1000 ease-out"
        />
        
        {/* Dynamic Dark Gradient Overlays for GenCI UI contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/80 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17] via-[#0B0F17]/70 to-transparent" />
        
        {/* Ambient Glowing Neon Spots */}
        <div 
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[120px] opacity-35 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: activeTemplate.accentColor }}
        />
        <div 
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[140px] opacity-30 pointer-events-none bg-[#3A5982]"
        />

        {/* Subtle Sci-Fi / Anime Geometric Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* Main Content Stage: Fully Filled & Responsive Full Page Utilization */}
      <div className="relative z-10 flex flex-col justify-between p-6 sm:p-10 lg:p-14 min-h-[580px] lg:min-h-[640px] text-white space-y-8">
        
        {/* =========================================================================
            HEADER BAR: CHRIST LOGO & OFFICIAL DIRECTORATE CREST + TEMPLATE SWITCHER
            ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          
          {/* Christ University Official Crest & Brand Typography */}
          <div className="flex items-center gap-3.5">
            {/* Official University Crest Insignia */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white p-1 flex items-center justify-center shrink-0 shadow-lg ring-2 ring-[#C5A063]/50 group hover:scale-105 transition-transform">
              <img
                src="/christ-university-crest.png"
                alt="CHRIST (Deemed to be University) Official Crest"
                className="w-full h-full object-contain select-none"
              />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-extrabold tracking-widest text-[#C5A063] uppercase">
                  CHRIST (Deemed to be University)
                </span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="hidden sm:inline-block text-[11px] font-medium tracking-wide text-white/70">
                  Bangalore Yeshwanthpur
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-white/90 font-medium tracking-tight">
                Student Welfare Office • Official Flagship Conclave Platform
              </p>
            </div>
          </div>

          {/* Quick Template Picker & Interactive Customizer Toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center p-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/15">
              {DEFAULT_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedTemplateId === tmpl.id
                      ? 'bg-white text-[#0B0F17] shadow-md scale-100'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tmpl.id === 'talk-series' ? '🎙️ Talk Series' : tmpl.id === 'quantum-tech' ? '⚡ AI Conclave' : '🎭 Darpan Fest'}
                </button>
              ))}
            </div>

            {/* Live Text Customizer Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md transition-all ${
                isEditing
                  ? 'bg-[#C5A063] text-black border-[#C5A063] shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
              }`}
              title="Customizer for banner headline"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Close Editor' : 'Edit Text'}</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            INTERACTIVE LIVE TEXT CUSTOMIZER PANEL (When User Toggles "Edit Text")
            ========================================================================= */}
        {isEditing && (
          <div className="p-4 sm:p-5 rounded-2xl bg-black/70 backdrop-blur-2xl border border-[#C5A063]/40 space-y-3 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#C5A063] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Live Banner Text Customizer (GenCI UI Preview)
              </span>
              <span className="text-[10px] text-white/60">Type below to see changes in real-time</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-white/80 block mb-1">
                  Primary Title / Announcement
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Talk series coming soon"
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-[#C5A063]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-white/80 block mb-1">
                  Subtitle / Sub-heading
                </label>
                <input
                  type="text"
                  value={customSubtitle}
                  onChange={(e) => setCustomSubtitle(e.target.value)}
                  placeholder="e.g. Distinguished Voices at Yeshwanthpur"
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-medium focus:outline-none focus:border-[#C5A063]"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            CENTER SHOWCASE: BIG & FULLY FILLED TYPOGRAPHY & INTELLECTUAL VIBE
            ========================================================================= */}
        <div className="max-w-4xl space-y-6">
          
          {/* Eyebrow Status Badge with Anime Glow */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 text-xs font-bold tracking-wider text-white shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C5A063] animate-pulse shadow-[0_0_12px_#C5A063]" />
              <span className="text-[#C5A063] font-mono tracking-widest">{displayBadge}</span>
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-medium text-white/90 border border-white/10">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Broadcast Ready • Main Auditorium</span>
            </div>
          </div>

          {/* Main Giant Headline */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] text-white drop-shadow-xl uppercase">
              {displayTitle}
            </h1>
            <p className="text-base sm:text-xl lg:text-2xl font-light text-white/90 leading-relaxed font-serif italic max-w-3xl">
              "{displaySubtitle}"
            </p>
          </div>

          {/* Contextual Narrative */}
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl font-normal">
            {displayDescription}
          </p>

          {/* Logistics Matrix Chips (Time, Date, Location) */}
          <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap pt-1">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-white">
              <Calendar className="w-4 h-4 text-[#C5A063] shrink-0" />
              <span>{displayDate}</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-white">
              <Clock className="w-4 h-4 text-[#60A5FA] shrink-0" />
              <span>{displayTime}</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-white">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{displayVenue}</span>
            </div>
          </div>

          {/* Keynote Guest Panel Preview */}
          <div className="pt-2 flex items-center gap-4 flex-wrap">
            <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider">
              Featured Guests ({displaySpeakers.length}):
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              {displaySpeakers.map((spk, idx) => (
                <div 
                  key={spk.id || idx} 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 hover:border-[#C5A063]/50 transition-colors"
                >
                  <img
                    src={spk.avatar}
                    alt={spk.name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-white/30"
                  />
                  <div className="text-left leading-none">
                    <span className="text-xs font-bold text-white block">{spk.name}</span>
                    <span className="text-[9px] text-white/70">{spk.org || spk.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM ACTION BAR & SCROLL DOWN TRIGGER
            ========================================================================= */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Primary Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleReserve}
              className={`inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all shadow-xl active:scale-95 ${
                isReserved
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-gradient-to-r from-[#C5A063] via-[#E2C78A] to-[#C5A063] text-black hover:brightness-110 shadow-[0_4px_24px_rgba(197,160,99,0.4)]'
              }`}
            >
              {isReserved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Notifications Enabled</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 text-black" />
                  <span>Notify Me</span>
                </>
              )}
            </button>

            <button
              onClick={onNavigateToEvents}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 transition-all active:scale-95 backdrop-blur-md"
            >
              <span>Full Event Dossier</span>
              <ArrowRight className="w-4 h-4 text-white/80" />
            </button>
          </div>

          {/* Prompt to explore Scrolling Reel Towards Down */}
          <button
            onClick={onExploreReel}
            className="flex items-center gap-2 text-xs font-bold text-white/80 hover:text-white group transition-colors self-start sm:self-auto py-2"
          >
            <span>Live Campus Highlights & Scrolling Reel Below</span>
            <div className="p-1.5 rounded-full bg-white/10 group-hover:bg-white/20 group-hover:translate-y-1 transition-all">
              <ArrowDown className="w-3.5 h-3.5 text-[#C5A063]" />
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};

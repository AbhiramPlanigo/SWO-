import React from 'react';
import { SWOLogo } from '../common/SWOLogo';
import { StudentNavTab } from '../navigation/StudentNavbar';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Building2,
  ArrowUpRight
} from 'lucide-react';

interface StudentFooterProps {
  onSelectTab: (tab: StudentNavTab) => void;
  onNavigateToAdmin?: () => void;
}

export const StudentFooter: React.FC<StudentFooterProps> = ({ onSelectTab, onNavigateToAdmin }) => {
  return (
    <footer className="relative w-full bg-white text-[#16212F] border-t border-[#E2E8F0] pt-16 pb-12 mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Top Header Row with Logo & Quick Contact */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-[#E2E8F0]">
          <SWOLogo size="lg" showText={true} />
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-[#536275]">Need immediate support or have an inquiry?</span>
            <a
              href="mailto:swo.yeshwanthpur@christuniversity.in"
              className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-full bg-[#3A5982] text-white text-xs font-semibold hover:bg-[#2D476C] transition-colors shadow-xs"
            >
              <span>Contact Student Welfare Office</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 4-Column Editorial Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          
          {/* Col 1: Mission & Heritage */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#16212F] uppercase tracking-wider">
              Student Welfare Office
            </h4>
            <p className="text-[#536275] leading-relaxed text-[13px]">
              The Student Welfare Office champions student expression, leadership development, holistic well-being, and premier cultural traditions at Christ University, Bangalore Yeshwanthpur Campus.
            </p>
            <div className="inline-flex items-center gap-2 pt-2 px-3 py-1.5 rounded-full bg-[#C5A063]/15 text-[#9D7A3E] font-semibold text-[11px] border border-[#C5A063]/25">
              <ShieldCheck className="w-4 h-4 text-[#C5A063]" /> NAAC A+ Accredited Institution
            </div>
          </div>

          {/* Col 2: Services & Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#16212F] uppercase tracking-wider">
              Direct Portals & Services
            </h4>
            <ul className="space-y-1 text-[#536275]">
              <li>
                <button
                  onClick={() => onSelectTab('calendar')}
                  className="min-h-[36px] py-1.5 hover:text-[#3A5982] hover:underline transition-colors text-left flex items-center gap-1 font-semibold text-[#3A5982]"
                >
                  <span>Interactive Campus Calendar</span>
                  <span className="px-1.5 py-0.2 bg-[#C5A063]/20 text-[#9D7A3E] text-[9px] font-bold rounded-full">New</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('events')}
                  className="min-h-[36px] py-1.5 hover:text-[#3A5982] hover:underline transition-colors text-left flex items-center"
                >
                  Campus Events, Fests & Conclaves
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('my-registrations')}
                  className="min-h-[36px] py-1.5 hover:text-[#3A5982] hover:underline transition-colors text-left flex items-center"
                >
                  My Registrations & Entry QR Passes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('announcements')}
                  className="min-h-[36px] py-1.5 hover:text-[#3A5982] hover:underline transition-colors text-left flex items-center"
                >
                  Official Circulars & Guidelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('results')}
                  className="min-h-[36px] py-1.5 hover:text-[#3A5982] hover:underline transition-colors text-left flex items-center"
                >
                  Tournament Results & Hall of Fame
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('certificates')}
                  className="min-h-[36px] py-1.5 hover:text-[#3A5982] hover:underline transition-colors text-left flex items-center"
                >
                  Digital Verified Certificates
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Campus Location & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#16212F] uppercase tracking-wider">
              Student Welfare Office Desk
            </h4>
            <div className="space-y-2.5 text-[#536275]">
              <p className="flex items-start gap-2 text-[13px]">
                <MapPin className="w-4 h-4 text-[#3A5982] shrink-0 mt-0.5" />
                <span>
                  CHRIST (Deemed to be University), Yeshwanthpur Campus, Nagasandra Post, Near Tumkur Road, Bengaluru, Karnataka 560073
                </span>
              </p>
              <p className="flex items-center gap-2 text-[13px]">
                <Clock className="w-4 h-4 text-[#C5A063] shrink-0" />
                <span>Monday – Saturday: 08:30 AM – 05:00 PM</span>
              </p>
              <p className="flex items-center gap-2 text-[13px]">
                <Building2 className="w-4 h-4 text-[#3A5982] shrink-0" />
                <span>Room 104, Ground Floor, Central Block</span>
              </p>
            </div>
          </div>

          {/* Col 4: Helpdesk & Emergency Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#16212F] uppercase tracking-wider">
              Helplines & Wellbeing
            </h4>
            <div className="space-y-2.5 text-[#536275]">
              <p className="flex items-center gap-2 text-[13px]">
                <Mail className="w-4 h-4 text-[#3A5982] shrink-0" />
                <span className="font-mono text-[12px] text-[#16212F]">swo.yeshwanthpur@christuniversity.in</span>
              </p>
              <p className="flex items-center gap-2 text-[13px]">
                <Phone className="w-4 h-4 text-[#C5A063] shrink-0" />
                <span>+91 80 4012 9100 (Ext. 204)</span>
              </p>
              <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-[12px] text-[#536275] leading-relaxed">
                <span className="text-[#3A5982] font-bold block mb-0.5">Confidential Student Counseling:</span>
                Campus Student Counselor: <strong className="text-[#16212F]">counselor.ypr@christuniversity.in</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Legal & Copyright */}
        <div className="pt-8 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C9AA9]">
          <p>© {new Date().getFullYear()} Student Welfare Office • Christ University, Yeshwanthpur Campus. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-[#16212F] transition-colors cursor-pointer">Code of Conduct</span>
            <span className="hover:text-[#16212F] transition-colors cursor-pointer">Student Welfare Charter</span>
            {onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="hover:text-[#3A5982] transition-colors inline-flex items-center gap-1.5 font-semibold text-[#536275] border-l border-[#E2E8F0] pl-4"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A063]" />
                <span>Staff & Admin Gateway (Restricted)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Giant Oxford-style Watermark Typography Across the Base of the Footer */}
      <div className="w-full overflow-hidden pointer-events-none select-none flex justify-center opacity-[0.04] mt-6">
        <span className="font-serif tracking-[0.2em] text-[#16212F] text-[18vw] font-black uppercase leading-none whitespace-nowrap">
          CHRIST
        </span>
      </div>
    </footer>
  );
};

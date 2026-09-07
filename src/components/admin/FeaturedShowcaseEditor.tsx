import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HeroBannerSettings, HeroGuest } from '../../types';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  RotateCcw, 
  Eye, 
  Image as ImageIcon,
  Tag,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const PRESET_BACKGROUNDS = [
  {
    name: 'Darpan & Cultural Inauguration',
    url: 'https://farm66.staticflickr.com/65535/53890794279_c2e8e2a4bc_b.jpg',
    color: '#00D2FF',
  },
  {
    name: 'Main Auditorium & Conclave Stage',
    url: 'https://farm66.staticflickr.com/65535/53601520593_35b116390a_b.jpg',
    color: '#FFD60A',
  },
  {
    name: 'Central Campus Quadrangle Procession',
    url: 'https://farm66.staticflickr.com/65535/53589012105_a341a3ffee_b.jpg',
    color: '#FF2D55',
  },
  {
    name: 'AI Guild & Technology Hub',
    url: 'https://farm66.staticflickr.com/65535/54209949900_8938a64d67_b.jpg',
    color: '#34C759',
  },
];

const PRESET_AVATARS = [
  'https://farm66.staticflickr.com/65535/53188337164_f346df7a8f_b.jpg',
  'https://farm66.staticflickr.com/65535/53600439267_de66a73a92_b.jpg',
  'https://farm66.staticflickr.com/65535/54775630968_3b1b6f2374_b.jpg',
  'https://farm66.staticflickr.com/65535/53882241965_c4806b8f4c_b.jpg',
  'https://farm66.staticflickr.com/65535/53188337114_6037bba686_b.jpg',
];

export const FeaturedShowcaseEditor: React.FC = () => {
  const { heroSettings, updateHeroSettings, resetHeroSettings } = useApp();

  // Local draft state
  const [formData, setFormData] = useState<HeroBannerSettings>(() => ({
    ...heroSettings,
    speakers: [...heroSettings.speakers],
  }));

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'guests' | 'media'>('details');

  // New guest state
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestRole, setNewGuestRole] = useState('');
  const [newGuestOrg, setNewGuestOrg] = useState('');
  const [newGuestAvatar, setNewGuestAvatar] = useState(PRESET_AVATARS[0]);
  const [isAddingGuest, setIsAddingGuest] = useState(false);

  // Sync if context updates externally
  React.useEffect(() => {
    setFormData({
      ...heroSettings,
      speakers: [...heroSettings.speakers],
    });
  }, [heroSettings]);

  const handleFieldChange = (field: keyof HeroBannerSettings, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    updateHeroSettings(formData);
  };

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    const newGuest: HeroGuest = {
      id: 'guest_' + Date.now(),
      name: newGuestName.trim(),
      role: newGuestRole.trim() || 'Distinguished Guest',
      org: newGuestOrg.trim() || 'Christ University Student Welfare Office',
      avatar: newGuestAvatar || PRESET_AVATARS[0],
    };

    setFormData((prev) => ({
      ...prev,
      speakers: [...prev.speakers, newGuest],
    }));

    setNewGuestName('');
    setNewGuestRole('');
    setNewGuestOrg('');
    setIsAddingGuest(false);
  };

  const handleRemoveGuest = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      speakers: prev.speakers.filter((g) => g.id !== id),
    }));
  };

  const handleUpdateGuest = (id: string, updatedFields: Partial<HeroGuest>) => {
    setFormData((prev) => ({
      ...prev,
      speakers: prev.speakers.map((g) => (g.id === id ? { ...g, ...updatedFields } : g)),
    }));
  };

  return (
    <div className="rounded-2xl lg:rounded-3xl bg-white dark:bg-[#141A26] border border-[#CBD5E1]/60 dark:border-white/10 shadow-sm overflow-hidden transition-colors">
      {/* Top Banner Header */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-[#16212F] via-[#24354D] to-[#3A5982] text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C5A063] text-black text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Homepage Hero Showcase
            </span>
            <span className="text-xs text-slate-300">
              Live Configuration & Featured Guests Coming
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
            Flagship Talk Series & Guests Office
          </h3>
          <p className="text-xs text-slate-200/90 max-w-2xl">
            Modify the flagship banner headline, event date, venue, and manage the guest keynote panel displayed prominently on the student portal.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Collapse Editor</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Modify Showcase & Guests</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#C5A063] hover:bg-[#B38E52] text-black transition-all shadow-sm active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Publish Live</span>
          </button>
        </div>
      </div>

      {/* Overview Snapshot Bar */}
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#CBD5E1]/40 dark:border-white/10">
            <span className="text-[10px] font-bold text-[#8C9AA9] uppercase tracking-wider block mb-1">
              Active Headline
            </span>
            <p className="text-xs font-bold text-[#16212F] dark:text-white truncate">
              {formData.title}
            </p>
            <span className="text-[11px] text-[#536275] dark:text-slate-400 truncate block mt-0.5">
              {formData.subtitle}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#CBD5E1]/40 dark:border-white/10">
            <span className="text-[10px] font-bold text-[#8C9AA9] uppercase tracking-wider block mb-1">
              Scheduled Date & Time
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#16212F] dark:text-white">
              <Calendar className="w-3.5 h-3.5 text-[#3A5982] dark:text-[#93C5FD]" />
              <span className="truncate">{formData.date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#536275] dark:text-slate-400 mt-0.5">
              <Clock className="w-3 h-3 text-[#C5A063]" />
              <span className="truncate">{formData.time}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#CBD5E1]/40 dark:border-white/10">
            <span className="text-[10px] font-bold text-[#8C9AA9] uppercase tracking-wider block mb-1">
              Event Venue
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#16212F] dark:text-white">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span className="truncate">{formData.venue}</span>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
              Live Priority Seating Open
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#CBD5E1]/40 dark:border-white/10">
            <span className="text-[10px] font-bold text-[#8C9AA9] uppercase tracking-wider block mb-1">
              Featured Guests ({formData.speakers.length})
            </span>
            <div className="flex items-center -space-x-2 overflow-hidden py-0.5">
              {formData.speakers.slice(0, 4).map((spk, idx) => (
                <img
                  key={idx}
                  src={spk.avatar}
                  alt={spk.name}
                  title={`${spk.name} (${spk.org})`}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-white dark:ring-[#141A26]"
                />
              ))}
              {formData.speakers.length > 4 && (
                <div className="w-7 h-7 rounded-full bg-[#3A5982] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  +{formData.speakers.length - 4}
                </div>
              )}
            </div>
            <span className="text-[10px] text-[#536275] dark:text-slate-400 mt-1 block truncate">
              {formData.speakers.map((s) => s.name.split(' ')[0]).join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Expandable Live Modification Form */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/10 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'details'
                  ? 'bg-[#3A5982] text-white shadow-xs'
                  : 'text-[#536275] dark:text-slate-400 hover:text-[#16212F] dark:hover:text-white'
              }`}
            >
              1. Title, Dates & Logistics
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('guests')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'guests'
                  ? 'bg-[#3A5982] text-white shadow-xs'
                  : 'text-[#536275] dark:text-slate-400 hover:text-[#16212F] dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>2. Featured Guests ({formData.speakers.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('media')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'media'
                  ? 'bg-[#3A5982] text-white shadow-xs'
                  : 'text-[#536275] dark:text-slate-400 hover:text-[#16212F] dark:hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>3. Visual Theme & Media</span>
            </button>
          </div>

          {/* TAB 1: Event Details & Dates */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#16212F] dark:text-white mb-1.5">
                    Eyebrow Status Badge
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => handleFieldChange('badge', e.target.value)}
                    placeholder="e.g. STUDENT WELFARE TALK SERIES • FLAGSHIP INAUGURAL"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-white/15 text-xs text-[#16212F] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#3A5982]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#16212F] dark:text-white mb-1.5">
                    Primary Headline / Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    placeholder="e.g. TALK SERIES COMING SOON"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-white/15 text-xs text-[#16212F] dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#3A5982]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#16212F] dark:text-white mb-1.5">
                    Subtitle / Theme Motto
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                    placeholder="e.g. Distinguished Voices & Vanguard Leadership at Yeshwanthpur"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-white/15 text-xs text-[#16212F] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#3A5982]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#16212F] dark:text-white mb-1.5">
                    Event Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#8C9AA9] absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) => handleFieldChange('date', e.target.value)}
                      placeholder="e.g. March 24, 2026"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-white/15 text-xs text-[#16212F] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#3A5982]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#16212F] dark:text-white mb-1.5">
                    Event Time
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#8C9AA9] absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={formData.time}
                      onChange={(e) => handleFieldChange('time', e.target.value)}
                      placeholder="e.g. 10:30 AM – 1:00 PM IST"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-white/15 text-xs text-[#16212F] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#3A5982]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#16212F] dark:text-white mb-1.5">
                    Venue Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#8C9AA9] absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => handleFieldChange('venue', e.target.value)}
                      placeholder="e.g. Main Auditorium, Block B • Yeshwanthpur Campus"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-white/15 text-xs text-[#16212F] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#3A5982]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#16212F] dark:text-white mb-1.5">
                    Context Description / Overview
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    placeholder="Provide a compelling overview for students regarding this signature address..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-white/15 text-xs text-[#16212F] dark:text-white font-normal focus:outline-none focus:ring-2 focus:ring-[#3A5982] resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Featured Guests ("guests coming") */}
          {activeTab === 'guests' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-[#16212F] dark:text-white">
                    Featured Guests & Speakers Panel
                  </h4>
                  <p className="text-xs text-[#536275] dark:text-slate-400">
                    Add or update dignitaries, industry leaders, judges, and keynote speakers who will be present.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingGuest(!isAddingGuest)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#3A5982] text-white hover:bg-[#2D476C] transition-colors self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Guest</span>
                </button>
              </div>

              {/* Add Guest Form */}
              {isAddingGuest && (
                <form
                  onSubmit={handleAddGuest}
                  className="p-4 rounded-2xl bg-slate-100/80 dark:bg-white/[0.04] border border-[#CBD5E1] dark:border-white/15 space-y-3"
                >
                  <span className="text-xs font-bold text-[#3A5982] dark:text-[#93C5FD] block">
                    Register New Featured Guest
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#16212F] dark:text-white mb-1">
                        Full Name & Honorific
                      </label>
                      <input
                        type="text"
                        required
                        value={newGuestName}
                        onChange={(e) => setNewGuestName(e.target.value)}
                        placeholder="e.g. Dr. K. Radhakrishnan"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#141A26] border border-[#CBD5E1] dark:border-white/15 text-xs text-[#16212F] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3A5982]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#16212F] dark:text-white mb-1">
                        Title / Role at Event
                      </label>
                      <input
                        type="text"
                        value={newGuestRole}
                        onChange={(e) => setNewGuestRole(e.target.value)}
                        placeholder="e.g. Keynote Speaker / Chief Guest"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#141A26] border border-[#CBD5E1] dark:border-white/15 text-xs text-[#16212F] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3A5982]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#16212F] dark:text-white mb-1">
                        Organization / Affiliation
                      </label>
                      <input
                        type="text"
                        value={newGuestOrg}
                        onChange={(e) => setNewGuestOrg(e.target.value)}
                        placeholder="e.g. Former Chairman, ISRO"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#141A26] border border-[#CBD5E1] dark:border-white/15 text-xs text-[#16212F] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3A5982]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#16212F] dark:text-white mb-1">
                        Avatar Photograph URL
                      </label>
                      <input
                        type="url"
                        value={newGuestAvatar}
                        onChange={(e) => setNewGuestAvatar(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#141A26] border border-[#CBD5E1] dark:border-white/15 text-xs text-[#16212F] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3A5982]"
                      />
                    </div>
                  </div>

                  {/* Preset Avatar Selection */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-[#536275] dark:text-slate-400">
                      Quick Avatars:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {PRESET_AVATARS.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setNewGuestAvatar(url)}
                          className={`w-6 h-6 rounded-full overflow-hidden border transition-all ${
                            newGuestAvatar === url ? 'ring-2 ring-[#3A5982] scale-110' : 'opacity-70'
                          }`}
                        >
                          <img src={url} alt="preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingGuest(false)}
                      className="px-3 py-1.5 rounded-xl text-xs text-[#536275] dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#3A5982] text-white hover:bg-[#2D476C]"
                    >
                      Confirm Guest
                    </button>
                  </div>
                </form>
              )}

              {/* Existing Guests List */}
              <div className="space-y-3">
                {formData.speakers.map((guest, idx) => (
                  <div
                    key={guest.id || idx}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#CBD5E1]/60 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={guest.avatar}
                        alt={guest.name}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-black/10 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={guest.name}
                            onChange={(e) => handleUpdateGuest(guest.id, { name: e.target.value })}
                            className="font-bold text-xs sm:text-sm text-[#16212F] dark:text-white bg-transparent border-b border-dashed border-gray-300 focus:border-[#3A5982] focus:outline-none"
                          />
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C5A063]/20 text-[#8C6D34] dark:text-[#E6C98F] font-semibold">
                            Guest #{idx + 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="text"
                            value={guest.role}
                            onChange={(e) => handleUpdateGuest(guest.id, { role: e.target.value })}
                            placeholder="Role"
                            className="text-xs text-[#536275] dark:text-slate-400 bg-transparent border-b border-dashed border-gray-200 focus:border-[#3A5982] focus:outline-none max-w-[140px]"
                          />
                          <span className="text-xs text-[#CBD5E1]">•</span>
                          <input
                            type="text"
                            value={guest.org}
                            onChange={(e) => handleUpdateGuest(guest.id, { org: e.target.value })}
                            placeholder="Affiliation"
                            className="text-xs text-[#8C9AA9] bg-transparent border-b border-dashed border-gray-200 focus:border-[#3A5982] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleRemoveGuest(guest.id)}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Remove Guest"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Visual Theme & Media */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#16212F] dark:text-white mb-2">
                  Select Banner Background Ambience
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {PRESET_BACKGROUNDS.map((bg, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleFieldChange('bgImage', bg.url)}
                      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all group relative ${
                        formData.bgImage === bg.url
                          ? 'border-[#C5A063] shadow-md ring-2 ring-[#C5A063]/30'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="h-24 w-full relative">
                        <img
                          src={bg.url}
                          alt={bg.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                          <span className="text-[11px] font-bold text-white drop-shadow-sm">
                            {bg.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#16212F] dark:text-white mb-1.5">
                  Custom Banner Background URL
                </label>
                <input
                  type="url"
                  value={formData.bgImage}
                  onChange={(e) => handleFieldChange('bgImage', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-white/15 text-xs text-[#16212F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3A5982]"
                />
              </div>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={resetHeroSettings}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C9AA9] hover:text-rose-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default Flagship</span>
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#536275] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-[#C5A063] hover:bg-[#B38E52] text-black shadow-sm transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Save & Apply to Student View</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

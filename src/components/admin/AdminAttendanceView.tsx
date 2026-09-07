import React, { useState, useEffect, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import { useApp } from '../../context/AppContext';
import { AppleCard } from '../common/AppleCard';
import { AppleButton } from '../common/AppleButton';
import { QRCodeDisplay } from '../common/QRCodeDisplay';
import { 
  AppleSkeleton, 
  AppleSkeletonStat, 
  AppleSkeletonTable 
} from '../common/AppleSkeleton';
import { 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Users, 
  Clock, 
  Sparkles, 
  Camera, 
  CameraOff, 
  UploadCloud, 
  CheckCheck, 
  AlertCircle,
  Download,
  Printer,
  RotateCcw,
  Volume2,
  VolumeX,
  Zap,
  UserPlus,
  FileCheck,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sliders
} from 'lucide-react';
import { Registration } from '../../types';

// Audio chime synthesizer using standard Web Audio API
const playTone = (type: 'success' | 'error' | 'duplicate') => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'success') {
      // Pleasant dual-chime harmonic (iOS check-in style)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      osc2.frequency.setValueAtTime(739.99, now); // F#5
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15); // D6

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } else {
      // Low dual warning buzzer
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(type === 'duplicate' ? 330 : 220, now);
      osc.frequency.setValueAtTime(type === 'duplicate' ? 260 : 180, now + 0.15);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch {
    // Audio context may be restricted in some browser environments
  }
};

interface ScanLog {
  id: string;
  time: string;
  code: string;
  studentName: string;
  regNo: string;
  dept: string;
  status: 'Verified' | 'Duplicate' | 'Invalid';
  message: string;
}

export const AdminAttendanceView: React.FC = () => {
  const { 
    events, 
    registrations, 
    markAttendance, 
    unmarkAttendance, 
    bulkMarkAttendance, 
    attendanceRecords,
    registerSpotAttendee,
    showToast 
  } = useApp();

  // Navigation & view states
  const [activeTab, setActiveTab] = useState<'scanner' | 'generator' | 'roster' | 'spot'>('scanner');
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [isLoadingEventData, setIsLoadingEventData] = useState(false);

  // Scanner states
  const [scanInput, setScanInput] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastScannedResult, setLastScannedResult] = useState<{
    success: boolean;
    message: string;
    studentName?: string;
    studentRegNo?: string;
    studentDept?: string;
    ticketCode?: string;
    time?: string;
  } | null>(null);
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([]);
  const [isCooldown, setIsCooldown] = useState(false);

  // QR Generator States
  const [qrColor, setQrColor] = useState<string>('#16212F');
  const [qrLevel, setQrLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [customQrText, setCustomQrText] = useState<string>('');
  const [activePassModal, setActivePassModal] = useState<Registration | null>(null);

  // Spot registration form
  const [spotName, setSpotName] = useState('');
  const [spotRegNo, setSpotRegNo] = useState('');
  const [spotDept, setSpotDept] = useState('School of Sciences');
  const [spotRole, setSpotRole] = useState<'Student' | 'VIP' | 'Faculty' | 'Delegate'>('Student');
  const [spotEmail, setSpotEmail] = useState('');

  // Roster search and filters
  const [searchRoster, setSearchRoster] = useState('');
  const [rosterFilter, setRosterFilter] = useState<'all' | 'present' | 'pending'>('all');

  // Video & Canvas references for live scanning
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];

  // Registrations for the selected event
  const eventRegistrations = registrations.filter(
    (r) => r.eventId === currentEvent?.id && r.status !== 'Cancelled'
  );

  const attendedCount = eventRegistrations.filter((r) => r.status === 'Attended').length;
  const attendanceRate = eventRegistrations.length > 0
    ? Math.round((attendedCount / eventRegistrations.length) * 100)
    : 0;

  // Simulate smooth Apple loading skeleton on event change
  const handleEventChange = (newId: string) => {
    setIsLoadingEventData(true);
    setSelectedEventId(newId);
    setTimeout(() => {
      setIsLoadingEventData(false);
    }, 450);
  };

  // Process a scanned or entered code
  const processCode = useCallback((rawCode: string) => {
    if (!rawCode || isCooldown) return;

    // Sanitize string (extract ticket code from URL if provided)
    let cleanCode = rawCode.trim();
    if (cleanCode.includes('?code=')) {
      const match = cleanCode.match(/[?&]code=([^&]+)/);
      if (match) cleanCode = decodeURIComponent(match[1]);
    } else if (cleanCode.includes('ticket=')) {
      const match = cleanCode.match(/[?&]ticket=([^&]+)/);
      if (match) cleanCode = decodeURIComponent(match[1]);
    }

    setIsCooldown(true);
    setTimeout(() => {
      setIsCooldown(false);
    }, 1800);

    const result = markAttendance(currentEvent?.id || '', cleanCode, 'QR');
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (result.success) {
      if (soundEnabled) playTone('success');
      if (navigator.vibrate) navigator.vibrate([40, 60, 40]);

      const logItem: ScanLog = {
        id: 'log_' + Date.now(),
        time: nowTime,
        code: cleanCode,
        studentName: result.record?.studentName || result.registration?.studentName || 'Attendee',
        regNo: result.record?.studentRegNo || result.registration?.studentRegNo || cleanCode,
        dept: result.record?.studentDept || result.registration?.studentDept || 'Christ University',
        status: 'Verified',
        message: result.message,
      };

      setScanLogs((prev) => [logItem, ...prev.slice(0, 19)]);
      setLastScannedResult({
        success: true,
        message: result.message,
        studentName: logItem.studentName,
        studentRegNo: logItem.regNo,
        studentDept: logItem.dept,
        ticketCode: cleanCode,
        time: nowTime,
      });
    } else {
      const isDup = result.message.toLowerCase().includes('already');
      if (soundEnabled) playTone(isDup ? 'duplicate' : 'error');

      const logItem: ScanLog = {
        id: 'log_' + Date.now(),
        time: nowTime,
        code: cleanCode,
        studentName: result.registration?.studentName || 'Unknown Student',
        regNo: result.registration?.studentRegNo || cleanCode,
        dept: result.registration?.studentDept || 'N/A',
        status: isDup ? 'Duplicate' : 'Invalid',
        message: result.message,
      };

      setScanLogs((prev) => [logItem, ...prev.slice(0, 19)]);
      setLastScannedResult({
        success: false,
        message: result.message,
        studentName: result.registration?.studentName,
        studentRegNo: result.registration?.studentRegNo,
        ticketCode: cleanCode,
        time: nowTime,
      });
    }
  }, [currentEvent?.id, isCooldown, markAttendance, soundEnabled]);

  // Real-time Camera Scanner Frame Loop
  const scanLoop = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data && !isCooldown) {
        processCode(code.data);
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanLoop);
  }, [isCameraActive, isCooldown, processCode]);

  // Start Camera Feed
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: unknown) {
      console.warn('Camera access issue:', err);
      const errorMsg = err instanceof Error ? err.message : 'Camera unavailable or permission denied.';
      setCameraError(
        `${errorMsg} (Tip: You can also upload a ticket QR screenshot below or use the fast entry barcode field).`
      );
      setIsCameraActive(false);
    }
  };

  // Stop Camera Feed
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // Effect for video loop
  useEffect(() => {
    if (isCameraActive) {
      animationFrameRef.current = requestAnimationFrame(scanLoop);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isCameraActive, scanLoop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Handle QR image file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = img.width;
        offscreenCanvas.height = img.height;
        const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
        if (offscreenCtx) {
          offscreenCtx.drawImage(img, 0, 0);
          const imgData = offscreenCtx.getImageData(0, 0, img.width, img.height);
          const qr = jsQR(imgData.data, imgData.width, imgData.height);
          if (qr && qr.data) {
            processCode(qr.data);
          } else {
            showToast('QR Not Found', 'Could not detect a valid QR code in the uploaded image.', 'warning');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle manual input form
  const handleManualScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;
    processCode(scanInput.trim());
    setScanInput('');
  };

  // Handle Spot Registration submission
  const handleCreateSpotRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spotName.trim() || !spotRegNo.trim()) {
      showToast('Incomplete Details', 'Attendee name and register number are required.', 'error');
      return;
    }

    const res = registerSpotAttendee(currentEvent.id, {
      name: spotName.trim(),
      regNo: spotRegNo.trim(),
      dept: spotDept,
      email: spotEmail.trim() || undefined,
      role: spotRole,
    });

    if (res.success && res.registration) {
      // Auto check-in the spot attendee immediately
      markAttendance(currentEvent.id, res.registration.ticketCode, 'QR');
      setActivePassModal(res.registration);
      setSpotName('');
      setSpotRegNo('');
      setSpotEmail('');
    }
  };

  // Filter roster
  const filteredRoster = eventRegistrations.filter((r) => {
    if (rosterFilter === 'present' && r.status !== 'Attended') return false;
    if (rosterFilter === 'pending' && r.status === 'Attended') return false;
    if (!searchRoster.trim()) return true;
    const q = searchRoster.toLowerCase();
    return (
      r.studentName.toLowerCase().includes(q) ||
      r.studentRegNo.toLowerCase().includes(q) ||
      r.ticketCode.toLowerCase().includes(q) ||
      r.studentDept.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-20">
      {/* =========================================================================
          AUDITORIUM GATE ATTENDANCE HEADER & EVENT SELECTOR
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 p-6 sm:p-8 rounded-[28px] bg-white dark:bg-[#16212F] border border-[#E2E8F0] dark:border-white/10 shadow-sm transition-colors">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C5A063]/15 text-[#9D7A3E] dark:text-[#E2C78A] border border-[#C5A063]/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              SWO Gate Control Matrix
            </span>
            <span className="text-xs text-[#536275] dark:text-slate-400 font-medium">
              Bangalore Yeshwanthpur Campus
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#16212F] dark:text-white tracking-tight">
            Gate Attendance & QR Turnstile
          </h1>
          <p className="text-xs sm:text-sm text-[#536275] dark:text-slate-300">
            Real-time optical camera QR reader, instant badge generation, Christ University turnstile validation, and spot registrations.
          </p>
        </div>

        {/* Event Selector and Quick Controls */}
        <div className="w-full lg:w-80 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#536275] dark:text-[#94A3B8]">
              Active Gate Event
            </label>
            <span className="text-[11px] font-semibold text-[#0071E3] dark:text-[#93C5FD]">
              {currentEvent?.venue}
            </span>
          </div>

          <select
            value={selectedEventId}
            onChange={(e) => handleEventChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-[#CBD5E1] dark:border-white/15 text-xs font-bold text-[#16212F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 shadow-xs"
          >
            {events.map((evt) => (
              <option key={evt.id} value={evt.id} className="bg-white dark:bg-[#16212F] text-[#16212F] dark:text-white">
                {evt.title} ({new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* =========================================================================
          APPLE-STYLE METRICS BAR (WITH LOADING SKELETON SUPPORT)
          ========================================================================= */}
      {isLoadingEventData ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <AppleSkeletonStat />
          <AppleSkeletonStat />
          <AppleSkeletonStat />
          <AppleSkeletonStat />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#16212F] border border-[#E2E8F0] dark:border-white/10 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#536275] dark:text-[#94A3B8]">
                Registered
              </span>
              <Users className="w-4 h-4 text-[#0071E3] dark:text-[#93C5FD]" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-[#16212F] dark:text-white mt-1">
              {eventRegistrations.length}
            </p>
            <p className="text-[10px] text-[#536275] dark:text-slate-400">Total verified passes</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#16212F] border border-[#E2E8F0] dark:border-white/10 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#536275] dark:text-[#94A3B8]">
                Admitted Present
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {attendedCount}
            </p>
            <p className="text-[10px] text-[#536275] dark:text-slate-400">Checked in at gate</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#16212F] border border-[#E2E8F0] dark:border-white/10 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#536275] dark:text-[#94A3B8]">
                Pending Entry
              </span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {eventRegistrations.length - attendedCount}
            </p>
            <p className="text-[10px] text-[#536275] dark:text-slate-400">Yet to scan at door</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#16212F] border border-[#E2E8F0] dark:border-white/10 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#536275] dark:text-[#94A3B8]">
                Turnout Rate
              </span>
              <Sparkles className="w-4 h-4 text-[#C5A063]" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-[#0071E3] dark:text-[#93C5FD] mt-1">
              {attendanceRate}%
            </p>
            <p className="text-[10px] text-[#536275] dark:text-slate-400">Capacity fill percentage</p>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE MODE SEGMENTED BAR (Apple-Style Pill Navigation)
          ========================================================================= */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[#E2E8F0] dark:border-white/10 pb-4">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-[#CBD5E1]/70 dark:border-white/10">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'scanner'
                ? 'bg-white dark:bg-[#1B283A] text-[#16212F] dark:text-white shadow-sm'
                : 'text-[#536275] dark:text-slate-400 hover:text-[#16212F] dark:hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>Live QR Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'generator'
                ? 'bg-white dark:bg-[#1B283A] text-[#16212F] dark:text-white shadow-sm'
                : 'text-[#536275] dark:text-slate-400 hover:text-[#16212F] dark:hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-[#C5A063]" />
            <span>QR Pass & Poster Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'roster'
                ? 'bg-white dark:bg-[#1B283A] text-[#16212F] dark:text-white shadow-sm'
                : 'text-[#536275] dark:text-slate-400 hover:text-[#16212F] dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Gate Roster ({eventRegistrations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('spot')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'spot'
                ? 'bg-white dark:bg-[#1B283A] text-[#16212F] dark:text-white shadow-sm'
                : 'text-[#536275] dark:text-slate-400 hover:text-[#16212F] dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-indigo-500" />
            <span>Spot Registration</span>
          </button>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-white/5 border border-[#CBD5E1] dark:border-white/15 text-[#536275] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
            title={soundEnabled ? 'Mute audio chime' : 'Enable audio chime'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#0071E3]" />
                <span className="hidden sm:inline">Chime Active</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#8C9AA9]" />
                <span className="hidden sm:inline">Muted</span>
              </>
            )}
          </button>

          <AppleButton
            variant="secondary"
            size="sm"
            icon={<CheckCheck className="w-3.5 h-3.5 text-[#0071E3]" />}
            onClick={() => bulkMarkAttendance(currentEvent?.id)}
          >
            Admit All Pending
          </AppleButton>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: LIVE QR CAMERA & OPTICAL SCANNER TERMINAL
          ========================================================================= */}
      {activeTab === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Optical Viewfinder & Hardware Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-[28px] bg-white dark:bg-[#16212F] border border-[#E2E8F0] dark:border-white/10 shadow-sm space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-[#16212F] dark:text-white">
                    Live Optical Gate Viewfinder
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isCameraActive ? (
                    <button
                      onClick={stopCamera}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 hover:bg-rose-100 transition-colors"
                    >
                      <CameraOff className="w-3.5 h-3.5" />
                      <span>Stop Camera</span>
                    </button>
                  ) : (
                    <button
                      onClick={startCamera}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#0071E3] hover:bg-[#005bb5] text-white shadow-xs transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Start Camera</span>
                    </button>
                  )}

                  {isCameraActive && (
                    <button
                      onClick={() => {
                        const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
                        setFacingMode(nextFacing);
                        stopCamera();
                        setTimeout(() => startCamera(), 150);
                      }}
                      className="p-1.5 rounded-full text-[#536275] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-[#CBD5E1] dark:border-white/15"
                      title="Flip Camera"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Viewfinder Canvas Area */}
              <div className="relative h-72 sm:h-80 w-full rounded-2xl bg-black overflow-hidden flex flex-col items-center justify-center text-white select-none">
                {/* Hidden video and canvas processing nodes */}
                <video
                  ref={videoRef}
                  className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
                  autoPlay
                  muted
                  playsInline
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Reticle / Viewfinder Overlay */}
                <div className="absolute inset-8 sm:inset-12 border border-white/20 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                  {/* Four Corner reticles */}
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-t-2 border-l-2 border-[#C5A063] rounded-tl-lg" />
                    <div className="w-6 h-6 border-t-2 border-r-2 border-[#C5A063] rounded-tr-lg" />
                  </div>

                  {/* Animated laser line */}
                  <div className="w-full relative">
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#34C759] to-transparent shadow-[0_0_12px_#34C759] animate-pulse" />
                  </div>

                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-b-2 border-l-2 border-[#C5A063] rounded-bl-lg" />
                    <div className="w-6 h-6 border-b-2 border-r-2 border-[#C5A063] rounded-br-lg" />
                  </div>
                </div>

                {/* Cooldown / Detection Flash */}
                {isCooldown && (
                  <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[2px] pointer-events-none flex items-center justify-center">
                    <div className="px-4 py-2 rounded-full bg-black/80 border border-emerald-400/50 text-emerald-400 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Pass Captured</span>
                    </div>
                  </div>
                )}

                {/* Inactive state prompt */}
                {!isCameraActive && (
                  <div className="relative z-10 text-center space-y-3 px-6 max-w-sm">
                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-white/80">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Camera Standby</p>
                      <p className="text-xs text-white/60 mt-1">
                        Click &ldquo;Start Camera&rdquo; above to initiate optical QR ticket scanning, or upload an image file below.
                      </p>
                    </div>
                    <button
                      onClick={startCamera}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0071E3] hover:bg-[#005bb5] text-white transition-all shadow-md inline-flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>Launch Optical Scanner</span>
                    </button>
                  </div>
                )}

                {cameraError && (
                  <div className="absolute bottom-3 inset-x-3 p-3 rounded-xl bg-rose-950/90 border border-rose-500/40 text-rose-200 text-xs text-center">
                    {cameraError}
                  </div>
                )}
              </div>

              {/* Alternative Scanning Inputs: File Upload & Manual Barcode entry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* File Upload Scanner */}
                <label className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border-2 border-dashed border-[#CBD5E1] dark:border-white/15 hover:border-[#0071E3] cursor-pointer transition-colors text-center group">
                  <UploadCloud className="w-4 h-4 text-[#0071E3] group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-[#16212F] dark:text-slate-200">
                    Upload Ticket Screenshot
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Quick Barcode gun / code text input */}
                <form onSubmit={handleManualScanSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ticket Code or Reg No..."
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-white/5 border border-[#CBD5E1] dark:border-white/15 text-xs font-mono font-bold text-[#16212F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                  />
                  <AppleButton type="submit" variant="primary" size="sm">
                    Verify
                  </AppleButton>
                </form>
              </div>

              {/* Sample test tickets for immediate simulator testing */}
              <div className="pt-3 border-t border-[#E2E8F0] dark:border-white/10 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C9AA9] dark:text-[#94A3B8] block">
                  Quick-Test Sample Passes:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {eventRegistrations.slice(0, 4).map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => processCode(r.ticketCode)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-[11px] font-mono font-semibold text-[#0071E3] dark:text-[#93C5FD] border border-[#CBD5E1]/60 dark:border-white/10 hover:bg-[#0071E3]/10 transition-colors"
                    >
                      {r.ticketCode} ({r.studentName.split(' ')[0]})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Instant Verification Feedback & Gate Activity Feed (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Last Verification Outcome Card */}
            <div className="p-6 rounded-[28px] bg-white dark:bg-[#16212F] border border-[#E2E8F0] dark:border-white/10 shadow-sm space-y-4 transition-colors">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C9AA9] dark:text-[#94A3B8] block">
                Instant Turnstile Validation
              </span>

              {lastScannedResult ? (
                <div
                  className={`p-5 rounded-2xl border transition-all ${
                    lastScannedResult.success
                      ? 'bg-emerald-50/90 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                      : 'bg-rose-50/90 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {lastScannedResult.success ? (
                      <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-7 h-7 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider">
                          {lastScannedResult.success ? 'Verified Check-In' : 'Entry Restricted'}
                        </span>
                        <span className="text-[10px] font-mono opacity-70">
                          {lastScannedResult.time}
                        </span>
                      </div>

                      <p className="text-sm font-extrabold">
                        {lastScannedResult.studentName || lastScannedResult.message}
                      </p>

                      {lastScannedResult.studentRegNo && (
                        <p className="text-xs font-mono font-semibold">
                          Reg No: {lastScannedResult.studentRegNo}
                        </p>
                      )}

                      {lastScannedResult.studentDept && (
                        <p className="text-xs opacity-80">
                          Dept: {lastScannedResult.studentDept}
                        </p>
                      )}

                      {lastScannedResult.ticketCode && (
                        <div className="pt-2">
                          <span className="px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px] font-bold">
                            Ticket: {lastScannedResult.ticketCode}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-dashed border-[#CBD5E1] dark:border-white/10 text-center space-y-2">
                  <QrCode className="w-8 h-8 text-[#8C9AA9] mx-auto" />
                  <p className="text-xs font-semibold text-[#536275] dark:text-slate-300">
                    Awaiting First Gate Scan
                  </p>
                  <p className="text-[11px] text-[#8C9AA9] dark:text-slate-400">
                    Point camera at a student pass or click a quick-test code to verify presence.
                  </p>
                </div>
              )}
            </div>

            {/* Live Scan Audit History Log */}
            <div className="p-6 rounded-[28px] bg-white dark:bg-[#16212F] border border-[#E2E8F0] dark:border-white/10 shadow-sm space-y-3 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C9AA9] dark:text-[#94A3B8]">
                  Recent Turnstile Feed ({scanLogs.length})
                </span>
                {scanLogs.length > 0 && (
                  <button
                    onClick={() => setScanLogs([])}
                    className="text-[10px] text-[#8C9AA9] hover:text-rose-500 transition-colors"
                  >
                    Clear Feed
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 divide-y divide-[#E2E8F0] dark:divide-white/5">
                {scanLogs.length === 0 ? (
                  <p className="text-xs text-[#8C9AA9] dark:text-slate-400 text-center py-4">
                    No scans registered in this session yet.
                  </p>
                ) : (
                  scanLogs.map((log) => (
                    <div key={log.id} className="pt-2 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        {log.status === 'Verified' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                        <div>
                          <p className="font-bold text-[#16212F] dark:text-white line-clamp-1">
                            {log.studentName}
                          </p>
                          <p className="text-[10px] font-mono text-[#8C9AA9]">
                            {log.regNo} • {log.code}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-[#8C9AA9] block font-mono">
                          {log.time}
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            log.status === 'Verified'
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: QR PASS & PRINTABLE POSTER GENERATOR
          ========================================================================= */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Customizer (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-[28px] bg-white dark:bg-[#16212F] border border-[#E2E8F0] dark:border-white/10 shadow-sm space-y-5 transition-colors">
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#16212F] dark:text-white tracking-tight">
                  Gate Standee & Poster Engine
                </h3>
                <p className="text-xs text-[#536275] dark:text-slate-300">
                  Generate high-resolution scannable QR passes and printable check-in posters for entrance gates.
                </p>
              </div>

              {/* Color Customizer */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#16212F] dark:text-white block">
                  QR Foreground Accent
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Deep Navy', val: '#16212F' },
                    { label: 'Christ Gold', val: '#C5A063' },
                    { label: 'Royal Blue', val: '#0071E3' },
                    { label: 'Emerald', val: '#059669' },
                  ].map((c) => (
                    <button
                      key={c.val}
                      type="button"
                      onClick={() => setQrColor(c.val)}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center gap-1.5 ${
                        qrColor === c.val
                          ? 'border-[#0071E3] bg-[#0071E3]/10 text-[#0071E3]'
                          : 'border-[#CBD5E1] dark:border-white/10 text-[#536275] dark:text-slate-400'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.val }} />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error correction level */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#16212F] dark:text-white block">
                  Error Correction Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['L', 'M', 'Q', 'H'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setQrLevel(lvl)}
                      className={`py-1.5 rounded-xl text-xs font-bold border ${
                        qrLevel === lvl
                          ? 'bg-[#16212F] text-white dark:bg-white dark:text-[#16212F]'
                          : 'border-[#CBD5E1] dark:border-white/10 text-[#536275]'
                      }`}
                    >
                      {lvl} {lvl === 'H' ? '(High 30%)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Payload input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#16212F] dark:text-white block">
                  Payload / Custom URL
                </label>
                <input
                  type="text"
                  placeholder={`https://swo.christuniversity.in/checkin?event=${currentEvent?.id}`}
                  value={customQrText}
                  onChange={(e) => setCustomQrText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-[#CBD5E1] dark:border-white/15 text-xs font-mono text-[#16212F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                />
                <p className="text-[10px] text-[#8C9AA9]">
                  Leave blank to auto-encode event token: <code className="font-mono text-[#0071E3]">{currentEvent?.id}</code>
                </p>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-[#E2E8F0] dark:border-white/10 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#16212F] dark:bg-white text-white dark:text-[#16212F] text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Gate Poster</span>
                </button>
              </div>
            </div>
          </div>

          {/* Printable Gate Poster Preview (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-12 rounded-[32px] bg-gradient-to-b from-white to-slate-50 dark:from-[#16212F] dark:to-[#121A26] border-2 border-[#C5A063]/40 shadow-xl flex flex-col items-center text-center space-y-6">
              {/* Header Crest */}
              <div className="space-y-1">
                <div className="w-14 h-14 rounded-full bg-white p-1 flex items-center justify-center mx-auto border-2 border-[#C5A063] shadow-md">
                  <img
                    src="/christ-university-crest.png"
                    alt="CHRIST (Deemed to be University) Official Crest"
                    className="w-full h-full object-contain select-none"
                  />
                </div>
                <p className="text-[11px] font-black uppercase tracking-widest text-[#C5A063]">
                  Christ University • Yeshwanthpur Campus
                </p>
                <p className="text-xs font-extrabold text-[#16212F] dark:text-white">
                  Student Welfare Office (SWO)
                </p>
              </div>

              {/* Event Badge & Title */}
              <div className="space-y-2 max-w-md">
                <span className="px-3 py-1 rounded-full bg-[#C5A063]/20 text-[#9D7A3E] dark:text-[#E2C78A] text-[10px] font-extrabold uppercase tracking-wider">
                  {currentEvent?.category} • Official Gate Pass
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#16212F] dark:text-white tracking-tight">
                  {currentEvent?.title}
                </h2>
                <p className="text-xs text-[#536275] dark:text-slate-300">
                  {currentEvent?.venue} • {currentEvent?.time}
                </p>
              </div>

              {/* High-Resolution Scannable QR Code */}
              <div className="p-4 rounded-3xl bg-white shadow-lg border border-slate-200">
                <QRCodeDisplay
                  value={customQrText.trim() || `https://swo.christuniversity.in/checkin?event=${currentEvent?.id}&gate=auditorium`}
                  size={200}
                  fgColor={qrColor}
                  level={qrLevel}
                  centerLogo={true}
                />
              </div>

              {/* Instructions */}
              <div className="space-y-1 max-w-xs">
                <p className="text-xs font-bold text-[#16212F] dark:text-white">
                  Scan at Entrance for Instant Admission
                </p>
                <p className="text-[10px] text-[#536275] dark:text-slate-400">
                  Hold your personal student e-pass or camera in front of the gate sensor to confirm attendance.
                </p>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] dark:border-white/10 w-full flex items-center justify-between text-[10px] text-[#8C9AA9]">
                <span>Gate: 01 Main Turnstile</span>
                <span>Authorized Student Welfare Office Seal</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: LIVE GATE ROSTER & PRESENCE LEDGER (WITH SKELETON SUPPORT)
          ========================================================================= */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8C9AA9] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search attendee by name, register number, ticket code, department..."
                value={searchRoster}
                onChange={(e) => setSearchRoster(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#16212F] border border-[#CBD5E1] dark:border-white/10 text-xs font-medium text-[#16212F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 shadow-xs"
              />
            </div>

            {/* Filter Pills */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-[#CBD5E1] dark:border-white/10">
              <button
                onClick={() => setRosterFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  rosterFilter === 'all'
                    ? 'bg-white dark:bg-[#16212F] text-[#16212F] dark:text-white shadow-xs'
                    : 'text-[#536275] dark:text-slate-400'
                }`}
              >
                All ({eventRegistrations.length})
              </button>
              <button
                onClick={() => setRosterFilter('present')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  rosterFilter === 'present'
                    ? 'bg-white dark:bg-[#16212F] text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-[#536275] dark:text-slate-400'
                }`}
              >
                Present ({attendedCount})
              </button>
              <button
                onClick={() => setRosterFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  rosterFilter === 'pending'
                    ? 'bg-white dark:bg-[#16212F] text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'text-[#536275] dark:text-slate-400'
                }`}
              >
                Pending ({eventRegistrations.length - attendedCount})
              </button>
            </div>
          </div>

          {/* Table Container (Shows AppleSkeletonTable if loading) */}
          {isLoadingEventData ? (
            <AppleSkeletonTable rows={6} />
          ) : (
            <div className="rounded-2xl bg-white dark:bg-[#16212F] border border-[#E2E8F0] dark:border-white/10 overflow-x-auto shadow-xs transition-colors">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-white/[0.02] border-b border-[#E2E8F0] dark:border-white/10 text-[#536275] dark:text-[#94A3B8] font-bold">
                  <tr>
                    <th className="p-4">Attendee Name</th>
                    <th className="p-4">Register Number</th>
                    <th className="p-4">Ticket Pass Code</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] dark:divide-white/5">
                  {filteredRoster.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#8C9AA9]">
                        No matching registrations found for this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredRoster.map((r) => {
                      const isPresent = r.status === 'Attended';
                      return (
                        <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors">
                          <td className="p-4">
                            <p className="font-extrabold text-[#16212F] dark:text-white">
                              {r.studentName}
                            </p>
                            <p className="text-[11px] text-[#536275] dark:text-slate-400">
                              {r.studentEmail}
                            </p>
                          </td>

                          <td className="p-4 font-mono font-bold text-[#0071E3] dark:text-[#93C5FD]">
                            {r.studentRegNo}
                          </td>

                          <td className="p-4 font-mono text-[#536275] dark:text-slate-300">
                            {r.ticketCode}
                          </td>

                          <td className="p-4 text-[#536275] dark:text-slate-300">
                            {r.studentDept}
                          </td>

                          <td className="p-4">
                            {isPresent ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                                <CheckCircle2 className="w-3 h-3" /> Present
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                                <Clock className="w-3 h-3" /> Unverified
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* View Pass Modal Trigger */}
                              <button
                                onClick={() => setActivePassModal(r)}
                                className="p-1.5 rounded-lg text-[#0071E3] hover:bg-[#0071E3]/10 transition-colors"
                                title="View / Print Scannable QR Pass"
                              >
                                <QrCode className="w-4 h-4" />
                              </button>

                              {isPresent ? (
                                <button
                                  onClick={() => {
                                    const record = attendanceRecords.find(
                                      (a) => a.eventId === currentEvent.id && (a.studentRegNo === r.studentRegNo || a.studentId === r.studentId)
                                    );
                                    if (record) {
                                      unmarkAttendance(record.id);
                                    }
                                  }}
                                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                >
                                  Revert
                                </button>
                              ) : (
                                <AppleButton
                                  variant="primary"
                                  size="sm"
                                  className="text-[10px] py-1 px-3"
                                  onClick={() => markAttendance(currentEvent.id, r.ticketCode, 'Manual')}
                                >
                                  Check In
                                </AppleButton>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 4: ON-THE-SPOT WALK-IN & VIP REGISTRATION GENERATOR
          ========================================================================= */}
      {activeTab === 'spot' && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#16212F] border border-[#E2E8F0] dark:border-white/10 shadow-sm space-y-6 transition-colors">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
              <UserPlus className="w-3.5 h-3.5" />
              <span>Gate Walk-In Registration</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#16212F] dark:text-white tracking-tight">
              Issue On-the-Spot Pass for {currentEvent?.title}
            </h2>
            <p className="text-xs text-[#536275] dark:text-slate-300">
              Generate an instant institutional QR ticket for walk-in attendees, special delegates, or faculty observers.
            </p>
          </div>

          <form onSubmit={handleCreateSpotRegistration} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#16212F] dark:text-white">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ramesh Kumar"
                  value={spotName}
                  onChange={(e) => setSpotName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-[#CBD5E1] dark:border-white/15 text-xs font-bold text-[#16212F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#16212F] dark:text-white">
                  Register No / Staff ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2447999 or FAC-8120"
                  value={spotRegNo}
                  onChange={(e) => setSpotRegNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-[#CBD5E1] dark:border-white/15 text-xs font-mono font-bold text-[#16212F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#16212F] dark:text-white">
                  Designation / Role
                </label>
                <select
                  value={spotRole}
                  onChange={(e) => setSpotRole(e.target.value as 'Student' | 'VIP' | 'Faculty' | 'Delegate')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-[#CBD5E1] dark:border-white/15 text-xs font-bold text-[#16212F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                >
                  <option value="Student">Student Walk-In</option>
                  <option value="VIP">VIP Dignitary</option>
                  <option value="Faculty">Faculty Observer</option>
                  <option value="Delegate">Inter-College Delegate</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#16212F] dark:text-white">
                  Department / Organization
                </label>
                <input
                  type="text"
                  value={spotDept}
                  onChange={(e) => setSpotDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-[#CBD5E1] dark:border-white/15 text-xs font-bold text-[#16212F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#16212F] dark:text-white">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="name@christuniversity.in"
                value={spotEmail}
                onChange={(e) => setSpotEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-[#CBD5E1] dark:border-white/15 text-xs font-medium text-[#16212F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#0071E3] hover:bg-[#005bb5] text-white font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Generate Spot Pass & Admit to Gate</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          STUDENT DIGITAL QR PASS PREVIEW MODAL
          ========================================================================= */}
      {activePassModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm rounded-[32px] bg-white dark:bg-[#16212F] border-2 border-[#C5A063]/50 shadow-2xl p-6 sm:p-8 space-y-6 text-center text-[#16212F] dark:text-white animate-in fade-in zoom-in duration-200">
            {/* Close button */}
            <button
              onClick={() => setActivePassModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <XCircle className="w-5 h-5" />
            </button>

            {/* University Crest */}
            <div className="space-y-1">
              <div className="w-12 h-12 rounded-full bg-white p-1 flex items-center justify-center mx-auto border-2 border-[#C5A063] shadow-sm">
                <img
                  src="/christ-university-crest.png"
                  alt="CHRIST (Deemed to be University) Official Crest"
                  className="w-full h-full object-contain select-none"
                />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#C5A063]">
                Christ University • SWO
              </p>
              <h3 className="text-lg font-black tracking-tight">
                {activePassModal.eventTitle}
              </h3>
            </div>

            {/* Scannable Pass QR Code */}
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 inline-block mx-auto">
              <QRCodeDisplay
                value={activePassModal.ticketCode}
                size={160}
                fgColor="#16212F"
                centerLogo={true}
              />
            </div>

            {/* Attendee Details */}
            <div className="space-y-1 text-xs">
              <p className="font-mono font-extrabold text-sm text-[#0071E3] dark:text-[#93C5FD]">
                {activePassModal.ticketCode}
              </p>
              <p className="font-black text-base">
                {activePassModal.studentName}
              </p>
              <p className="text-[#536275] dark:text-slate-400 font-mono">
                {activePassModal.studentRegNo} • {activePassModal.studentDept}
              </p>
              <p className="text-[10px] text-[#8C9AA9] pt-1">
                Venue: {activePassModal.eventVenue}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Pass</span>
              </button>
              <button
                onClick={() => {
                  markAttendance(activePassModal.eventId, activePassModal.ticketCode, 'QR');
                  setActivePassModal(null);
                }}
                className="flex-1 py-2 rounded-xl bg-[#0071E3] text-white text-xs font-bold hover:bg-[#005bb5] transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Admit Gate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

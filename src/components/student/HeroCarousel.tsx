import React, { useState, useEffect, useCallback } from 'react';
import { EventItem } from '../../types';
import { HeroBannerEmptyState } from '../common/EmptyState';
import { ChevronLeft, ChevronRight, Calendar, MapPin, ArrowUpRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroCarouselProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onExploreAll: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  events,
  onSelectEvent,
  onExploreAll,
}) => {
  const carouselEvents = events
    .filter((e) => e.inCarousel && e.status === 'Published')
    .sort((a, b) => (a.carouselOrder || 99) - (b.carouselOrder || 99));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    if (carouselEvents.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % carouselEvents.length);
  }, [carouselEvents.length]);

  const prevSlide = useCallback(() => {
    if (carouselEvents.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + carouselEvents.length) % carouselEvents.length);
  }, [carouselEvents.length]);

  useEffect(() => {
    if (carouselEvents.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [carouselEvents.length, isPaused, nextSlide]);

  if (carouselEvents.length === 0) {
    return <HeroBannerEmptyState onExploreClick={onExploreAll} />;
  }

  const currentEvent = carouselEvents[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden rounded-[28px] lg:rounded-[36px] bg-[#16212F] shadow-xl border border-[#E2E8F0]/30 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] w-full flex flex-col justify-between">
        
        {/* Background Image & Editorial Overlay */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentEvent.id}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 pointer-events-none"
          >
            <img
              src={currentEvent.bannerUrl}
              alt={currentEvent.title}
              className="w-full h-full object-cover object-center"
            />

            {/* Editorial Multi-stop Vignette matching reference */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#16212F] via-[#16212F]/65 to-[#16212F]/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#16212F]/90 via-[#16212F]/50 to-transparent" />

            {/* Giant Architectural Watermark Typography ("CHRIST" or "SWO") like Oxford reference */}
            <div className="absolute top-6 left-8 right-8 overflow-hidden pointer-events-none select-none flex justify-center opacity-25">
              <span className="font-serif tracking-widest text-white text-[12vw] font-bold uppercase leading-none whitespace-nowrap drop-shadow-sm">
                CHRIST
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Top bar over the hero */}
        <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] font-bold tracking-widest uppercase border border-white/20">
              2025–2026 ACADEMIC YEAR
            </span>
            <span className="hidden md:inline-block text-white/70 text-xs">
              Bangalore Yeshwanthpur Campus
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs">
            <span className="font-bold text-[#C5A063]">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="text-white/40">/</span>
            <span className="text-white/70">{String(carouselEvents.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Center / Bottom Content */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEvent.id + '_body'}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {/* Category & Badge */}
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C5A063] text-white shadow-xs">
                  {currentEvent.category}
                </span>

                <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium border border-white/20">
                  {currentEvent.organizingCommittee}
                </span>

                {currentEvent.speaker && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs text-white/90">
                    Chief Guest: <strong className="text-white">{currentEvent.speaker.name}</strong>
                  </span>
                )}
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.12] line-clamp-2">
                {currentEvent.title}
              </h2>

              <p className="mt-3 text-sm sm:text-base text-slate-200 line-clamp-2 leading-relaxed max-w-2xl font-light">
                {currentEvent.subtitle || currentEvent.description}
              </p>

              {/* Metadata */}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/90">
                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A063]" />
                  {new Date(currentEvent.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  • {currentEvent.time}
                </span>

                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-rose-300" />
                  {currentEvent.venue}
                </span>
              </div>

              {/* Action Buttons styled according to reference and SWO logo */}
              <div className="mt-6 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => onSelectEvent(currentEvent)}
                  className="bg-white text-[#16212F] hover:bg-[#F8FAFC] px-7 py-3 rounded-full font-bold text-sm shadow-md transition-all duration-200 flex items-center gap-2 active:scale-95"
                >
                  <span>Register for Event</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onExploreAll}
                  className="bg-[#3A5982]/80 hover:bg-[#3A5982] text-white px-6 py-3 rounded-full font-semibold text-sm backdrop-blur-md border border-white/20 transition-all duration-200 flex items-center gap-2 active:scale-95"
                >
                  <span>View All Schedule</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Bar: Editorial Description & Minimalist Arrows matching Oxford reference */}
        <div className="relative z-10 px-6 sm:px-10 py-4 border-t border-white/10 bg-black/25 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/70">
          <p className="line-clamp-1 max-w-xl text-white/80">
            Student Welfare Office • Empowering holistic student potential, cultural leadership & wellness.
          </p>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center border border-white/20 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center border border-white/20 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

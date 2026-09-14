import React, { useState, useMemo, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import { HeroSlide, HeroConfig } from '../../types';
import { PRESET_HERO_IMAGES, PresetHeroImage } from '../../data/heroData';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit3,
  MoveUp,
  MoveDown,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  Sliders,
  Eye,
  EyeOff,
  Upload,
  Link as LinkIcon,
  Layers,
  Clock,
  Maximize2,
  Check,
  X,
  Play,
  Pause,
  Monitor,
  Tablet,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  ArrowUpToLine,
  ArrowDownToLine,
  Copy,
  Search,
  Filter,
  Palette,
  ExternalLink,
  ShieldCheck,
  CheckSquare,
  Square,
  Flame,
  CloudUpload,
  Database,
  Loader2,
  Save,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { compressImageFile } from '../../utils/imageCompression';

type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

export const ERPHeroManager: React.FC = () => {
  const {
    heroSlides,
    heroConfig,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    reorderHeroSlides,
    updateHeroConfig,
    resetHeroToDefault,
    syncHeroSlidesFromRepo,
    syncHeroToDatabase,
    isFirebaseConnected,
  } = useERP();

  // Active modal state
  const [isSlideModalOpen, setIsSlideModalOpen] = useState<boolean>(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  // Live database manual push state
  const [isSyncingLive, setIsSyncingLive] = useState<boolean>(false);

  // Quick feedback alert
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleSyncToDatabase = async () => {
    setIsSyncingLive(true);
    try {
      const result = await syncHeroToDatabase();
      if (result.success) {
        showFeedback(
          `✓ Live database updated: ${result.count} hero slides and global banner settings synced to production Firestore database uniformly.`
        );
      } else {
        alert(result.error || 'Failed to sync hero slides with database.');
      }
    } catch (e: any) {
      alert(e?.message || 'Error syncing hero slides with database.');
    } finally {
      setIsSyncingLive(false);
    }
  };

  // Preview simulator state
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [previewPaused, setPreviewPaused] = useState<boolean>(false);

  // Slide search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft'>('all');

  // Active settings tab or accordion
  const [settingsSection, setSettingsSection] = useState<'playback' | 'framing' | 'content' | 'themes'>('playback');

  // Slides sorted by order
  const sortedSlides = useMemo(() => {
    return [...heroSlides].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [heroSlides]);

  const activeSlides = useMemo(() => {
    return sortedSlides.filter((s) => s.isActive !== false);
  }, [sortedSlides]);

  // Filtered slides for list
  const filteredSlides = useMemo(() => {
    return sortedSlides.filter((slide) => {
      const matchesSearch =
        slide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (slide.subtitle && slide.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (slide.badge && slide.badge.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && slide.isActive !== false) ||
        (filterStatus === 'draft' && slide.isActive === false);

      return matchesSearch && matchesStatus;
    });
  }, [sortedSlides, searchQuery, filterStatus]);

  // Handle reordering
  const handleMoveUp = (currentIndex: number) => {
    if (currentIndex === 0) return;
    const newSlides = [...sortedSlides];
    const temp = newSlides[currentIndex - 1];
    newSlides[currentIndex - 1] = newSlides[currentIndex];
    newSlides[currentIndex] = temp;
    reorderHeroSlides(newSlides);
    showFeedback('Slide priority order updated.');
  };

  const handleMoveDown = (currentIndex: number) => {
    if (currentIndex === sortedSlides.length - 1) return;
    const newSlides = [...sortedSlides];
    const temp = newSlides[currentIndex + 1];
    newSlides[currentIndex + 1] = newSlides[currentIndex];
    newSlides[currentIndex] = temp;
    reorderHeroSlides(newSlides);
    showFeedback('Slide priority order updated.');
  };

  const handleJumpToTop = (currentIndex: number) => {
    if (currentIndex === 0) return;
    const target = sortedSlides[currentIndex];
    const remaining = sortedSlides.filter((_, idx) => idx !== currentIndex);
    const newSlides = [target, ...remaining];
    reorderHeroSlides(newSlides);
    showFeedback(`Moved "${target.title}" to position #1.`);
  };

  const handleJumpToBottom = (currentIndex: number) => {
    if (currentIndex === sortedSlides.length - 1) return;
    const target = sortedSlides[currentIndex];
    const remaining = sortedSlides.filter((_, idx) => idx !== currentIndex);
    const newSlides = [...remaining, target];
    reorderHeroSlides(newSlides);
    showFeedback(`Moved "${target.title}" to bottom position.`);
  };

  const handleToggleActive = (slide: HeroSlide) => {
    const nextState = !slide.isActive;
    updateHeroSlide(slide.id, { isActive: nextState });
    showFeedback(`Slide "${slide.title}" is now ${nextState ? 'Active on Storefront' : 'Draft / Hidden'}.`);
  };

  const handleDelete = (slide: HeroSlide) => {
    if (heroSlides.length <= 1) {
      alert('You must maintain at least one hero banner slide.');
      return;
    }
    if (confirm(`Are you sure you want to delete the slide "${slide.title}"?`)) {
      deleteHeroSlide(slide.id);
      showFeedback('Slide deleted successfully.');
    }
  };

  const handleDuplicate = (slide: HeroSlide) => {
    const newOrder = sortedSlides.length;
    addHeroSlide({
      src: slide.src,
      title: `${slide.title} (Copy)`,
      subtitle: slide.subtitle,
      badge: slide.badge,
      alt: slide.alt,
      isActive: false, // Save copy as draft
      order: newOrder,
    });
    showFeedback(`Cloned "${slide.title}" as Draft (#${newOrder + 1}).`);
  };

  const handleOpenAdd = () => {
    setEditingSlide(null);
    setIsSlideModalOpen(true);
  };

  const handleOpenEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setIsSlideModalOpen(true);
  };

  const handleReset = () => {
    if (confirm('Reset hero slides and configurations to factory demonstration defaults?')) {
      resetHeroToDefault();
      showFeedback('Hero reset to factory default slides.');
    }
  };

  const handleSyncRepo = () => {
    syncHeroSlidesFromRepo();
    showFeedback('Successfully imported and synchronized hero images from repository.');
  };

  // Quick preset themes
  const handleApplyTheme = (themeName: 'atelier' | 'school' | 'industrial' | 'medical') => {
    if (themeName === 'atelier') {
      const atelierPresets = PRESET_HERO_IMAGES.filter(
        (p) => p.category === 'Panoramic' || p.category === 'Showroom' || p.category === 'Workshop'
      );
      const newDeck = atelierPresets.map((p, idx) => ({
        id: `hero-theme-atelier-${idx + 1}`,
        src: p.src,
        title: p.name,
        subtitle: 'Premier Bespoke Garment Manufacturer & Tailoring Atelier in Kenya',
        badge: 'Kenyan Factory & Atelier',
        alt: p.name,
        isActive: true,
        order: idx,
      }));
      reorderHeroSlides(newDeck);
      showFeedback('Applied "Master Atelier & Tailoring" theme deck.');
    } else if (themeName === 'school') {
      const schoolPresets = PRESET_HERO_IMAGES.filter((p) => p.category === 'School');
      const newDeck = schoolPresets.map((p, idx) => ({
        id: `hero-theme-school-${idx + 1}`,
        src: p.src,
        title: p.name,
        subtitle: 'Premium Institutional & Academy Uniforms with Custom Crest Embroidery',
        badge: 'Academy & Institutional Uniforms',
        alt: p.name,
        isActive: true,
        order: idx,
      }));
      reorderHeroSlides(newDeck);
      showFeedback('Applied "School & Academy Uniforms" theme deck.');
    } else if (themeName === 'industrial') {
      const safetyPresets = PRESET_HERO_IMAGES.filter((p) => p.category === 'Safety & Industrial');
      const newDeck = safetyPresets.map((p, idx) => ({
        id: `hero-theme-safety-${idx + 1}`,
        src: p.src,
        title: p.name,
        subtitle: 'Commercial Heavy-Duty Workwear & High-Visibility Protective Gear',
        badge: 'Industrial Safety & Workwear',
        alt: p.name,
        isActive: true,
        order: idx,
      }));
      reorderHeroSlides(newDeck);
      showFeedback('Applied "Industrial Safety & Workwear" theme deck.');
    } else if (themeName === 'medical') {
      const medPresets = PRESET_HERO_IMAGES.filter(
        (p) => p.category === 'Healthcare' || p.category === 'Hospitality'
      );
      const newDeck = medPresets.map((p, idx) => ({
        id: `hero-theme-med-${idx + 1}`,
        src: p.src,
        title: p.name,
        subtitle: 'Clinical Healthcare Scrubs & Professional Service Uniforms',
        badge: 'Healthcare & Hospitality Apparel',
        alt: p.name,
        isActive: true,
        order: idx,
      }));
      reorderHeroSlides(newDeck);
      showFeedback('Applied "Healthcare & Clinical Apparel" theme deck.');
    }
  };

  const currentPreviewSlide = activeSlides[previewIndex % (activeSlides.length || 1)] || sortedSlides[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#06163c]">
              <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
              <span>Storefront Visual Architecture & Carousel Engine</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Database Sync Active ({activeSlides.length} Live on Storefront)</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-['Outfit']">
            Homepage Hero Banners & Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Configure dynamic hero slides, display order, auto-rotation timings, curved wave edges, and storefront caption overlays. All modifications synchronize live with the production database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            disabled={isSyncingLive}
            onClick={handleSyncToDatabase}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-sm border border-emerald-700 transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Push all hero slides and configurations immediately to production Firestore database"
          >
            {isSyncingLive ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-200" />
            ) : (
              <CloudUpload className="w-3.5 h-3.5 text-emerald-200" />
            )}
            <span>{isSyncingLive ? 'Syncing to DB...' : 'Sync Live to Database'}</span>
          </button>

          <button
            type="button"
            onClick={handleSyncRepo}
            className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer border border-blue-200 shadow-xs"
            title="Import and synchronize hero slides with latest repository assets"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            <span>Sync Repo Assets</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer border border-slate-200"
            title="Reset to factory demonstration slides"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-[#06163c] hover:bg-blue-950 text-white text-xs font-black rounded-xl shadow-md border border-blue-900 transition-all inline-flex items-center gap-2 cursor-pointer hover:shadow-lg active:scale-98"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            <span>+ Add Banner Slide</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-md"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMessage}</span>
        </motion.div>
      )}

      {/* 2. Real-Time Interactive Storefront Simulator */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Live Storefront Banner Simulator
              </h2>
              <p className="text-[11px] text-slate-500">
                Interactive preview reflecting actual storefront dimensions, overlay captions, and wave curves.
              </p>
            </div>
          </div>

          {/* Device Frame Switcher & Slide Status Pill */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* Device Switcher */}
            <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  previewDevice === 'desktop'
                    ? 'bg-white text-[#06163c] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  previewDevice === 'tablet'
                    ? 'bg-white text-[#06163c] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  previewDevice === 'mobile'
                    ? 'bg-white text-[#06163c] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            <span className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl font-bold text-xs text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {activeSlides.length} Live on Storefront
            </span>
          </div>
        </div>

        {/* Outer Device Mockup Container */}
        <div className="flex justify-center bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200/80">
          <div
            className={`transition-all duration-300 w-full overflow-hidden ${
              previewDevice === 'desktop'
                ? 'max-w-full'
                : previewDevice === 'tablet'
                ? 'max-w-2xl'
                : 'max-w-sm'
            }`}
          >
            {/* Live Banner Frame */}
            <div
              className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 shadow-xl border border-slate-300 group select-none ${
                heroConfig.heightPreset === 'compact'
                  ? 'h-64 sm:h-72'
                  : heroConfig.heightPreset === 'tall'
                  ? 'h-80 sm:h-96'
                  : 'h-72 sm:h-84'
              }`}
            >
              {currentPreviewSlide ? (
                <>
                  {/* Banner Image */}
                  <img
                    key={currentPreviewSlide.id}
                    src={currentPreviewSlide.src}
                    alt={currentPreviewSlide.alt || currentPreviewSlide.title}
                    className="w-full h-full object-cover object-center transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 ${
                      heroConfig.showOverlayText
                        ? 'bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent'
                        : 'bg-gradient-to-b from-white/60 via-white/10 to-transparent'
                    }`}
                  />

                  {/* Optional Text Caption Overlay */}
                  {heroConfig.showOverlayText && (
                    <div
                      className={`absolute inset-0 z-15 flex flex-col justify-center px-6 sm:px-10 pointer-events-none ${
                        heroConfig.textAlignment === 'center'
                          ? 'items-center text-center'
                          : 'items-start text-left'
                      }`}
                    >
                      <div className="max-w-md">
                        {heroConfig.showBadges !== false && currentPreviewSlide.badge && (
                          <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-md text-[10px] font-extrabold uppercase tracking-widest mb-1.5 shadow-xs">
                            {currentPreviewSlide.badge}
                          </span>
                        )}
                        <h3 className="text-white font-black text-base sm:text-xl md:text-2xl leading-tight drop-shadow-md font-['Outfit']">
                          {currentPreviewSlide.title}
                        </h3>
                        {currentPreviewSlide.subtitle && (
                          <p className="text-slate-200 text-xs sm:text-sm mt-1 drop-shadow line-clamp-2">
                            {currentPreviewSlide.subtitle}
                          </p>
                        )}
                        {heroConfig.showActionButtons && (
                          <div
                            className={`flex items-center gap-2 mt-3 pointer-events-auto ${
                              heroConfig.textAlignment === 'center' ? 'justify-center' : 'justify-start'
                            }`}
                          >
                            <span className="px-3 py-1 rounded-lg bg-[#06163c] text-white text-[11px] font-bold shadow-md">
                              Explore Catalog
                            </span>
                            <span className="px-3 py-1 rounded-lg bg-white/90 text-slate-900 text-[11px] font-bold shadow-md">
                              Request Quote
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bottom Navigation & Controls Dock inside preview */}
                  <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-xs">
                    <button
                      type="button"
                      onClick={() => setPreviewPaused(!previewPaused)}
                      className="hover:text-sky-300 p-0.5 cursor-pointer transition-colors"
                      title={previewPaused ? 'Resume slideshow rotation' : 'Pause rotation'}
                    >
                      {previewPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    </button>

                    <div className="h-3 w-px bg-white/25" />

                    <div className="flex items-center gap-1">
                      {activeSlides.map((s, idx) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setPreviewIndex(idx)}
                          className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                            previewIndex % activeSlides.length === idx
                              ? 'bg-sky-400 w-5 shadow-sm'
                              : 'bg-white/40 hover:bg-white/70 w-2'
                          }`}
                          title={`Slide ${idx + 1}: ${s.title}`}
                        />
                      ))}
                    </div>

                    <span className="text-[10px] font-mono text-slate-300 ml-1">
                      {(previewIndex % (activeSlides.length || 1)) + 1}/{activeSlides.length}
                    </span>
                  </div>

                  {/* Left & Right Steppers in simulator */}
                  {activeSlides.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewIndex((prev) => (prev > 0 ? prev - 1 : activeSlides.length - 1))
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm cursor-pointer transition-all"
                        title="Previous slide"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewIndex((prev) => (prev + 1) % activeSlides.length)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm cursor-pointer transition-all"
                        title="Next slide"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Bottom Wave Divider in simulator */}
                  {heroConfig.showWaveDivider && (
                    <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10">
                      <svg
                        className="relative block w-full h-6 sm:h-9"
                        viewBox="0 0 1440 80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0,30 C500,80 940,-10 1440,45 L1440,80 L0,80 Z"
                          fill="#FFFFFF"
                        />
                      </svg>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white p-6 text-center">
                  <EyeOff className="w-8 h-8 text-slate-500 mb-2" />
                  <p className="font-bold text-sm">All slides are currently set to Draft / Hidden.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Enable at least one slide below to activate the storefront carousel.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Global Banner Settings Panel ("In Order" Structure) */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Banner Configuration Controls (Structured In Order)
              </h2>
              <p className="text-[11px] text-slate-500">
                Organized settings categories to tune slideshow rotation, height geometry, and overlay content.
              </p>
            </div>
          </div>

          {/* Section Selector Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            {[
              { id: 'playback', label: '1. Playback & Timing', icon: Clock },
              { id: 'framing', label: '2. Height & Wave Edge', icon: Maximize2 },
              { id: 'content', label: '3. Text & Captions', icon: Sparkles },
              { id: 'themes', label: '4. Curated Presets', icon: Palette },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSettingsSection(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    settingsSection === tab.id
                      ? 'bg-white text-[#06163c] shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 1: PLAYBACK & TIMING */}
        {settingsSection === 'playback' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Auto-Play Toggle */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-slate-900 text-sm">Slide Auto-Rotation</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      heroConfig.autoPlay
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {heroConfig.autoPlay ? 'Active' : 'Paused'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Automatically advance through active banner slides on the customer storefront.
                </p>
              </div>

              <button
                type="button"
                onClick={() => updateHeroConfig({ autoPlay: !heroConfig.autoPlay })}
                className={`w-full py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  heroConfig.autoPlay
                    ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {heroConfig.autoPlay ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                <span>{heroConfig.autoPlay ? 'Auto-Play Enabled' : 'Auto-Play Paused'}</span>
              </button>
            </div>

            {/* Rotation Interval / Speed */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-4">
              <div>
                <span className="font-extrabold text-slate-900 text-sm block mb-1">
                  Slide Rotation Interval
                </span>
                <p className="text-[11px] text-slate-500 mb-3">
                  How long each banner slide stays visible before transitioning to the next.
                </p>

                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { ms: 3500, label: '3.5s Fast' },
                    { ms: 5500, label: '5.5s Recommended' },
                    { ms: 7500, label: '7.5s Relaxed' },
                    { ms: 10000, label: '10s Cinematic' },
                  ].map((preset) => (
                    <button
                      key={preset.ms}
                      type="button"
                      onClick={() => updateHeroConfig({ autoPlayIntervalMs: preset.ms })}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                        heroConfig.autoPlayIntervalMs === preset.ms
                          ? 'bg-[#06163c] text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-mono text-center">
                Current: {(heroConfig.autoPlayIntervalMs / 1000).toFixed(1)} seconds per slide
              </div>
            </div>

            {/* Pause on Hover */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-slate-900 text-sm">Pause On Mouse Hover</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      heroConfig.pauseOnHover !== false
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {heroConfig.pauseOnHover !== false ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Allows customers to hover over the hero banner to pause the timer and read text comfortably.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  updateHeroConfig({ pauseOnHover: !(heroConfig.pauseOnHover !== false) })
                }
                className={`w-full py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  heroConfig.pauseOnHover !== false
                    ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {heroConfig.pauseOnHover !== false ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                <span>{heroConfig.pauseOnHover !== false ? 'Pause on Hover Active' : 'Never Pause'}</span>
              </button>
            </div>
          </div>
        )}

        {/* SECTION 2: HEIGHT & WAVE GEOMETRY */}
        {settingsSection === 'framing' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Height Preset */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-4">
              <div>
                <span className="font-extrabold text-slate-900 text-sm block mb-1">
                  Banner Vertical Height
                </span>
                <p className="text-[11px] text-slate-500 mb-3">
                  Controls the responsive desktop & laptop display viewport height of the banner.
                </p>

                <div className="space-y-2">
                  {[
                    { id: 'compact', label: 'Compact (~380px)', desc: 'Quick scan, catalog appears higher' },
                    { id: 'standard', label: 'Standard (~480px)', desc: 'Balanced commercial proportion' },
                    { id: 'tall', label: 'Cinematic Tall (~560px)', desc: 'Full dramatic photography immersion' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => updateHeroConfig({ heightPreset: preset.id as any })}
                      className={`w-full p-2.5 rounded-xl text-left border transition-all ${
                        heroConfig.heightPreset === preset.id
                          ? 'bg-white border-[#06163c] ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <span className="font-bold text-slate-900 block text-xs">{preset.label}</span>
                      <span className="text-[10px] text-slate-500">{preset.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Wave Divider */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-slate-900 text-sm">Curved Wave Edge Divider</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      heroConfig.showWaveDivider
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {heroConfig.showWaveDivider ? 'Curved' : 'Flat'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  A seamless single curved wave edge blending the banner smoothly into the white catalog background.
                </p>
              </div>

              <button
                type="button"
                onClick={() => updateHeroConfig({ showWaveDivider: !heroConfig.showWaveDivider })}
                className={`w-full py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  heroConfig.showWaveDivider
                    ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {heroConfig.showWaveDivider ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                <span>{heroConfig.showWaveDivider ? 'Curved Wave Active' : 'Flat Straight Edge'}</span>
              </button>
            </div>

            {/* Background Overlay Tint */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-4">
              <div>
                <span className="font-extrabold text-slate-900 text-sm block mb-1">
                  Contrast Gradient Overlay
                </span>
                <p className="text-[11px] text-slate-500">
                  Subtle gradient overlay ensuring maximum photographic depth and clear brand visual contrast.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-600">
                Automatically adapts based on whether headline text captions are enabled.
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: TEXT & CAPTIONS */}
        {settingsSection === 'content' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Show Overlay Text */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-4">
              <div>
                <span className="font-extrabold text-slate-900 text-sm block mb-1">
                  Storefront Text Caption
                </span>
                <p className="text-[11px] text-slate-500">
                  Display slide titles, descriptions, and badges directly on top of the storefront hero banner.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  updateHeroConfig({ showOverlayText: !heroConfig.showOverlayText })
                }
                className={`w-full py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  heroConfig.showOverlayText
                    ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {heroConfig.showOverlayText ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                <span>{heroConfig.showOverlayText ? 'Captions Displayed' : 'Pure Image Only'}</span>
              </button>
            </div>

            {/* Text Alignment */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-4">
              <div>
                <span className="font-extrabold text-slate-900 text-sm block mb-1">
                  Text Alignment
                </span>
                <p className="text-[11px] text-slate-500 mb-2">
                  Positioning of headline text across desktop and mobile screens.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateHeroConfig({ textAlignment: 'left' })}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                    heroConfig.textAlignment !== 'center'
                      ? 'bg-[#06163c] text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Left-Aligned
                </button>
                <button
                  type="button"
                  onClick={() => updateHeroConfig({ textAlignment: 'center' })}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                    heroConfig.textAlignment === 'center'
                      ? 'bg-[#06163c] text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Centered
                </button>
              </div>
            </div>

            {/* Show Badge Pills */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-4">
              <div>
                <span className="font-extrabold text-slate-900 text-sm block mb-1">
                  Show Ribbon Badges
                </span>
                <p className="text-[11px] text-slate-500">
                  E.g. "Kenyan Factory & Atelier", "Production Excellence" pills.
                </p>
              </div>

              <button
                type="button"
                onClick={() => updateHeroConfig({ showBadges: !(heroConfig.showBadges !== false) })}
                className={`w-full py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  heroConfig.showBadges !== false
                    ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {heroConfig.showBadges !== false ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                <span>{heroConfig.showBadges !== false ? 'Badges Visible' : 'Hidden'}</span>
              </button>
            </div>

            {/* Direct CTA Action Buttons */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-4">
              <div>
                <span className="font-extrabold text-slate-900 text-sm block mb-1">
                  Hero CTA Action Buttons
                </span>
                <p className="text-[11px] text-slate-500">
                  "Explore Catalog" & "Request Quote" buttons overlaid on the banner.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  updateHeroConfig({ showActionButtons: !heroConfig.showActionButtons })
                }
                className={`w-full py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  heroConfig.showActionButtons
                    ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {heroConfig.showActionButtons ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                <span>{heroConfig.showActionButtons ? 'CTA Buttons Visible' : 'Buttons Hidden'}</span>
              </button>
            </div>
          </div>
        )}

        {/* SECTION 4: CURATED PRESETS */}
        {settingsSection === 'themes' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Apply factory-curated slide collections with photography from the NASISI garment archive.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  id: 'atelier',
                  title: '1. Master Atelier & Workshop',
                  desc: 'Showroom, cutting tables, embroidery machines & atelier panoramic',
                  count: '4 Slides',
                  badge: 'Industrial Manufacturing',
                },
                {
                  id: 'school',
                  title: '2. Institutional & School Uniforms',
                  desc: 'Academic blazers, V-neck knitwear, sports tracksuits & pique polos',
                  count: '4 Slides',
                  badge: 'Education & Academies',
                },
                {
                  id: 'industrial',
                  title: '3. Heavy-Duty Safety & Workwear',
                  desc: 'Reinforced overalls, high-visibility reflective vests & field workwear',
                  count: '2 Slides',
                  badge: 'Safety & Industrial',
                },
                {
                  id: 'medical',
                  title: '4. Healthcare & Hospitality',
                  desc: 'Clinical scrub sets, chef jackets, barista aprons & service polo shirts',
                  count: '3 Slides',
                  badge: 'Medical & Service',
                },
              ].map((theme) => (
                <div
                  key={theme.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between gap-3 hover:border-blue-300 transition-colors"
                >
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-900 mb-2 inline-block">
                      {theme.badge}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900">{theme.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-1">{theme.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyTheme(theme.id as any)}
                    className="w-full py-2 px-3 bg-[#06163c] hover:bg-blue-900 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Apply Theme Deck ({theme.count})
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Slide Deck Management & Ordering ("Put It In Order") */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Slide Deck Sequencing & Order Management ({sortedSlides.length} Slides)
              </h2>
              <p className="text-[11px] text-slate-500">
                Manage display priority, reposition slides, preview angles, and toggle storefront visibility.
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search slides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none w-44"
              />
            </div>

            <div className="flex p-0.5 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterStatus === 'all'
                    ? 'bg-white text-[#06163c] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All ({sortedSlides.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('active')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterStatus === 'active'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Live ({activeSlides.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('draft')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterStatus === 'draft'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Draft ({sortedSlides.length - activeSlides.length})
              </button>
            </div>
          </div>
        </div>

        {/* Slides List with Ordered Rows */}
        <div className="space-y-3">
          {filteredSlides.length > 0 ? (
            filteredSlides.map((slide, displayIndex) => {
              const actualOrderIndex = sortedSlides.findIndex((s) => s.id === slide.id);
              const isFirst = actualOrderIndex === 0;
              const isLast = actualOrderIndex === sortedSlides.length - 1;

              return (
                <div
                  key={slide.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
                    slide.isActive !== false
                      ? 'bg-white border-slate-200 shadow-xs hover:border-blue-400'
                      : 'bg-slate-50/70 border-dashed border-slate-300 opacity-75'
                  }`}
                >
                  {/* Left: Sequence Tag + Thumbnail + Info */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Order Sequence Badge */}
                    <div className="flex flex-col items-center shrink-0">
                      <span className="w-8 h-8 rounded-xl bg-[#06163c] text-white font-black text-xs flex items-center justify-center shadow-xs">
                        #{actualOrderIndex + 1}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Order</span>
                    </div>

                    {/* Thumbnail */}
                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 relative group shadow-xs">
                      <img
                        src={slide.src}
                        alt={slide.alt || slide.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {!slide.isActive && (
                        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center text-[9px] font-black text-white uppercase tracking-wider">
                          Draft
                        </div>
                      )}
                    </div>

                    {/* Meta details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            slide.isActive !== false
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {slide.isActive !== false ? '✓ Live on Storefront' : 'Hidden / Draft'}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 text-[10px] font-bold">
                          {slide.badge || 'Showroom & Atelier'}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base truncate">
                        {slide.title}
                      </h3>

                      <p className="text-xs text-slate-500 truncate max-w-xl mt-0.5">
                        {slide.subtitle || 'No subtitle provided'}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions: Reordering + Quick Actions */}
                  <div className="flex items-center gap-1.5 self-end lg:self-center shrink-0 flex-wrap">
                    {/* Preview in Simulator */}
                    <button
                      type="button"
                      onClick={() => {
                        const activeIdx = activeSlides.findIndex((s) => s.id === slide.id);
                        if (activeIdx !== -1) {
                          setPreviewIndex(activeIdx);
                        } else {
                          // Jump to this slide directly
                          setPreviewIndex(0);
                        }
                        showFeedback(`Simulating "${slide.title}" in preview frame.`);
                        window.scrollTo({ top: 180, behavior: 'smooth' });
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-800 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer border border-slate-200"
                      title="Preview this banner in the simulator above"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>Preview</span>
                    </button>

                    <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

                    {/* Jump to top */}
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => handleJumpToTop(actualOrderIndex)}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                      title="Jump to position #1 (Top)"
                    >
                      <ArrowUpToLine className="w-4 h-4" />
                    </button>

                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => handleMoveUp(actualOrderIndex)}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                      title="Move up one position"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => handleMoveDown(actualOrderIndex)}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                      title="Move down one position"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>

                    {/* Jump to bottom */}
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => handleJumpToBottom(actualOrderIndex)}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                      title="Jump to last position"
                    >
                      <ArrowDownToLine className="w-4 h-4" />
                    </button>

                    <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

                    {/* Toggle Active */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(slide)}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        slide.isActive !== false
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-slate-400 hover:bg-slate-200'
                      }`}
                      title={
                        slide.isActive !== false
                          ? 'Slide is active (Click to hide from storefront)'
                          : 'Slide is draft (Click to publish on storefront)'
                      }
                    >
                      {slide.isActive !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Clone / Duplicate */}
                    <button
                      type="button"
                      onClick={() => handleDuplicate(slide)}
                      className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Duplicate slide"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(slide)}
                      className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Edit slide details and photo"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(slide)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
              No slides match your search query or filter.
            </div>
          )}
        </div>
      </div>

      {/* 5. Add / Edit Slide Modal */}
      {isSlideModalOpen && (
        <ERPEditHeroSlideModal
          slide={editingSlide}
          onClose={() => setIsSlideModalOpen(false)}
          onSave={(slideData) => {
            if (editingSlide) {
              updateHeroSlide(editingSlide.id, slideData);
              showFeedback(`Updated slide "${slideData.title}".`);
            } else {
              addHeroSlide({
                ...slideData,
                isActive: true,
                order: heroSlides.length,
              });
              showFeedback(`Added new slide "${slideData.title}".`);
            }
            setIsSlideModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

/* =========================================================================
   SUB-COMPONENT: Enhanced Slide Editor Modal
   ========================================================================= */

interface ERPEditHeroSlideModalProps {
  slide: HeroSlide | null;
  onClose: () => void;
  onSave: (slideData: Omit<HeroSlide, 'id' | 'order'>) => void;
}

const ERPEditHeroSlideModal: React.FC<ERPEditHeroSlideModalProps> = ({
  slide,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(slide?.title || '');
  const [subtitle, setSubtitle] = useState(slide?.subtitle || '');
  const [badge, setBadge] = useState(slide?.badge || 'Showroom & Atelier');
  const [alt, setAlt] = useState(slide?.alt || '');
  const [src, setSrc] = useState(slide?.src || PRESET_HERO_IMAGES[0].src);
  const [isActive, setIsActive] = useState(slide ? slide.isActive !== false : true);

  // Tab for image source: 'presets' | 'upload' | 'url'
  const [imageTab, setImageTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [presetCategory, setPresetCategory] = useState<string>('all');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }

    try {
      setIsCompressing(true);
      const compressedUrl = await compressImageFile(file, {
        maxDimension: 1920,
        quality: 0.82,
        format: 'image/jpeg',
      });
      setSrc(compressedUrl);
    } catch (err) {
      console.warn('Fallback to standard file reader:', err);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setSrc(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleApplyUrl = () => {
    if (!customUrlInput.trim()) return;
    setSrc(customUrlInput.trim());
  };

  const filteredPresetImages = useMemo(() => {
    if (presetCategory === 'all') return PRESET_HERO_IMAGES;
    return PRESET_HERO_IMAGES.filter((p) => p.category.toLowerCase().includes(presetCategory.toLowerCase()));
  }, [presetCategory]);

  const executeSave = () => {
    if (!title.trim()) {
      alert('Slide headline / title is required.');
      return;
    }
    if (!src) {
      alert('An image is required for the banner slide.');
      return;
    }

    onSave({
      title: title.trim(),
      subtitle: subtitle.trim(),
      badge: badge.trim(),
      alt: alt.trim() || title.trim(),
      src,
      isActive,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSave();
  };

  // Keyboard shortcut: Ctrl+S / Cmd+S to save, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        executeSave();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [title, subtitle, badge, alt, src, isActive]);

  return (
    <div className="fixed inset-0 z-[100000] overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Sticky Modal Header with Top-Right Save Button */}
        <div className="sticky top-0 z-30 bg-[#06163c] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-blue-950 shadow-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5 text-sky-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base font-['Outfit'] truncate">
                  {slide ? `Edit Banner: ${slide.title}` : 'Create New Hero Banner Slide'}
                </h3>
                <span
                  className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-700 text-slate-300 border border-slate-600'
                  }`}
                >
                  {isActive ? 'Active' : 'Draft'}
                </span>
              </div>
              <p className="text-[11px] text-blue-200 truncate hidden sm:block">
                Configure high-resolution photography, headline typography, and storefront visibility.
              </p>
            </div>
          </div>

          {/* Top-Right Actions (Save + Close) */}
          <div className="flex items-center gap-2.5 shrink-0 ml-3">
            <button
              type="button"
              onClick={executeSave}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black rounded-xl shadow-md hover:shadow-emerald-500/20 transition-all flex items-center gap-1.5 text-xs cursor-pointer border border-emerald-300 active:scale-95"
              title="Save banner slide (Ctrl+S / Cmd+S)"
            >
              <Save className="w-4 h-4" />
              <span>{slide ? 'Save Changes' : 'Save Banner'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close window (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Form Body */}
        <form
          id="hero-slide-editor-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-800"
        >
          {/* Real-time preview card */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Live Storefront Card Preview
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Aspect ratio: 16:9 / Recommended 1920×800
              </span>
            </div>
            <div className="relative h-48 sm:h-60 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner group">
              <img
                src={src}
                alt={title || 'Preview'}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

              <div className="absolute top-3 right-3">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border backdrop-blur-md ${
                    isActive
                      ? 'bg-emerald-500/90 text-white border-emerald-400/50'
                      : 'bg-slate-900/80 text-slate-300 border-slate-700'
                  }`}
                >
                  {isActive ? '✓ Storefront Active' : 'Hidden Draft'}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md rounded text-[10px] font-extrabold uppercase mb-1.5 border border-white/20">
                  {badge || 'Showroom & Atelier'}
                </span>
                <h4 className="font-black text-lg sm:text-xl leading-tight line-clamp-1 drop-shadow-md">
                  {title || 'Slide Title Preview'}
                </h4>
                <p className="text-xs text-slate-200 line-clamp-1 mt-0.5 drop-shadow">
                  {subtitle || 'Subtitle description preview text'}
                </p>
              </div>
            </div>
          </div>

          {/* 1. Image Selection Tabs */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
              <label className="font-bold text-slate-800 uppercase tracking-wider text-xs flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>Banner Photography Source *</span>
              </label>

              <div className="inline-flex p-0.5 bg-slate-200/80 rounded-xl text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setImageTab('presets')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    imageTab === 'presets'
                      ? 'bg-white text-[#06163c] shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Factory Presets ({PRESET_HERO_IMAGES.length})
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    imageTab === 'upload'
                      ? 'bg-white text-[#06163c] shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    imageTab === 'url'
                      ? 'bg-white text-[#06163c] shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Direct Web URL
                </button>
              </div>
            </div>

            {/* Presets Grid */}
            {imageTab === 'presets' && (
              <div className="space-y-2">
                {/* Category filter pills */}
                <div className="flex flex-wrap gap-1">
                  {['all', 'Panoramic', 'Showroom', 'School', 'Safety', 'Healthcare', 'Hospitality'].map(
                    (cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setPresetCategory(cat)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                          presetCategory === cat
                            ? 'bg-[#06163c] text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-52 overflow-y-auto p-1">
                  {filteredPresetImages.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSrc(preset.src)}
                      className={`relative h-24 rounded-xl overflow-hidden border-2 text-left group cursor-pointer transition-all ${
                        src === preset.src
                          ? 'border-blue-600 ring-2 ring-blue-500/30 shadow-md'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={preset.src}
                        alt={preset.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-end">
                        <span className="text-[10px] text-white font-bold truncate">
                          {preset.name}
                        </span>
                        <span className="text-[9px] text-blue-200 font-medium">
                          {preset.category}
                        </span>
                      </div>
                      {src === preset.src && (
                        <div className="absolute top-1.5 right-1.5 bg-blue-600 text-white rounded-full p-1 shadow-md">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Upload File */}
            {imageTab === 'upload' && (
              <div className="p-6 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl bg-white text-center transition-colors">
                {isCompressing ? (
                  <div className="py-4 space-y-2">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                    <p className="font-bold text-slate-800 text-xs">Optimizing & compressing banner image for database sync...</p>
                    <p className="text-[11px] text-slate-500">Preparing lightweight high-definition payload for instant global load.</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                    <p className="font-bold text-slate-800 text-xs">Choose an image from your device</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      High-resolution landscape photos recommended (1920×800 or 16:9). PNG, JPG, WebP. Auto-compressed for uniform cloud sync.
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="mt-3 block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#06163c] file:text-white hover:file:bg-blue-900 cursor-pointer"
                    />
                  </>
                )}
              </div>
            )}

            {/* Custom URL */}
            {imageTab === 'url' && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/banner-photo.jpg"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-4 py-2 bg-[#06163c] hover:bg-blue-900 text-white font-bold rounded-xl cursor-pointer text-xs"
                  >
                    Apply URL
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">
                  Paste any public cloud asset URL or image link to use as the hero banner background.
                </p>
              </div>
            )}
          </div>

          {/* 2. Slide Headlines & Captions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                Slide Headline / Primary Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modern Uniform Tailoring Showroom"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                Badge / Tag Ribbon
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Kenyan Factory & Atelier"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                SEO Alt Text (Accessibility)
              </label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="e.g. Bespoke tailored blazers and corporate uniforms"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                Subtitle / Description Text
              </label>
              <textarea
                rows={2}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Precision Tailoring & Bulk Institutional Uniform Manufacturing in Kenya"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block text-xs">Storefront Visibility</span>
                <span className="text-[11px] text-slate-500">
                  Slide is active and rotated in the customer-facing storefront carousel
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  isActive
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {isActive ? '✓ Published & Active' : 'Draft / Hidden'}
              </button>
            </div>
          </div>

          {/* Modal Sticky Footer Actions */}
          <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md pt-4 pb-2 border-t border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span className="hidden sm:inline">
                {isActive ? 'Will publish active on storefront' : 'Will save as hidden draft'}
              </span>
              <span className="text-[10px] text-slate-400 hidden md:inline">• Ctrl+S / Cmd+S to save</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#06163c] hover:bg-blue-900 text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer text-xs flex items-center gap-2 active:scale-95"
              >
                <Save className="w-4 h-4 text-emerald-400" />
                <span>{slide ? 'Save Slide Updates' : 'Publish Banner Slide'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

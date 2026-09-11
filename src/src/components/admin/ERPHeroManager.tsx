import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useERP } from '../../context/ERPContext';
import { HeroSlide, HeroConfig } from '../../types';
import { PRESET_HERO_IMAGES } from '../../data/heroData';
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
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  } = useERP();

  // Active modal state
  const [isSlideModalOpen, setIsSlideModalOpen] = useState<boolean>(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  // Quick feedback alert
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // Preview current active slide index in live preview box
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [previewPaused, setPreviewPaused] = useState<boolean>(false);

  // Slides sorted by order
  const sortedSlides = [...heroSlides].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const activeSlides = sortedSlides.filter((s) => s.isActive !== false);

  // Handle reordering
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSlides = [...sortedSlides];
    const temp = newSlides[index - 1];
    newSlides[index - 1] = newSlides[index];
    newSlides[index] = temp;
    reorderHeroSlides(newSlides);
    showFeedback('Slide order updated.');
  };

  const handleMoveDown = (index: number) => {
    if (index === sortedSlides.length - 1) return;
    const newSlides = [...sortedSlides];
    const temp = newSlides[index + 1];
    newSlides[index + 1] = newSlides[index];
    newSlides[index] = temp;
    reorderHeroSlides(newSlides);
    showFeedback('Slide order updated.');
  };

  const handleToggleActive = (slide: HeroSlide) => {
    updateHeroSlide(slide.id, { isActive: !slide.isActive });
    showFeedback(`Slide "${slide.title}" is now ${!slide.isActive ? 'active' : 'hidden'}.`);
  };

  const handleDelete = (slide: HeroSlide) => {
    if (heroSlides.length <= 1) {
      alert('You must have at least one hero slide.');
      return;
    }
    if (confirm(`Are you sure you want to delete the slide "${slide.title}"?`)) {
      deleteHeroSlide(slide.id);
      showFeedback('Slide deleted successfully.');
    }
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
      showFeedback('Hero reset to default slides.');
    }
  };

  const handleSyncRepo = () => {
    syncHeroSlidesFromRepo();
    showFeedback('Successfully imported and synchronized hero images from repository.');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#06163c] mb-1">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Storefront Visual Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-['Outfit']">
            Homepage Hero Slides & Banners
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Control the animated image slideshow banners, titles, subtitles, badges, and rotation timings that welcome customers on the public homepage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleSyncRepo}
            className="px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer border border-blue-200 shadow-xs"
            title="Import and synchronize hero slides with latest repository assets"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            <span>Sync Repo Images</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer border border-slate-200"
            title="Reset to default demonstration slides"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-gradient-to-r from-[#020a1c] via-[#06163c] to-[#030e28] hover:from-[#010612] hover:via-[#040f28] hover:to-[#010612] text-white text-xs font-extrabold rounded-xl shadow-md border border-blue-900/40 transition-all inline-flex items-center gap-2 active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Banner Slide</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-2.5 text-xs font-bold shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMessage}</span>
        </motion.div>
      )}

      {/* 2. Interactive Live Preview */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Real-time Hero Storefront Preview
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {activeSlides.length} Active / {sortedSlides.length} Total
            </span>
          </div>
        </div>

        {/* Scaled Preview Frame */}
        <div className="relative w-full h-56 sm:h-72 md:h-80 rounded-2xl overflow-hidden bg-white shadow-inner border border-slate-200 group select-none">
          {activeSlides.length > 0 ? (
            <>
              {/* Background Image */}
              <img
                src={activeSlides[previewIndex % activeSlides.length]?.src}
                alt={activeSlides[previewIndex % activeSlides.length]?.alt}
                className="w-full h-full object-cover object-center transition-all duration-700"
                referrerPolicy="no-referrer"
              />

              {/* Slight White Gradient Overlay on top of hero image */}
              <div
                className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-white/70 via-white/20 to-transparent"
                aria-hidden="true"
              />

              {/* Slide Caption Overlay in Preview */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 max-w-md pointer-events-none z-10">
                <span className="inline-block px-2.5 py-1 bg-white/15 backdrop-blur-md border border-white/20 text-white rounded-md text-[10px] font-extrabold uppercase tracking-widest mb-1.5">
                  {activeSlides[previewIndex % activeSlides.length]?.badge || 'Showroom & Atelier'}
                </span>
                <h3 className="text-white font-extrabold text-sm sm:text-base md:text-lg leading-tight drop-shadow-md">
                  {activeSlides[previewIndex % activeSlides.length]?.title}
                </h3>
                <p className="text-slate-200 text-[11px] sm:text-xs mt-1 drop-shadow line-clamp-2">
                  {activeSlides[previewIndex % activeSlides.length]?.subtitle}
                </p>
              </div>

              {/* Slide navigation controls */}
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                <button
                  type="button"
                  onClick={() => setPreviewPaused(!previewPaused)}
                  className="text-white/80 hover:text-white p-0.5 cursor-pointer"
                  title={previewPaused ? 'Resume preview' : 'Pause preview'}
                >
                  {previewPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                </button>
                <div className="h-2.5 w-px bg-white/20" />
                <div className="flex items-center gap-1">
                  {activeSlides.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setPreviewIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        previewIndex % activeSlides.length === idx
                          ? 'bg-[#D1E0FF] w-4 shadow-sm'
                          : 'bg-white/40 hover:bg-white/70 w-1.5'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Wave crest */}
              {heroConfig.showWaveDivider && (
                <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10">
                  <svg
                    className="relative block w-full h-5 sm:h-8"
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
              <EyeOff className="w-8 h-8 text-slate-400 mb-2" />
              <p className="font-bold text-sm">All slides are currently disabled.</p>
              <p className="text-xs text-slate-400 mt-1">
                Enable at least one slide below to display on the storefront.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Global Slideshow Settings & Timing */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sliders className="w-4 h-4 text-[#06163c]" />
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
            Slideshow Display & Timing Settings
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Auto-play toggle */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
            <div>
              <div className="font-extrabold text-slate-900 mb-0.5">Slideshow Auto-Rotation</div>
              <div className="text-[11px] text-slate-500">Automatically advance slides on storefront.</div>
            </div>
            <button
              type="button"
              onClick={() => updateHeroConfig({ autoPlay: !heroConfig.autoPlay })}
              className={`w-full py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                heroConfig.autoPlay
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {heroConfig.autoPlay ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              <span>{heroConfig.autoPlay ? 'Enabled' : 'Paused'}</span>
            </button>
          </div>

          {/* Timing Interval */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
            <div>
              <div className="font-extrabold text-slate-900 mb-0.5">Rotation Speed</div>
              <div className="text-[11px] text-slate-500">Duration each slide remains visible.</div>
            </div>
            <select
              value={heroConfig.autoPlayIntervalMs}
              onChange={(e) => updateHeroConfig({ autoPlayIntervalMs: Number(e.target.value) })}
              className="w-full py-2 px-3 rounded-xl bg-white border border-slate-300 font-bold text-slate-800 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={3500}>3.5 Seconds (Fast)</option>
              <option value={5500}>5.5 Seconds (Recommended)</option>
              <option value={7500}>7.5 Seconds (Relaxed)</option>
              <option value={10000}>10 Seconds (Slow)</option>
            </select>
          </div>

          {/* Height Preset */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
            <div>
              <div className="font-extrabold text-slate-900 mb-0.5">Banner Height Preset</div>
              <div className="text-[11px] text-slate-500">Responsive height on desktop screens.</div>
            </div>
            <select
              value={heroConfig.heightPreset}
              onChange={(e) =>
                updateHeroConfig({
                  heightPreset: e.target.value as 'compact' | 'standard' | 'tall',
                })
              }
              className="w-full py-2 px-3 rounded-xl bg-white border border-slate-300 font-bold text-slate-800 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="compact">Compact (~380px)</option>
              <option value="standard">Standard (~480px)</option>
              <option value="tall">Cinematic Tall (~560px)</option>
            </select>
          </div>

          {/* Bottom Wave Divider */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
            <div>
              <div className="font-extrabold text-slate-900 mb-0.5">Curved Wave Edge</div>
              <div className="text-[11px] text-slate-500">Curved wave blending into the catalog.</div>
            </div>
            <button
              type="button"
              onClick={() =>
                updateHeroConfig({ showWaveDivider: !heroConfig.showWaveDivider })
              }
              className={`w-full py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                heroConfig.showWaveDivider
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {heroConfig.showWaveDivider ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              <span>{heroConfig.showWaveDivider ? 'Wave Enabled' : 'Flat Edge'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Slides List */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#06163c]" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Slide Deck Management ({sortedSlides.length} Slides)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Drag or use arrows to rearrange slide priority
          </span>
        </div>

        <div className="space-y-3">
          {sortedSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                slide.isActive !== false
                  ? 'bg-white border-slate-200 shadow-xs hover:border-blue-400'
                  : 'bg-slate-50 border-dashed border-slate-300 opacity-60'
              }`}
            >
              {/* Left: Thumbnail & Details */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Order indicator */}
                <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                  #{index + 1}
                </div>

                {/* Thumbnail image */}
                <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 relative group">
                  <img
                    src={slide.src}
                    alt={slide.alt || slide.title}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  {!slide.isActive && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-[10px] font-bold text-white uppercase">
                      Hidden
                    </div>
                  )}
                </div>

                {/* Text metadata */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 text-[10px] font-extrabold">
                      {slide.badge || 'Showroom & Atelier'}
                    </span>
                    <span className="font-extrabold text-slate-900 text-sm truncate">
                      {slide.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate max-w-xl">
                    {slide.subtitle}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    Alt: {slide.alt}
                  </p>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                {/* Move Up */}
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMoveUp(index)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Move slide up"
                >
                  <MoveUp className="w-4 h-4" />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  disabled={index === sortedSlides.length - 1}
                  onClick={() => handleMoveDown(index)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Move slide down"
                >
                  <MoveDown className="w-4 h-4" />
                </button>

                {/* Active / Inactive Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleActive(slide)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    slide.isActive !== false
                      ? 'text-emerald-600 hover:bg-emerald-50'
                      : 'text-slate-400 hover:bg-slate-200'
                  }`}
                  title={slide.isActive !== false ? 'Slide is active (click to hide)' : 'Slide is hidden (click to activate)'}
                >
                  {slide.isActive !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(slide)}
                  className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  title="Edit slide details & image"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* Delete Button */}
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
          ))}
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
   SUB-COMPONENT: Slide Editor & Image Picker Modal
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
  const [customUrlInput, setCustomUrlInput] = useState('');

  // Prevent background body scroll while modal is active & listen for Escape key
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        setSrc(uploadEvent.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!customUrlInput.trim()) return;
    setSrc(customUrlInput.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Slide title is required.');
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

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hero-slide-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none"
    >
      <div
        className="relative z-10 bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#020a1c] via-[#06163c] to-[#030e28] text-white p-5 flex items-center justify-between border-b border-blue-900/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <ImageIcon className="w-5 h-5 text-blue-300" />
            <div>
              <h3 id="hero-slide-modal-title" className="font-bold text-sm">
                {slide ? 'Edit Hero Banner Slide' : 'Add New Hero Banner Slide'}
              </h3>
              <p className="text-[11px] text-blue-200">
                Choose banner imagery and customize storefront display text
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body - scrollable with sticky footer */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs overflow-y-auto flex-1 select-text">
          {/* Live Preview Box */}
          <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner group">
            <img
              src={src}
              alt={title || 'Preview'}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020a1c]/85 via-transparent to-[#020a1c]/50 pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-md rounded text-[10px] font-bold uppercase mb-1">
                {badge || 'Showroom & Atelier'}
              </span>
              <h4 className="font-extrabold text-sm leading-tight line-clamp-1">
                {title || 'Slide Title Preview'}
              </h4>
              <p className="text-[11px] text-slate-200 line-clamp-1 mt-0.5">
                {subtitle || 'Subtitle description preview text'}
              </p>
            </div>
          </div>

          {/* 1. Image Selection Method Tabs */}
          <div className="space-y-2.5">
            <label className="block font-bold text-slate-700">Banner Background Image *</label>
            <div className="flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => setImageTab('presets')}
                className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                  imageTab === 'presets'
                    ? 'border-[#06163c] text-[#06163c]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Curated Presets
              </button>
              <button
                type="button"
                onClick={() => setImageTab('upload')}
                className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                  imageTab === 'upload'
                    ? 'border-[#06163c] text-[#06163c]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Upload from Device
              </button>
              <button
                type="button"
                onClick={() => setImageTab('url')}
                className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                  imageTab === 'url'
                    ? 'border-[#06163c] text-[#06163c]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Custom Web URL
              </button>
            </div>

            {/* Presets Grid */}
            {imageTab === 'presets' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
                {PRESET_HERO_IMAGES.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSrc(preset.src)}
                    className={`relative h-20 rounded-xl overflow-hidden border-2 text-left group cursor-pointer transition-all ${
                      src === preset.src
                        ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={preset.src}
                      alt={preset.name}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-1.5 flex flex-col justify-end">
                      <span className="text-[10px] text-white font-bold truncate">
                        {preset.name}
                      </span>
                      <span className="text-[9px] text-blue-200 font-medium">
                        {preset.category}
                      </span>
                    </div>
                    {src === preset.src && (
                      <div className="absolute top-1.5 right-1.5 bg-blue-600 text-white rounded-full p-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Upload Tab */}
            {imageTab === 'upload' && (
              <div className="p-5 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl bg-slate-50 text-center transition-colors">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="font-bold text-slate-700">Click to browse or drag image here</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  High-resolution panoramic or landscape images recommended (1920x800)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="mt-3 block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#06163c] file:text-white hover:file:bg-blue-900 cursor-pointer"
                />
              </div>
            )}

            {/* Custom URL Tab */}
            {imageTab === 'url' && (
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or cloud asset URL"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl cursor-pointer"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* 2. Slide Headlines & Captions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Slide Headline / Main Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Modern Uniform Tailoring Showroom"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Badge / Ribbon Tag
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g., Showroom & Atelier, Special Collection"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                SEO Alt Text (Accessibility)
              </label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="e.g., Bespoke school blazers and corporate wear"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Subtitle / Description
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g., Precision Tailoring & Bulk Institutional Uniform Manufacturing"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 block">Publish State</span>
                <span className="text-[11px] text-slate-500">
                  Slide is visible in the public storefront carousel
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {isActive ? 'Active' : 'Draft / Hidden'}
              </button>
            </div>
          </div>

          {/* Modal Footer Actions - Sticky Bottom */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 sticky bottom-0 bg-white/95 backdrop-blur-xs -mx-6 -mb-6 px-6 py-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-[#020a1c] via-[#06163c] to-[#030e28] hover:from-[#010612] hover:via-[#040f28] hover:to-[#010612] text-white font-extrabold rounded-xl shadow-md border border-blue-900/40 transition-all cursor-pointer"
            >
              {slide ? 'Save Slide Changes' : 'Create Banner Slide'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};

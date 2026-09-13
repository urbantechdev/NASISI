import { HeroSlide, HeroConfig } from '../types';

export const INITIAL_HERO_CONFIG: HeroConfig = {
  autoPlay: true,
  autoPlayIntervalMs: 5000,
  showWaveDivider: true,
  showOverlayGradients: true,
  heightPreset: 'standard',
};

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    src: '/src/assets/images/hero_uniform_textile_banner_1787649776993.jpg',
    title: 'Precision Uniform Engineering',
    subtitle: 'High-durability corporate, medical, industrial & security attire manufactured in Nairobi.',
    badge: 'Industrial Atelier',
    alt: 'Nasisi Uniforms manufacturing banner',
    isActive: true,
    order: 0,
  },
  {
    id: 'slide-2',
    src: '/src/assets/images/modern_uniform_showroom_1787666395332.jpg',
    title: 'Modern Workwear & Uniform Showroom',
    subtitle: 'Premium institutional garments with computerized embroidery and screen printing.',
    badge: 'Custom Branding',
    alt: 'Nasisi modern uniform showroom',
    isActive: true,
    order: 1,
  },
  {
    id: 'slide-3',
    src: '/src/assets/images/elegant_uniform_collection_1787666412573.jpg',
    title: 'Executive & Hospitality Apparel',
    subtitle: 'Bespoke tailoring, breathable chef jackets, and corporate blazers.',
    badge: 'Executive Line',
    alt: 'Nasisi elegant uniform collection',
    isActive: true,
    order: 2,
  },
];

export const PRESET_HERO_IMAGES = [
  {
    id: 'preset-banner-1',
    name: 'Textile Manufacturing Workshop',
    src: '/src/assets/images/hero_uniform_textile_banner_1787649776993.jpg',
    category: 'Industrial Atelier',
  },
  {
    id: 'preset-banner-2',
    name: 'Modern Uniform Showroom',
    src: '/src/assets/images/modern_uniform_showroom_1787666395332.jpg',
    category: 'Showroom & Atelier',
  },
  {
    id: 'preset-banner-3',
    name: 'Bespoke Executive Collection',
    src: '/src/assets/images/elegant_uniform_collection_1787666412573.jpg',
    category: 'Corporate & Hospitality',
  },
  {
    id: 'preset-banner-4',
    name: 'Nairobi Production Line',
    src: '/src/assets/images/hero_banner_1787463426654.jpg',
    category: 'Factory Line',
  },
];

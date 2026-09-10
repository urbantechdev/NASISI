import { HeroSlide, HeroConfig } from '../types';
import showroomImg from '../assets/images/modern_uniform_showroom_1787666395332.jpg';
import collectionImg from '../assets/images/elegant_uniform_collection_1787666412573.jpg';
import atelierImg from '../assets/images/hero_uniform_textile_banner_1787649776993.jpg';
import heroBannerAlt from '../assets/images/hero_banner_1787463426654.jpg';
import schoolBlazerImg from '../assets/images/academic_school_blazer_1787666599640.jpg';
import chefJacketImg from '../assets/images/chef_jacket_executive_1787666710074.jpg';
import industrialWorkwearImg from '../assets/images/industrial_workwear_overall_1787666910504.jpg';
import varsityJacketImg from '../assets/images/varsity_letterman_jacket_1787666981298.jpg';
import medicalScrubImg from '../assets/images/medical_scrub_set_1787666693362.jpg';
import baristaApronImg from '../assets/images/canvas_barista_apron_1787666742156.jpg';

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-slide-1',
    src: showroomImg,
    title: 'Modern Uniform Tailoring Showroom',
    subtitle: 'Precision Tailoring & Bulk Institutional Uniform Manufacturing',
    badge: 'Showroom & Atelier',
    alt: 'Bespoke Uniforms, School Blazers, Corporate & Medical Wear',
    isActive: true,
    order: 0,
  },
  {
    id: 'hero-slide-2',
    src: collectionImg,
    title: 'Commercial Textile & Apparel Studio',
    subtitle: 'Premium Fabrics, Color-Fast Dyes & High-Density Crest Embroidery',
    badge: 'Textile Craftsmanship',
    alt: 'High-end Uniform Collections and Embroidery Atelier',
    isActive: true,
    order: 1,
  },
  {
    id: 'hero-slide-3',
    src: atelierImg,
    title: 'Master Tailoring & Garment Workshop',
    subtitle: 'Serving Schools, Hospitals, Corporate & Hospitality Across East Africa',
    badge: 'Production Excellence',
    alt: 'Bespoke Garment Craftsmanship and Precision Cutters',
    isActive: true,
    order: 2,
  },
];

export const INITIAL_HERO_CONFIG: HeroConfig = {
  autoPlay: true,
  autoPlayIntervalMs: 5500,
  showWaveDivider: true,
  showOverlayGradients: false,
  heightPreset: 'standard',
};

export interface PresetHeroImage {
  id: string;
  name: string;
  category: string;
  src: string;
}

export const PRESET_HERO_IMAGES: PresetHeroImage[] = [
  {
    id: 'preset-showroom',
    name: 'Modern Showroom & Mannequins',
    category: 'Showroom',
    src: showroomImg,
  },
  {
    id: 'preset-collection',
    name: 'Apparel & Fabric Studio',
    category: 'Showroom',
    src: collectionImg,
  },
  {
    id: 'preset-atelier',
    name: 'Master Tailoring & Workshop',
    category: 'Workshop',
    src: atelierImg,
  },
  {
    id: 'preset-hero-panoramic',
    name: 'Panoramic Apparel Banner',
    category: 'Panoramic',
    src: heroBannerAlt,
  },
  {
    id: 'preset-school-blazer',
    name: 'Classic Academy School Blazer',
    category: 'School',
    src: schoolBlazerImg,
  },
  {
    id: 'preset-chef-jacket',
    name: 'Executive Chef Jacket',
    category: 'Hospitality',
    src: chefJacketImg,
  },
  {
    id: 'preset-workwear',
    name: 'Industrial Heavy-Duty Overalls',
    category: 'Industrial',
    src: industrialWorkwearImg,
  },
  {
    id: 'preset-varsity',
    name: 'Varsity & Letterman Jacket',
    category: 'Knitwear',
    src: varsityJacketImg,
  },
  {
    id: 'preset-scrubs',
    name: 'Clinical Medical Scrub Set',
    category: 'Healthcare',
    src: medicalScrubImg,
  },
  {
    id: 'preset-apron',
    name: 'Heavyweight Canvas Apron',
    category: 'Hospitality',
    src: baristaApronImg,
  },
];

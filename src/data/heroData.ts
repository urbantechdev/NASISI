import { HeroSlide, HeroConfig } from '../types';

// Import current hero banner and apparel images directly from repository
import heroPanoramicBanner from '../assets/images/hero_banner_1787463426654.jpg';
import textileWorkshopBanner from '../assets/images/hero_uniform_textile_banner_1787649776993.jpg';
import modernShowroomBanner from '../assets/images/modern_uniform_showroom_1787666395332.jpg';
import apparelCollectionBanner from '../assets/images/elegant_uniform_collection_1787666412573.jpg';

// Category-specific high-resolution garment & atelier assets from repo
import schoolBlazerImg from '../assets/images/academic_school_blazer_1787666599640.jpg';
import industrialWorkwearImg from '../assets/images/industrial_workwear_overall_1787666910504.jpg';
import highVisSafetyVestImg from '../assets/images/high_vis_safety_vest_1787666856898.jpg';
import medicalScrubImg from '../assets/images/medical_scrub_set_1787666693362.jpg';
import chefJacketImg from '../assets/images/chef_jacket_executive_1787666710074.jpg';
import baristaApronImg from '../assets/images/canvas_barista_apron_1787666742156.jpg';
import corporateServicePoloImg from '../assets/images/corporate_service_polo_1787666794018.jpg';
import schoolKnitSweaterImg from '../assets/images/school_knit_sweater_1787666624927.jpg';
import schoolPiquePoloImg from '../assets/images/school_pique_polo_1787666646059.jpg';
import schoolTracksuitImg from '../assets/images/school_tracksuit_jacket_1787666665335.jpg';
import varsityLettermanImg from '../assets/images/varsity_letterman_jacket_1787666981298.jpg';
import fleeceHoodieImg from '../assets/images/fleece_pullover_hoodie_1787666996711.jpg';

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-slide-1',
    src: heroPanoramicBanner,
    title: 'NASISI Industrial Apparel & Uniform Atelier',
    subtitle: 'Premier Manufacturer of Bespoke School, Corporate, Healthcare & Industrial Uniforms in Kenya',
    badge: 'Kenyan Factory & Atelier',
    alt: 'NASISI Bespoke Uniforms, School Blazers, Corporate and Industrial Apparel',
    isActive: true,
    order: 0,
  },
  {
    id: 'hero-slide-2',
    src: modernShowroomBanner,
    title: 'Modern Uniform Tailoring Showroom',
    subtitle: 'Precision Tailoring & Bulk Institutional Uniform Manufacturing',
    badge: 'Showroom & Mannequins',
    alt: 'Bespoke Uniforms, School Blazers, Corporate & Medical Wear',
    isActive: true,
    order: 1,
  },
  {
    id: 'hero-slide-3',
    src: textileWorkshopBanner,
    title: 'Master Tailoring & Garment Workshop',
    subtitle: 'In-House Computerized Embroidery, Screen Printing & High-Tension Stitching',
    badge: 'Production Excellence',
    alt: 'Bespoke Garment Craftsmanship and Precision Cutters',
    isActive: true,
    order: 2,
  },
  {
    id: 'hero-slide-4',
    src: apparelCollectionBanner,
    title: 'Commercial Textile & Apparel Studio',
    subtitle: 'Premium Anti-Pill Fabrics, Color-Fast Dyes & High-Density Crest Embroidery',
    badge: 'Textile Craftsmanship',
    alt: 'High-end Uniform Collections and Embroidery Atelier',
    isActive: true,
    order: 3,
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
    id: 'preset-hero-panoramic',
    name: 'NASISI Panoramic Atelier Banner',
    category: 'Panoramic',
    src: heroPanoramicBanner,
  },
  {
    id: 'preset-showroom',
    name: 'Modern Showroom & Tailoring',
    category: 'Showroom',
    src: modernShowroomBanner,
  },
  {
    id: 'preset-atelier',
    name: 'Master Tailoring Workshop',
    category: 'Workshop',
    src: textileWorkshopBanner,
  },
  {
    id: 'preset-collection',
    name: 'Commercial Textile & Apparel Studio',
    category: 'Showroom',
    src: apparelCollectionBanner,
  },
  {
    id: 'preset-school-blazer',
    name: 'Classic Academy Tailored Blazer',
    category: 'School',
    src: schoolBlazerImg,
  },
  {
    id: 'preset-school-tracksuit',
    name: 'Athletic Sports Tracksuit Jacket',
    category: 'School',
    src: schoolTracksuitImg,
  },
  {
    id: 'preset-school-knitwear',
    name: 'V-Neck Knitted School Sweater',
    category: 'School',
    src: schoolKnitSweaterImg,
  },
  {
    id: 'preset-school-polo',
    name: 'Breathable Pique School Polo',
    category: 'School',
    src: schoolPiquePoloImg,
  },
  {
    id: 'preset-workwear',
    name: 'Industrial Heavy-Duty Overalls',
    category: 'Safety & Industrial',
    src: industrialWorkwearImg,
  },
  {
    id: 'preset-high-vis',
    name: 'High-Visibility Reflective Vest',
    category: 'Safety & Industrial',
    src: highVisSafetyVestImg,
  },
  {
    id: 'preset-scrubs',
    name: 'Clinical Medical Scrub Set',
    category: 'Healthcare',
    src: medicalScrubImg,
  },
  {
    id: 'preset-chef-jacket',
    name: 'Executive Chef Jacket',
    category: 'Hospitality',
    src: chefJacketImg,
  },
  {
    id: 'preset-apron',
    name: 'Heavyweight Canvas Apron',
    category: 'Hospitality',
    src: baristaApronImg,
  },
  {
    id: 'preset-corporate-polo',
    name: 'Corporate Service Branded Polo',
    category: 'Corporate',
    src: corporateServicePoloImg,
  },
  {
    id: 'preset-varsity',
    name: 'Varsity & Letterman Jacket',
    category: 'Sportswear',
    src: varsityLettermanImg,
  },
  {
    id: 'preset-hoodie',
    name: 'Heavyweight Fleece Pullover Hoodie',
    category: 'Sportswear',
    src: fleeceHoodieImg,
  },
];

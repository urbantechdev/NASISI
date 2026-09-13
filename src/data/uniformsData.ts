import { UniformProduct, Testimonial, PortfolioItem } from '../types';
import academicSchoolBlazerImg from '../assets/images/academic_school_blazer_1787666599640.jpg';
import medicalScrubSetImg from '../assets/images/medical_scrub_set_1787666693362.jpg';
import canvasBaristaApronImg from '../assets/images/canvas_barista_apron_1787666742156.jpg';
import highVisSafetyVestImg from '../assets/images/high_vis_safety_vest_1787666856898.jpg';

// Official Slogans from Garment Product Catalogue
export const CATALOGUE_SLOGAN = 'We stitch it. You wear it. We print it. You represent.';
export const BRAND_PROMISE = 'From Workwear to Corporate Wear — We Stitch, Brand & Deliver.';

// 10 High-Priority Products (Catalogue Page 3)
export const HIGH_PRIORITY_PRODUCTS_LIST = [
  '1. Safety wear',
  '2. Corporate uniforms',
  '3. Work overalls',
  '4. School uniforms',
  '5. Security uniforms',
  '6. Branded polo shirts',
  '7. Branded T-shirts',
  '8. Medical scrubs',
  '9. Hospitality uniforms',
  '10. Sportswear',
];

// Additional Services (Catalogue Page 3)
export const ADDITIONAL_SERVICES_LIST = [
  'Embroidery',
  'Screen Printing',
  'Heat Transfer',
  'Reflective Branding',
  'Custom Stitching',
];

// Catalogue Products (Wiped - ready for user to create new)
export const UNIFORM_PRODUCTS: UniformProduct[] = [];

// 5 Official In-House Services (Catalogue Page 3)
export const CORE_SERVICES = [
  {
    id: 'embroidery',
    title: 'Computerized Industrial Embroidery',
    shortDescription: 'Precision multi-head automated Tajima machinery delivering high-density, 3D puff, and fade-proof crests on any fabric.',
    bulletPoints: [
      'Automated multi-needle Tajima and Barudan embroidery banks',
      'High-relief 3D Puff embroidery for caps, hoodies, and varsity jackets',
      'Metallic gold/silver, fire-retardant & high-visibility threads',
      'Direct chest crests, collar monograms, epaulettes & sleeve badges',
      'Wash-proof durability that outlasts the lifespan of the garment',
    ],
    idealFabrics: ['Blazers', 'Polo Shirts', 'Knit Sweaters', 'Chef Coats', 'Scrubs', 'Caps', 'Security Shirts'],
    icon: 'Needle',
  },
  {
    id: 'screen-printing',
    title: 'Commercial Silkscreen Printing',
    shortDescription: 'High-opacity plastisol and breathable eco-waterbase screen printing engineered for large bold graphics and high-volume orders.',
    bulletPoints: [
      'High-durability plastisol & breathable eco-friendly waterbase inks',
      'Automatic carousel textile presses for rapid multi-thousand turnarounds',
      'High-visibility reflective, metallic shimmer & glow-in-the-dark specialty inks',
      'Full back prints for promotional events, sports teams & security staff',
      'Zero cracking, flaking, or fading after rigorous industrial wash cycles',
    ],
    idealFabrics: ['Round-Neck T-Shirts', 'Hoodies', 'Safety Vests', 'Tracksuits', 'Tote Bags'],
    icon: 'Printer',
  },
  {
    id: 'heat-transfer',
    title: 'High-Definition Heat Transfer & DTF',
    shortDescription: 'Ultra-crisp full-color Direct-to-Film (DTF) and polyurethane vinyl transfers with photorealistic resolution and flexible hand-feel.',
    bulletPoints: [
      'Photorealistic 1440 DPI full-color photographic reproduction',
      'Stretchable polyurethane vinyl that flexes with active sportswear fabrics',
      'High-adhesion adhesives for polyester, nylon, and waterproof garments',
      'Individually numbered football kits and personalized staff names',
      'No minimum color count limitations for intricate gradient logos',
    ],
    idealFabrics: ['Football Jerseys', 'Spandex Scrubs', 'Waterproof Jackets', 'Performance Polos'],
    icon: 'Flame',
  },
  {
    id: 'reflective-branding',
    title: 'Reflective Branding & High-Vis Safety Inks',
    shortDescription: 'Certified retro-reflective printing and 3M Scotchlite heat-sealed tape for maximum nocturnal visibility and industrial compliance.',
    bulletPoints: [
      'EN ISO 20471 compliant retro-reflective heat-applied transfers',
      'Reflective silkscreen inks visible up to 300 meters under headlights',
      'Silver, fluorescent lime, and custom branded reflective colorways',
      'Essential for road contractors, night security, and motorcycle couriers',
      'Resistant to industrial laundering and outdoor weather extremes',
    ],
    idealFabrics: ['Reflective Jackets', 'Boiler Suits', 'Safety Vests', 'Rider Windbreakers', 'Security Parkas'],
    icon: 'Sparkles',
  },
  {
    id: 'custom-stitching',
    title: 'Custom Stitching & Bespoke Tailoring',
    shortDescription: 'In-house pattern cutting, custom knitwear weaving, reinforced triple-stitch seams, and custom-dyed institutional trims.',
    bulletPoints: [
      'Custom jacquard knit patterns, tipping stripes & school ribbing',
      'Heavy triple-needle flat-felled seam construction for workwear',
      'Custom collar piping, contrast cuffs & personalized woven neck labels',
      'Bespoke pattern drafting from Kindergarten Age 3 up to Adult 5XL',
      'Strict quality assurance guaranteeing zero stitching defects',
    ],
    idealFabrics: ['School Blazers', 'Knit Sweaters', 'Industrial Overalls', 'Executive Blouses', 'Bespoke Suiting'],
    icon: 'Scissors',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    quote: 'NASISI transformed our school uniforms. The embroidery on our academic blazers and knit sweaters is sharper than anything we had before, and the anti-pill fabric holds up through hundreds of student washes.',
    author: 'Margaret K. Owino',
    role: 'Head of Administration & Procurement',
    organization: 'St. Augustine Academy (600+ Students)',
    location: 'Regional School District',
    category: 'School Uniforms',
    rating: 5,
  },
  {
    id: 'test-2',
    quote: 'We ordered customized scrubs and medical coats for our 45 clinic nurses and physicians. The embroidery with doctor names and our blue clinic badge looked exceptionally professional.',
    author: 'Dr. David A. Mensah',
    role: 'Medical Director',
    organization: 'Apex Premier Health & Care Centre',
    location: 'Metropolitan Health Center',
    category: 'Healthcare Uniforms',
    rating: 5,
  },
  {
    id: 'test-3',
    quote: 'From screen-printed staff aprons to embroidered chef coats, NASISI delivered flawless color matching to our brand cobalt blue. Quick turnaround and transparent bulk pricing.',
    author: 'Chef Tariq Al-Hassan',
    role: 'Executive Chef & Operations Lead',
    organization: 'The Blue Anchor Restaurant Group',
    location: 'Hospitality Sector',
    category: 'Hospitality & Restaurant Wear',
    rating: 5,
  },
  {
    id: 'test-4',
    quote: 'Outfitting 300+ guards across 12 commercial sites requires military-level durability. The ripstop tactical shirts, patrol sweaters, and reflective parkas from NASISI have proven virtually indestructible.',
    author: 'James Mwangi',
    role: 'Operations Director',
    organization: 'ShieldGuard Security Services Ltd',
    location: 'Industrial & Commercial Division',
    category: 'Security Uniforms',
    rating: 5,
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Complete 600-Student Academy Uniform Rollout',
    client: 'Oakridge International Preparatory',
    category: 'School Uniforms',
    technique: 'Direct High-Density Crest Embroidery & Custom Knitted V-Necks',
    description: 'Designed and manufactured 600 complete sets including tailored royal blue blazers, anti-pill sweaters, pique polo shirts, and PE tracksuits.',
    tags: ['Academic Blazers', 'Knit Sweaters', 'Custom Crests'],
    image: academicSchoolBlazerImg,
    quantityDelivered: '2,400+ Garments',
  },
  {
    id: 'port-2',
    title: 'Multi-Location Clinical Hospital Scrub Outfitting',
    client: 'City Regional Healthcare System',
    category: 'Healthcare & Medical',
    technique: 'Anti-Microbial Pro-Flex Scrubs with Dual Pocket Monogramming',
    description: 'Supplied color-coded scrubs across 4 departments (Emergency, Pediatric, Surgery, General Care) with doctor identification embroidery.',
    tags: ['4-Way Stretch Scrubs', 'Doctor Monograms', 'Color-Coded Tiers'],
    image: medicalScrubSetImg,
    quantityDelivered: '850 Sets',
  },
  {
    id: 'port-3',
    title: 'Boutique Hotel & Bistro Brand Hospitality Apparel',
    client: 'The Grand Harbor Suites & Lounge',
    category: 'Hospitality & Culinary',
    technique: 'Laser-Etched Leather Patches & Metallic Thread Embroidery',
    description: 'Custom heavy canvas barista aprons, executive chef jackets, and front-desk moisture-wicking corporate polos.',
    tags: ['Culinary Jackets', 'Canvas Aprons', 'Corporate Polos'],
    image: canvasBaristaApronImg,
    quantityDelivered: '320 Pieces',
  },
  {
    id: 'port-4',
    title: 'Industrial High-Vis Logistics Crew Safety Gear',
    client: 'Apex Global Freight & Fleet Ops',
    category: 'Safety & Industrial Wear',
    technique: 'Large Reflective Silkscreen Printing & Reinforced Coveralls',
    description: 'Triple-stitched heavy boiler suits and high-vis safety vests with reflective company branding for night shift warehouse operations.',
    tags: ['ISO Safety Vests', 'Triple-Stitch Overalls', 'Reflective Screen Print'],
    image: highVisSafetyVestImg,
    quantityDelivered: '1,200 Units',
  },
];

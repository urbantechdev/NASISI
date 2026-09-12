export interface PageSEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogType?: string;
}

export const SEO_PAGE_CONFIGS: Record<string, PageSEOMetadata> = {
  home: {
    title: 'NASISI Uniforms & Custom Knitwear | Uniforms, Embroidery & Screen Printing Nairobi',
    description: "Kenya's premier manufacturer of custom school uniforms, corporate blazers, medical scrubs, industrial workwear, commercial embroidery, and precision screen printing in Nairobi.",
    keywords: 'school uniforms Kenya, custom embroidery Nairobi, screen printing Nairobi, corporate uniforms Kenya, medical scrubs Nairobi, security guard uniforms Kenya, custom knitwear Nairobi, school blazers Kenya, fleece jackets Nairobi, wholesale uniforms Kenya',
    canonicalPath: '/',
    ogType: 'website',
  },
  products: {
    title: 'Uniform Catalog & Custom Garment Manufacturing | NASISI Nairobi',
    description: 'Explore our complete catalog of school blazers, knitted sweaters, tracksuits, hospital scrubs, security apparel, and chef jackets manufactured to exact institutional specifications.',
    keywords: 'school uniform catalog Nairobi, school sweaters Kenya, customized polo shirts Kenya, lab coats Nairobi, security uniforms Kenya, chef jackets Nairobi',
    canonicalPath: '/#catalog',
    ogType: 'product.group',
  },
  services: {
    title: 'Textile Embroidery, Screen Printing & Knitwear Finishing | NASISI Nairobi',
    description: 'Direct factory services in Nairobi including computerized multi-head embroidery, plastisol & discharge textile screen printing, pattern digitizing, and knitwear finishing.',
    keywords: 'embroidery services Nairobi, screen printing Kenya, t-shirt printing Nairobi, logo digitizing Kenya, bulk textile printing Kenya',
    canonicalPath: '/#services',
    ogType: 'service',
  },
  contacts: {
    title: 'Contact NASISI Uniforms | Factory Inquiries, Quotations & Showroom Nairobi',
    description: 'Get in touch with NASISI Uniforms & Custom Knitwear in Nairobi. Call +254 728 102 929, email nasisiknitwear.ke@gmail.com, or request an institutional quotation.',
    keywords: 'contact NASISI uniforms, uniform suppliers Nairobi contact, school uniform quote Kenya, Nairobi uniform factory telephone',
    canonicalPath: '/#contact',
    ogType: 'business.business',
  },
  terms: {
    title: 'Terms of Service & Institutional Procurement Terms | NASISI Uniforms Kenya',
    description: 'Read the official Terms of Service for NASISI Uniforms & Custom Knitwear, covering bulk order agreements, artwork proofs, LPO fulfillment, warranty, and delivery terms in Kenya.',
    keywords: 'NASISI terms of service, uniform procurement policy Kenya, uniform warranty terms Nairobi, institutional ordering policy',
    canonicalPath: '/#terms',
    ogType: 'article',
  },
  cookies: {
    title: 'Cookie Policy & Storage Preferences | NASISI Uniforms Kenya',
    description: 'Understand how NASISI Uniforms uses essential session cookies, local storage for quotation estimators, and preferences to provide a seamless browsing experience.',
    keywords: 'NASISI cookie policy, privacy preferences, storage policy Kenya, data security',
    canonicalPath: '/#cookies',
    ogType: 'article',
  },
  privacy: {
    title: 'Platform Privacy Policy & Client Data Protection | NASISI Uniforms Kenya',
    description: 'Learn how NASISI Uniforms protects institutional customer data, quotation details, and school records according to Kenyan and international data protection standards.',
    keywords: 'NASISI privacy policy, customer data protection Kenya, school uniform client confidentiality',
    canonicalPath: '/#privacy',
    ogType: 'article',
  },
  location: {
    title: 'Factory Showroom Location & Google Maps Directions | NASISI Uniforms Nairobi',
    description: 'Visit the NASISI Uniforms factory showroom in Nairobi, Kenya. View live interactive Google Map, GPS navigation coordinates, operating hours, and travel directions.',
    keywords: 'NASISI uniforms location, uniform factory Nairobi map, Industrial Area Nairobi uniforms, NASISI knitwear address, Google Map directions NASISI',
    canonicalPath: '/#location',
    ogType: 'business.business',
  },
};

/**
 * Dynamically updates document metadata for SEO across SPA views and anchors
 */
export function updateSEO(pageKey: keyof typeof SEO_PAGE_CONFIGS | string) {
  if (typeof document === 'undefined') return;

  const config = SEO_PAGE_CONFIGS[pageKey] || SEO_PAGE_CONFIGS.home;

  // 1. Document Title
  document.title = config.title;

  // Helper to set or create meta tag
  const setMeta = (selector: string, attr: string, value: string) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      const [key, val] = selector.replace('meta[', '').replace(']', '').split('=');
      if (key && val) {
        el.setAttribute(key, val.replace(/['"]/g, ''));
      }
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  };

  // 2. Meta description & keywords
  setMeta('meta[name="description"]', 'content', config.description);
  if (config.keywords) {
    setMeta('meta[name="keywords"]', 'content', config.keywords);
  }

  // 3. OpenGraph Tags
  setMeta('meta[property="og:title"]', 'content', config.title);
  setMeta('meta[property="og:description"]', 'content', config.description);
  if (config.ogType) {
    setMeta('meta[property="og:type"]', 'content', config.ogType);
  }

  // 4. Twitter Tags
  setMeta('meta[name="twitter:title"]', 'content', config.title);
  setMeta('meta[name="twitter:description"]', 'content', config.description);

  // 5. Canonical Link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', `https://nasisiuniforms.co.ke${config.canonicalPath || '/'}`);
}

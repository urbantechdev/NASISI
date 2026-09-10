/**
 * Favicon management utilities for instant browser tab icon updates.
 */

export const DEFAULT_FAVICON_DATA_URI = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23041429'/%3E%3Cpath d='M16 48 L16 16 L32 38 L32 16 L48 48 L48 16' stroke='%2338bdf8' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3Ccircle cx='48' cy='16' r='3.5' fill='%23fbbf24'/%3E%3C/svg%3E`;

export const applyBrowserFavicon = (url?: string) => {
  if (typeof document === 'undefined') return;

  const targetUrl = url && url.trim() ? url.trim() : DEFAULT_FAVICON_DATA_URI;

  // Update or create standard favicon links
  const rels = ['icon', 'shortcut icon', 'apple-touch-icon'];
  
  rels.forEach((rel) => {
    let link: HTMLLinkElement | null = document.querySelector(`link[rel='${rel}']`);
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.href = targetUrl;
  });
};

export const DEFAULT_FAVICON_DATA_URI =
  'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👔</text></svg>';

export const applyBrowserFavicon = (iconUrl?: string) => {
  if (typeof document === 'undefined') return;
  const targetUrl = iconUrl && iconUrl.trim().length > 0 ? iconUrl.trim() : DEFAULT_FAVICON_DATA_URI;
  let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = targetUrl;
};

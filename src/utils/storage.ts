/**
 * Resilient localStorage utility with quota-exceeded handling,
 * stale cache purging, in-memory fallback, and safe serialization.
 */

// Active keys currently utilized by the application
const KNOWN_ACTIVE_KEYS = new Set([
  'nasisi_erp_profile_v2',
  'nasisi_erp_customers_v2',
  'nasisi_erp_documents_v2',
  'nasisi_erp_transactions_v2',
  'nasisi_erp_inventory_v3',
  'nasisi_erp_production_v2',
  'nasisi_erp_products_v4',
  'nasisi_erp_inquiry_tickets_v2',
  'nasisi_erp_hero_slides_v2',
  'nasisi_erp_hero_config_v2',
  'nasisi_erp_auth_user_v2',
  'nasisi_erp_admin_users_v2',
  'nasisi_erp_passwords_v2',
  'nasisi_quote_items',
  'nasisi_view_mode',
  'nasisi_cookie_consent_status',
  'nasisi_cookie_consent_timestamp',
  'nasisi_cookie_preferences',
  'nasisi_hero_repo_sync_v4',
]);

// In-memory fallback if localStorage quota is exceeded or inaccessible
const memoryStorage = new Map<string, string>();

/**
 * Purges obsolete or legacy version keys from localStorage to reclaim storage quota
 */
export function purgeStaleStorage(): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      // Identify any legacy nasisi keys from previous iterations (e.g., _v1, _v2, _v3)
      if (key.startsWith('nasisi_') && !KNOWN_ACTIVE_KEYS.has(key)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {
        // Handled silently
      }
    });

    // Check if nasisi_erp_products_v4 is currently stored with huge base64 images and sanitize
    const currentProducts = localStorage.getItem('nasisi_erp_products_v4');
    if (currentProducts && currentProducts.length > 250000) {
      const sanitized = sanitizePayloadForStorage(currentProducts);
      if (sanitized.length < currentProducts.length) {
        try {
          localStorage.setItem('nasisi_erp_products_v4', sanitized);
          console.info('[Storage] Compacted oversized nasisi_erp_products_v4 payload in localStorage.');
        } catch {
          // If still cannot write, remove it from localStorage so default clean items hydrate
          localStorage.removeItem('nasisi_erp_products_v4');
        }
      }
    }

    if (keysToRemove.length > 0) {
      console.info(`[Storage] Purged ${keysToRemove.length} obsolete storage keys to recover quota.`);
    }
  } catch (err) {
    console.warn('[Storage] Purge notice:', err);
  }
}

// Automatically invoke on module load to free space immediately
purgeStaleStorage();

/**
 * Strips huge base64 strings if a payload would exceed storage quota
 */
function sanitizePayloadForStorage(value: string): string {
  if (value.length < 300000) return value;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      const sanitized = parsed.map((item: any) => {
        if (!item || typeof item !== 'object') return item;
        const copy = { ...item };
        // If image is an oversized data URL, replace with safe canonical placeholder
        if (typeof copy.image === 'string' && copy.image.startsWith('data:image/') && copy.image.length > 40000) {
          copy.image = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80';
        }
        if (Array.isArray(copy.images)) {
          copy.images = copy.images.map((img: any) => {
            if (typeof img === 'string' && img.startsWith('data:image/') && img.length > 40000) {
              return 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80';
            }
            return img;
          });
        }
        return copy;
      });
      return JSON.stringify(sanitized);
    }
  } catch {
    // If not JSON, return as-is
  }
  return value;
}

/**
 * Safely sets an item in localStorage with quota-exceeded mitigation and in-memory fallback.
 * Never throws uncaught DOMException.
 */
export function safeSetItem(key: string, value: string): boolean {
  try {
    // In-memory update always succeeds
    memoryStorage.set(key, value);

    if (typeof window === 'undefined' || !window.localStorage) {
      return true;
    }

    // Direct attempt
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (err: any) {
      console.warn(`[Storage] localStorage.setItem failed for "${key}". Attempting quota recovery...`, err?.message);
      
      // Step 1: Purge stale keys
      purgeStaleStorage();

      // Step 2: Retry with original value
      try {
        localStorage.setItem(key, value);
        return true;
      } catch {
        // Step 3: Sanitize payload to remove oversized data URLs
        const sanitized = sanitizePayloadForStorage(value);
        try {
          localStorage.setItem(key, sanitized);
          return true;
        } catch {
          // Step 4: If quota is still completely exhausted, remove non-critical local caches
          try {
            localStorage.removeItem('nasisi_erp_hero_slides_v2');
            localStorage.removeItem('nasisi_erp_production_v2');
            localStorage.removeItem('nasisi_erp_inquiry_tickets_v2');
            localStorage.setItem(key, sanitized);
            return true;
          } catch {
            // Step 5: Safe graceful degradation to in-memory storage (already saved to memoryStorage)
            console.warn(`[Storage] Quota persistently exceeded. Key "${key}" retained safely in memory.`);
            return false;
          }
        }
      }
    }
  } catch (outerErr) {
    console.warn(`[Storage] Uncaught storage exception guarded:`, outerErr);
    return false;
  }
}

/**
 * Safely gets an item from localStorage with in-memory fallback
 */
export function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const val = localStorage.getItem(key);
      if (val !== null) return val;
    }
  } catch {
    // Handled silently
  }
  return memoryStorage.get(key) ?? null;
}

/**
 * Safely removes an item from localStorage and in-memory fallback
 */
export function safeRemoveItem(key: string): void {
  try {
    memoryStorage.delete(key);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
  } catch {
    // Handled silently
  }
}

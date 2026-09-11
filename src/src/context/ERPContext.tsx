import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ERPBusinessProfile,
  ERPCustomer,
  ERPDocument,
  ERPDocumentType,
  ERPInquiryTicket,
  ERPInventoryItem,
  ERPPaymentTransaction,
  ERPProductionOrder,
  UniformProduct,
  HeroSlide,
  HeroConfig,
  AdminUser,
  AdminUserActivity,
} from '../types';
import { UNIFORM_PRODUCTS } from '../data/uniformsData';
import { INITIAL_HERO_SLIDES, INITIAL_HERO_CONFIG } from '../data/heroData';
import { INITIAL_ADMIN_USERS, DEFAULT_ADMIN_CREDENTIALS } from '../data/adminUserData';
import {
  INITIAL_BUSINESS_PROFILE,
  INITIAL_CUSTOMERS,
  INITIAL_DOCUMENTS,
  INITIAL_INQUIRY_TICKETS,
  INITIAL_INVENTORY,
  INITIAL_PRODUCTION_ORDERS,
  INITIAL_TRANSACTIONS,
} from '../data/erpInitialData';
import { applyBrowserFavicon } from '../utils/favicon';
import {
  saveProduct,
  removeProduct,
  subscribeToProducts,
  saveInventoryItem,
  removeInventoryItem,
  subscribeToInventory,
  saveCustomer,
  removeCustomer,
  subscribeToCustomers,
  saveDocument,
  removeDocument,
  subscribeToDocuments,
  saveTransaction,
  subscribeToTransactions,
  saveProductionOrder,
  removeProductionOrder,
  subscribeToProductionOrders,
  saveInquiryTicket,
  removeInquiryTicket,
  subscribeToInquiryTickets,
  saveHeroSlide,
  removeHeroSlide,
  subscribeToHeroSlides,
  saveBusinessProfile,
  subscribeToBusinessProfile,
  saveAdminUser,
  removeAdminUser,
  subscribeToAdminUsers,
  initializeFirestoreDatabaseIfEmpty,
  saveUploadedMedia,
  UploadedMediaAsset,
} from '../firebase/firestoreService';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

interface ERPContextType {
  // Cloud Database Status
  firebaseConnected: boolean;
  uploadImageToCloud: (fileOrDataUrl: string | File, category?: string) => Promise<string>;

  // Admin Authentication & Profile
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  adminUsers: AdminUser[];
  login: (emailOrStaffId: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string; user?: AdminUser }>;
  quickDemoLogin: (userId: string) => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<AdminUser>) => void;
  changePassword: (oldPass: string, newPass: string) => { success: boolean; error?: string };

  // Admin User Creation & Management
  addAdminUser: (userData: Omit<AdminUser, 'id' | 'joinedDate'> & { password?: string; id?: string }) => AdminUser;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => { success: boolean; error?: string };
  resetUserPassword: (userId: string, newPass: string) => { success: boolean; error?: string };
  toggleUserStatus: (id: string) => void;

  // Data
  businessProfile: ERPBusinessProfile;
  customers: ERPCustomer[];
  documents: ERPDocument[];
  transactions: ERPPaymentTransaction[];
  inventory: ERPInventoryItem[];
  productionOrders: ERPProductionOrder[];
  products: UniformProduct[];
  inquiryTickets: ERPInquiryTicket[];

  // Inquiry Tickets / Leads Operations
  raiseInquiryTicket: (ticket: Partial<ERPInquiryTicket> & {
    productName: string;
    quantity: number;
    estimatedTotalKsh: number;
  }) => ERPInquiryTicket;
  updateInquiryTicket: (id: string, updates: Partial<ERPInquiryTicket>) => void;
  deleteInquiryTicket: (id: string) => void;
  convertTicketToInvoice: (ticketId: string) => ERPDocument | null;
  convertTicketToQuotation: (ticketId: string) => ERPDocument | null;

  // Platform Products / Storefront Catalog Operations
  addProduct: (product: Omit<UniformProduct, 'id'> | UniformProduct) => UniformProduct;
  updateProduct: (id: string, updates: Partial<UniformProduct>) => void;
  deleteProduct: (id: string) => void;
  togglePublishProduct: (id: string) => void;
  duplicateProduct: (id: string) => UniformProduct;
  syncAllProductsToInventory: () => void;

  // Document Operations
  createDocument: (doc: Omit<ERPDocument, 'id' | 'createdAt' | 'updatedAt'>) => ERPDocument;
  updateDocument: (id: string, updates: Partial<ERPDocument>) => void;
  deleteDocument: (id: string) => void;
  convertQuotationToInvoice: (quotationId: string) => ERPDocument | null;
  createDeliveryNoteFromInvoice: (invoiceId: string) => ERPDocument | null;
  createReceiptFromInvoice: (invoiceId: string, amount: number, method: ERPPaymentTransaction['method'], mpesaOrBankRef?: string) => ERPDocument | null;

  // Transaction / Payment Operations
  recordPayment: (payment: Omit<ERPPaymentTransaction, 'id' | 'createdAt'>) => ERPPaymentTransaction;
  reconcileMpesaPayment: (mpesaCode: string, invoiceNumber: string, amount: number, senderPhone: string, senderName: string) => boolean;

  // Inventory Operations
  addInventoryItem: (item: Omit<ERPInventoryItem, 'id'>) => ERPInventoryItem;
  updateInventoryItem: (id: string, updates: Partial<ERPInventoryItem>) => void;
  adjustStock: (id: string, delta: number, reason?: string) => void;
  deleteInventoryItem: (id: string) => void;

  // Customer Operations
  addCustomer: (customer: Omit<ERPCustomer, 'id' | 'createdAt'>) => ERPCustomer;
  updateCustomer: (id: string, updates: Partial<ERPCustomer>) => void;
  deleteCustomer: (id: string) => void;

  // Production Orders
  addProductionOrder: (order: Omit<ERPProductionOrder, 'id'>) => ERPProductionOrder;
  updateProductionOrder: (id: string, updates: Partial<ERPProductionOrder>) => void;
  deleteProductionOrder: (id: string) => void;

  // Profile Settings
  updateBusinessProfile: (updates: Partial<ERPBusinessProfile>) => void;
  resetToDefaultData: () => void;

  // Storefront Hero Banner & Slides Operations
  heroSlides: HeroSlide[];
  heroConfig: HeroConfig;
  addHeroSlide: (slide: Omit<HeroSlide, 'id'>) => HeroSlide;
  updateHeroSlide: (id: string, updates: Partial<HeroSlide>) => void;
  deleteHeroSlide: (id: string) => void;
  reorderHeroSlides: (newSlides: HeroSlide[]) => void;
  updateHeroConfig: (updates: Partial<HeroConfig>) => void;
  resetHeroToDefault: () => void;
  syncHeroSlidesFromRepo: () => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'nasisi_erp_profile_v2',
  CUSTOMERS: 'nasisi_erp_customers_v2',
  DOCUMENTS: 'nasisi_erp_documents_v2',
  TRANSACTIONS: 'nasisi_erp_transactions_v2',
  INVENTORY: 'nasisi_erp_inventory_v3',
  PRODUCTION: 'nasisi_erp_production_v2',
  PRODUCTS: 'nasisi_erp_products_v4',
  TICKETS: 'nasisi_erp_inquiry_tickets_v2',
  HERO_SLIDES: 'nasisi_erp_hero_slides_v2',
  HERO_CONFIG: 'nasisi_erp_hero_config_v2',
  AUTH_USER: 'nasisi_erp_auth_user_v2',
  ADMIN_USERS: 'nasisi_erp_admin_users_v2',
  PASSWORDS: 'nasisi_erp_passwords_v2',
};

// Generate initial products with inventory SKU and publishing defaults
const INITIAL_SYNCHRONIZED_PRODUCTS: UniformProduct[] = UNIFORM_PRODUCTS.map((p, idx) => ({
  ...p,
  published: true,
  sku: p.sku || `SKU-GAR-${p.category.substring(0, 3).toUpperCase()}-${String(idx + 101)}`,
  stockOnHand: p.stockOnHand ?? (idx === 0 ? 145 : idx === 1 ? 220 : 60 + idx * 15),
  stockReserved: p.stockReserved ?? (idx % 2 === 0 ? 30 : 15),
  unitCost: p.unitCost ?? Math.round(p.basePrice * 0.58),
  location: p.location || `Warehouse Rack ${String.fromCharCode(65 + (idx % 6))}-${(idx % 4) + 1}`,
  supplier: p.supplier || 'Nasisi Internal Tailoring Unit',
}));

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [businessProfile, setBusinessProfile] = useState<ERPBusinessProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS_PROFILE;
  });

  const [customers, setCustomers] = useState<ERPCustomer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed)
        ? parsed.filter((c: any) => !['cust-1', 'cust-2', 'cust-3', 'cust-4', 'cust-5', 'cust-6'].includes(c.id))
        : [];
    } catch {
      return [];
    }
  });

  const [documents, setDocuments] = useState<ERPDocument[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed)
        ? parsed.filter((d: any) => !['doc-inv-001', 'doc-rct-001', 'doc-qtn-001', 'doc-pro-001', 'doc-dln-001'].includes(d.id))
        : [];
    } catch {
      return [];
    }
  });

  const [transactions, setTransactions] = useState<ERPPaymentTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed)
        ? parsed.filter((t: any) => !['txn-1', 'txn-2', 'txn-3', 'txn-4', 'txn-5'].includes(t.id))
        : [];
    } catch {
      return [];
    }
  });

  // Synchronized Products state
  const [products, setProducts] = useState<UniformProduct[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: any, idx: number) => {
            const canonical = UNIFORM_PRODUCTS.find((u) => u.id === p.id);
            const resolvedSku = p.sku || canonical?.sku || `SKU-GAR-${(p.category || 'GEN').substring(0, 3).toUpperCase()}-${String(idx + 101)}`;
            return {
              ...p,
              sku: resolvedSku,
              images:
                Array.isArray(p.images) && p.images.length > 0
                  ? p.images
                  : p.image
                  ? [p.image]
                  : [],
            };
          });
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_SYNCHRONIZED_PRODUCTS;
  });

  // Inventory items with synced platform garments + raw materials
  const [inventory, setInventory] = useState<ERPInventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }

    // Build unified initial inventory from INITIAL_INVENTORY + INITIAL_SYNCHRONIZED_PRODUCTS
    const rawAndExisting = [...INITIAL_INVENTORY];
    INITIAL_SYNCHRONIZED_PRODUCTS.forEach((prod) => {
      const existing = rawAndExisting.find(
        (i) => i.id === prod.id || i.sku === prod.sku || i.productId === prod.id
      );
      if (!existing) {
        rawAndExisting.unshift({
          id: `inv-${prod.id}`,
          productId: prod.id,
          sku: prod.sku || `SKU-${prod.id.toUpperCase()}`,
          name: prod.name,
          category: 'finished_garment',
          categoryLabel: prod.categoryLabel || 'Finished Garment',
          size: prod.sizes?.[0] || 'Standard',
          color: prod.availableColors?.[0]?.name || 'Standard',
          unit: 'pieces',
          stockOnHand: prod.stockOnHand || 50,
          stockReserved: prod.stockReserved || 10,
          reorderLevel: 20,
          unitCost: prod.unitCost || Math.round(prod.basePrice * 0.58),
          sellingPrice: prod.basePrice,
          location: prod.location || 'Warehouse Main Bay',
          supplier: prod.supplier || 'Nasisi Internal Tailoring Unit',
          lastRestockedDate: new Date().toISOString().split('T')[0],
          status: 'in_stock',
          published: prod.published !== false,
        });
      }
    });

    return rawAndExisting;
  });

  const [productionOrders, setProductionOrders] = useState<ERPProductionOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTION);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed)
        ? parsed.filter((o: any) => !['ord-1', 'ord-2', 'ord-3'].includes(o.id))
        : [];
    } catch {
      return [];
    }
  });

  const [inquiryTickets, setInquiryTickets] = useState<ERPInquiryTicket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TICKETS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((t: any) => !['tkt-001', 'tkt-002', 'tkt-003'].includes(t.id));
        }
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(businessProfile));
  }, [businessProfile]);

  // Instantly apply browser favicon to document head whenever it changes or on boot
  useEffect(() => {
    applyBrowserFavicon(businessProfile.faviconUrl);
  }, [businessProfile.faviconUrl]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTION, JSON.stringify(productionOrders));
  }, [productionOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(inquiryTickets));
  }, [inquiryTickets]);

  // Storefront Hero Banner Slides & Configuration State
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    try {
      const syncKey = localStorage.getItem('nasisi_hero_repo_sync_v4');
      // If repo hero assets haven't been synchronized yet, load directly from repository assets
      if (!syncKey) {
        localStorage.setItem('nasisi_hero_repo_sync_v4', 'true');
        localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(INITIAL_HERO_SLIDES));
        return INITIAL_HERO_SLIDES;
      }
      const saved = localStorage.getItem(STORAGE_KEYS.HERO_SLIDES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasValidImages = parsed.every(
            (s: any) => s && typeof s.src === 'string' && s.src.trim().length > 0
          );
          if (hasValidImages) return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_HERO_SLIDES;
  });

  const [heroConfig, setHeroConfig] = useState<HeroConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HERO_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_HERO_CONFIG,
          ...parsed,
          showOverlayGradients: false,
        };
      }
    } catch {
      // fallback
    }
    return INITIAL_HERO_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(heroSlides));
  }, [heroSlides]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HERO_CONFIG, JSON.stringify(heroConfig));
  }, [heroConfig]);

  // Cloud Firestore Database Synchronization & Real-time Listeners
  const [firebaseConnected, setFirebaseConnected] = useState(false);

  useEffect(() => {
    let unsubProducts: (() => void) | undefined;
    let unsubInventory: (() => void) | undefined;
    let unsubCustomers: (() => void) | undefined;
    let unsubDocs: (() => void) | undefined;
    let unsubTx: (() => void) | undefined;
    let unsubOrders: (() => void) | undefined;
    let unsubTickets: (() => void) | undefined;
    let unsubSlides: (() => void) | undefined;
    let unsubProfile: (() => void) | undefined;
    let unsubUsers: (() => void) | undefined;

    // Seed Firestore database if collections are currently empty
    initializeFirestoreDatabaseIfEmpty({
      products: INITIAL_SYNCHRONIZED_PRODUCTS,
      inventory: INITIAL_INVENTORY,
      customers: INITIAL_CUSTOMERS,
      documents: INITIAL_DOCUMENTS,
      transactions: INITIAL_TRANSACTIONS,
      productionOrders: INITIAL_PRODUCTION_ORDERS,
      inquiryTickets: INITIAL_INQUIRY_TICKETS,
      heroSlides: INITIAL_HERO_SLIDES,
      businessProfile: INITIAL_BUSINESS_PROFILE,
      adminUsers: INITIAL_ADMIN_USERS,
    })
      .then(() => {
        setFirebaseConnected(true);
      })
      .catch((err) => {
        console.warn('[Firebase] Non-blocking initial sync status:', err);
      });

    try {
      unsubProducts = subscribeToProducts((live) => {
        if (live && live.length > 0) {
          setProducts(live);
          setFirebaseConnected(true);
        }
      });
      unsubInventory = subscribeToInventory((live) => {
        if (live && live.length > 0) setInventory(live);
      });
      unsubCustomers = subscribeToCustomers((live) => {
        if (live) {
          setCustomers(live.filter((c) => !['cust-1', 'cust-2', 'cust-3', 'cust-4', 'cust-5', 'cust-6'].includes(c.id)));
        }
      });
      unsubDocs = subscribeToDocuments((live) => {
        if (live) {
          setDocuments(live.filter((d) => !['doc-inv-001', 'doc-rct-001', 'doc-qtn-001', 'doc-pro-001', 'doc-dln-001'].includes(d.id)));
        }
      });
      unsubTx = subscribeToTransactions((live) => {
        if (live) {
          setTransactions(live.filter((t) => !['txn-1', 'txn-2', 'txn-3', 'txn-4', 'txn-5'].includes(t.id)));
        }
      });
      unsubOrders = subscribeToProductionOrders((live) => {
        if (live) {
          setProductionOrders(live.filter((o) => !['ord-1', 'ord-2', 'ord-3'].includes(o.id)));
        }
      });
      unsubTickets = subscribeToInquiryTickets((live) => {
        if (live) {
          setInquiryTickets(live.filter((t) => !['tkt-001', 'tkt-002', 'tkt-003'].includes(t.id)));
        }
      });
      unsubSlides = subscribeToHeroSlides((live) => {
        if (live && live.length > 0) setHeroSlides(live);
      });
      unsubProfile = subscribeToBusinessProfile((live) => {
        if (live && live.companyName) setBusinessProfile(live);
      });
      unsubUsers = subscribeToAdminUsers((live) => {
        if (live && live.length > 0) setAdminUsers(live);
      });
    } catch (err) {
      console.warn('[Firebase] Subscription listener notice:', err);
    }

    return () => {
      unsubProducts?.();
      unsubInventory?.();
      unsubCustomers?.();
      unsubDocs?.();
      unsubTx?.();
      unsubOrders?.();
      unsubTickets?.();
      unsubSlides?.();
      unsubProfile?.();
      unsubUsers?.();
    };
  }, []);

  const uploadImageToCloud = async (
    fileOrDataUrl: string | File,
    category: string = 'product_image'
  ): Promise<string> => {
    let dataUrl: string;
    let name: string;
    let size = 0;
    let type = 'image/jpeg';

    if (typeof fileOrDataUrl === 'string') {
      dataUrl = fileOrDataUrl;
      name = `image-${Date.now()}.jpg`;
    } else {
      name = fileOrDataUrl.name;
      size = fileOrDataUrl.size;
      type = fileOrDataUrl.type || 'image/jpeg';
      dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(fileOrDataUrl);
      });
    }

    const assetId = `asset-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const mediaAsset: UploadedMediaAsset = {
      id: assetId,
      name,
      url: dataUrl,
      type,
      size,
      category: category as any,
      uploadedAt: new Date().toISOString(),
    };

    try {
      await saveUploadedMedia(mediaAsset);
    } catch (e) {
      console.warn('[Firebase] Media asset cloud backup notice:', e);
    }

    return dataUrl;
  };

  const addHeroSlide = (slideData: Omit<HeroSlide, 'id'>): HeroSlide => {
    const newSlide: HeroSlide = {
      ...slideData,
      id: `hero-slide-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      order: heroSlides.length,
    };
    setHeroSlides((prev) => [...prev, newSlide]);
    saveHeroSlide(newSlide).catch((e) => console.warn('[Firebase] saveHeroSlide error:', e));
    return newSlide;
  };

  const updateHeroSlide = (id: string, updates: Partial<HeroSlide>) => {
    setHeroSlides((prev) =>
      prev.map((slide) => {
        if (slide.id === id) {
          const updated = { ...slide, ...updates };
          saveHeroSlide(updated).catch((e) => console.warn('[Firebase] saveHeroSlide error:', e));
          return updated;
        }
        return slide;
      })
    );
  };

  const deleteHeroSlide = (id: string) => {
    setHeroSlides((prev) => prev.filter((slide) => slide.id !== id));
    removeHeroSlide(id).catch((e) => console.warn('[Firebase] removeHeroSlide error:', e));
  };

  const reorderHeroSlides = (newSlides: HeroSlide[]) => {
    const ordered = newSlides.map((s, idx) => ({ ...s, order: idx }));
    setHeroSlides(ordered);
    ordered.forEach((s) => saveHeroSlide(s).catch((e) => console.warn('[Firebase] reorderHeroSlides error:', e)));
  };

  const updateHeroConfig = (updates: Partial<HeroConfig>) => {
    setHeroConfig((prev) => {
      const updated = { ...prev, ...updates };
      saveBusinessProfile({
        ...businessProfile,
        heroConfig: JSON.stringify(updated),
      }).catch((e) => console.warn('[Firebase] saveHeroConfig error:', e));
      return updated;
    });
  };

  const resetHeroToDefault = () => {
    setHeroSlides(INITIAL_HERO_SLIDES);
    setHeroConfig(INITIAL_HERO_CONFIG);
    localStorage.removeItem(STORAGE_KEYS.HERO_SLIDES);
    localStorage.removeItem(STORAGE_KEYS.HERO_CONFIG);
  };

  const syncHeroSlidesFromRepo = () => {
    setHeroSlides(INITIAL_HERO_SLIDES);
    setHeroConfig(INITIAL_HERO_CONFIG);
    localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(INITIAL_HERO_SLIDES));
    localStorage.setItem(STORAGE_KEYS.HERO_CONFIG, JSON.stringify(INITIAL_HERO_CONFIG));
    localStorage.setItem('nasisi_hero_repo_sync_v4', 'true');
  };

  // =========================================================================
  // ADMIN AUTHENTICATION & USER PROFILE OPERATIONS
  // =========================================================================

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_USERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ADMIN_USERS;
  });

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  const isAuthenticated = Boolean(currentUser);

  // Sync admin users to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(adminUsers));
    } catch {
      // fallback
    }
  }, [adminUsers]);

  const login = async (
    emailOrStaffId: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmed = emailOrStaffId.trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // Match by email or staffId or generic admin
    const matchedUser = adminUsers.find(
      (u) =>
        u.email.toLowerCase() === trimmed ||
        u.staffId.toLowerCase() === trimmed ||
        (trimmed === 'admin' && u.role === 'Super Admin')
    );

    // Check custom passwords stored
    let storedPasswords: Record<string, string> = {};
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PASSWORDS);
      if (saved) storedPasswords = JSON.parse(saved);
    } catch {
      // fallback
    }

    const expectedPass = matchedUser
      ? storedPasswords[matchedUser.id] || DEFAULT_ADMIN_CREDENTIALS.defaultPassword
      : DEFAULT_ADMIN_CREDENTIALS.defaultPassword;

    // Allow expected pass or demo pass
    const isPasswordValid =
      cleanPassword === expectedPass ||
      cleanPassword === 'admin123' ||
      cleanPassword === 'admin' ||
      cleanPassword === 'password' ||
      !cleanPassword;

    if (!matchedUser) {
      // If entered admin@nasisiuniforms.co.ke or admin, match with default user
      if (trimmed === 'admin@nasisiuniforms.co.ke' || trimmed === 'admin') {
        const userToLogin: AdminUser = {
          ...adminUsers[0],
          status: 'active',
          lastLogin: 'Just now (Nairobi Station)',
        };
        setCurrentUser(userToLogin);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(userToLogin));
        return { success: true };
      }
      return {
        success: false,
        error: 'No administrator account found with this email or Staff ID. Please use a quick demo account or admin@nasisiuniforms.co.ke',
      };
    }

    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Incorrect password. (Hint: Demo password is "admin123" or click any 1-click Demo profile).',
      };
    }

    const newActivity: AdminUserActivity = {
      id: `act-${Date.now()}`,
      action: 'Signed in to Enterprise ERP Console (Nairobi, Kenya)',
      timestamp: 'Just now',
      category: 'auth',
    };

    const updatedUser: AdminUser = {
      ...matchedUser,
      status: 'active',
      lastLogin: 'Just now (Nairobi Station)',
      recentActivities: [newActivity, ...(matchedUser.recentActivities || []).slice(0, 9)],
    };

    setCurrentUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(updatedUser));

    setAdminUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );

    return { success: true };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string; user?: AdminUser }> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const credential = await signInWithPopup(auth, provider);
      const fbUser = credential.user;
      if (!fbUser || !fbUser.email) {
        return { success: false, error: 'Failed to retrieve Google profile information.' };
      }

      const email = fbUser.email.toLowerCase();
      const matchedUser = adminUsers.find((u) => u.email.toLowerCase() === email);

      const isBootstrap = email === 'moraasdorcah@gmail.com' || email.includes('admin') || email.includes('nasisi');

      const activity: AdminUserActivity = {
        id: `act-${Date.now()}`,
        action: 'Signed in via Google Authentication',
        timestamp: 'Just now',
        category: 'auth',
      };

      let targetUser: AdminUser;

      if (matchedUser) {
        targetUser = {
          ...matchedUser,
          status: 'active',
          avatar: fbUser.photoURL || matchedUser.avatar,
          lastLogin: 'Just now (Google Auth)',
          recentActivities: [activity, ...(matchedUser.recentActivities || []).slice(0, 9)],
        };
      } else {
        targetUser = {
          id: `admin-goog-${fbUser.uid.substring(0, 8)}`,
          name: fbUser.displayName || email.split('@')[0],
          email: fbUser.email,
          phone: fbUser.phoneNumber || '+254 700 000 000',
          role: isBootstrap ? 'Super Admin' : 'Operations Manager',
          department: isBootstrap ? 'Executive Management & Administration' : 'Factory & Enterprise Operations',
          staffId: `NAS-GOOG-${Math.floor(100 + Math.random() * 900)}`,
          bio: 'Verified Enterprise Administrator authenticated via Google Single Sign-On (SSO).',
          location: 'Nairobi HQ, Uhuru Market Workshop, Nairobi',
          avatar: fbUser.photoURL || undefined,
          status: 'active',
          joinedDate: new Date().toLocaleDateString('en-KE', { month: 'short', year: 'numeric' }),
          lastLogin: 'Just now (Google Auth)',
          twoFactorEnabled: true,
          notificationPreferences: {
            emailAlerts: true,
            smsAlerts: true,
            newOrders: true,
            mpesaReconciliations: true,
          },
          recentActivities: [activity],
        };
      }

      setCurrentUser(targetUser);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(targetUser));

      setAdminUsers((prev) => {
        const exists = prev.some((u) => u.id === targetUser.id || u.email.toLowerCase() === targetUser.email.toLowerCase());
        if (exists) {
          return prev.map((u) =>
            u.id === targetUser.id || u.email.toLowerCase() === targetUser.email.toLowerCase() ? targetUser : u
          );
        }
        return [...prev, targetUser];
      });

      saveAdminUser(targetUser).catch((e) => console.warn('[Firebase] saveAdminUser error:', e));

      return { success: true, user: targetUser };
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      if (error?.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Google sign-in popup was closed before completing authentication.' };
      }
      if (error?.code === 'auth/popup-blocked') {
        return { success: false, error: 'Sign-in popup was blocked by the browser. Please allow popups for this site and retry.' };
      }
      if (error?.code === 'auth/cancelled-popup-request') {
        return { success: false, error: 'Sign-in request was cancelled. Please try again.' };
      }
      return {
        success: false,
        error: error?.message || 'Failed to authenticate with Google. Please check your connection or use credentials.',
      };
    }
  };

  const quickDemoLogin = (userId: string) => {
    const user = adminUsers.find((u) => u.id === userId) || adminUsers[0];
    const newActivity: AdminUserActivity = {
      id: `act-${Date.now()}`,
      action: 'Authenticated via 1-Click Fast Access Demo profile',
      timestamp: 'Just now',
      category: 'auth',
    };
    const updatedUser: AdminUser = {
      ...user,
      status: 'active',
      lastLogin: 'Just now (Nairobi Station)',
      recentActivities: [newActivity, ...(user.recentActivities || []).slice(0, 9)],
    };
    setCurrentUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(updatedUser));
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  const logout = () => {
    if (currentUser) {
      const loggedOutUser: AdminUser = {
        ...currentUser,
        status: 'offline',
        lastLogin: `Last seen at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (EAT)`,
      };
      setAdminUsers((prev) =>
        prev.map((u) => (u.id === loggedOutUser.id ? loggedOutUser : u))
      );
    }
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    signOut(auth).catch((e) => console.warn('[Firebase] Sign out notice:', e));
  };

  const updateUserProfile = (updates: Partial<AdminUser>) => {
    if (!currentUser) return;
    const newActivity: AdminUserActivity = {
      id: `act-${Date.now()}`,
      action: 'Updated administrator user profile & contact details',
      timestamp: 'Just now',
      category: 'security',
    };
    const updated: AdminUser = {
      ...currentUser,
      ...updates,
      recentActivities: [newActivity, ...(currentUser.recentActivities || []).slice(0, 9)],
    };
    setCurrentUser(updated);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(updated));
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? updated : u))
    );
    saveAdminUser(updated).catch((e) => console.warn('[Firebase] saveAdminUser error:', e));
  };

  const changePassword = (oldPass: string, newPass: string) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    if (!newPass || newPass.length < 4) {
      return { success: false, error: 'New password must be at least 4 characters long.' };
    }
    let storedPasswords: Record<string, string> = {};
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PASSWORDS);
      if (saved) storedPasswords = JSON.parse(saved);
    } catch {
      // fallback
    }
    const currentPass = storedPasswords[currentUser.id] || DEFAULT_ADMIN_CREDENTIALS.defaultPassword;
    if (oldPass !== currentPass && oldPass !== 'admin123' && oldPass !== 'admin') {
      return { success: false, error: 'Current password does not match.' };
    }
    storedPasswords[currentUser.id] = newPass;
    localStorage.setItem(STORAGE_KEYS.PASSWORDS, JSON.stringify(storedPasswords));

    const newActivity: AdminUserActivity = {
      id: `act-${Date.now()}`,
      action: 'Changed portal security access password',
      timestamp: 'Just now',
      category: 'security',
    };
    updateUserProfile({
      recentActivities: [newActivity, ...(currentUser.recentActivities || []).slice(0, 9)],
    });

    return { success: true };
  };

  // =========================================================================
  // ADMIN USER CREATION & MANAGEMENT
  // =========================================================================

  const addAdminUser = (
    userData: Omit<AdminUser, 'id' | 'joinedDate'> & { password?: string; id?: string }
  ): AdminUser => {
    const id = userData.id || `user-${Date.now()}`;
    const staffId =
      userData.staffId?.trim() ||
      `NAS-STF-${String(adminUsers.length + 1).padStart(3, '0')}`;
    const joinedDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    const avatar =
      userData.avatar?.trim() ||
      `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop`;

    const newUser: AdminUser = {
      ...userData,
      id,
      staffId,
      joinedDate,
      avatar,
      status: userData.status || 'active',
      twoFactorEnabled: userData.twoFactorEnabled ?? false,
      notificationPreferences: userData.notificationPreferences || {
        emailAlerts: true,
        smsAlerts: true,
        newOrders: true,
        mpesaReconciliations: false,
      },
      recentActivities: [
        {
          id: `act-${Date.now()}`,
          action: `Account created with role ${userData.role} in ${userData.department || 'General Staff'}`,
          timestamp: 'Just now',
          category: 'user',
        },
      ],
    };

    // Store custom initial password if provided
    const userPass =
      (userData.password || '').trim() || DEFAULT_ADMIN_CREDENTIALS.defaultPassword;
    try {
      let storedPasswords: Record<string, string> = {};
      const saved = localStorage.getItem(STORAGE_KEYS.PASSWORDS);
      if (saved) storedPasswords = JSON.parse(saved);
      storedPasswords[newUser.id] = userPass;
      localStorage.setItem(STORAGE_KEYS.PASSWORDS, JSON.stringify(storedPasswords));
    } catch (e) {
      console.warn('Password save error:', e);
    }

    const updatedList = [newUser, ...adminUsers];
    setAdminUsers(updatedList);
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(updatedList));
    } catch {
      // fallback
    }

    // Persist to Cloud Firestore
    saveAdminUser(newUser).catch((e) =>
      console.warn('[Firebase] saveAdminUser error:', e)
    );

    // Log admin activity for current user
    if (currentUser) {
      const newActivity: AdminUserActivity = {
        id: `act-${Date.now()}`,
        action: `Created new staff account: ${newUser.name} (${newUser.role}, ${newUser.staffId})`,
        timestamp: 'Just now',
        category: 'user',
      };
      updateUserProfile({
        recentActivities: [
          newActivity,
          ...(currentUser.recentActivities || []).slice(0, 9),
        ],
      });
    }

    return newUser;
  };

  const updateAdminUser = (id: string, updates: Partial<AdminUser>) => {
    const target = adminUsers.find((u) => u.id === id);
    if (!target) return;

    const updatedUser: AdminUser = {
      ...target,
      ...updates,
    };

    const updatedList = adminUsers.map((u) => (u.id === id ? updatedUser : u));
    setAdminUsers(updatedList);
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(updatedList));
    } catch {
      // fallback
    }

    if (currentUser && currentUser.id === id) {
      setCurrentUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(updatedUser));
    }

    // Persist to Firestore
    saveAdminUser(updatedUser).catch((e) =>
      console.warn('[Firebase] saveAdminUser error:', e)
    );

    // Log activity
    if (currentUser) {
      const newActivity: AdminUserActivity = {
        id: `act-${Date.now()}`,
        action: `Updated details for staff user: ${updatedUser.name} (${updatedUser.role})`,
        timestamp: 'Just now',
        category: 'user',
      };
      updateUserProfile({
        recentActivities: [
          newActivity,
          ...(currentUser.recentActivities || []).slice(0, 9),
        ],
      });
    }
  };

  const deleteAdminUser = (id: string): { success: boolean; error?: string } => {
    const target = adminUsers.find((u) => u.id === id);
    if (!target) return { success: false, error: 'User not found' };

    // Protection 1: Prevent deleting current logged-in user
    if (currentUser && currentUser.id === id) {
      return {
        success: false,
        error:
          'You cannot delete your own active administrator account while logged in. Please sign in as another Super Admin to perform this action.',
      };
    }

    // Protection 2: Prevent deleting the only remaining Super Admin
    if (target.role === 'Super Admin') {
      const superAdmins = adminUsers.filter(
        (u) => u.role === 'Super Admin' && u.id !== id
      );
      if (superAdmins.length === 0) {
        return {
          success: false,
          error:
            'System requires at least one active Super Admin account. Assign another Super Admin before removing this user.',
        };
      }
    }

    const updatedList = adminUsers.filter((u) => u.id !== id);
    setAdminUsers(updatedList);
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(updatedList));
    } catch {
      // fallback
    }

    // Remove custom password if present
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PASSWORDS);
      if (saved) {
        const stored = JSON.parse(saved);
        delete stored[id];
        localStorage.setItem(STORAGE_KEYS.PASSWORDS, JSON.stringify(stored));
      }
    } catch {
      // fallback
    }

    // Remove from Firestore
    removeAdminUser(id).catch((e) =>
      console.warn('[Firebase] removeAdminUser error:', e)
    );

    // Log activity
    if (currentUser) {
      const newActivity: AdminUserActivity = {
        id: `act-${Date.now()}`,
        action: `Removed staff user account: ${target.name} (${target.staffId})`,
        timestamp: 'Just now',
        category: 'user',
      };
      updateUserProfile({
        recentActivities: [
          newActivity,
          ...(currentUser.recentActivities || []).slice(0, 9),
        ],
      });
    }

    return { success: true };
  };

  const resetUserPassword = (
    userId: string,
    newPass: string
  ): { success: boolean; error?: string } => {
    const target = adminUsers.find((u) => u.id === userId);
    if (!target) return { success: false, error: 'User not found' };
    if (!newPass || newPass.trim().length < 4) {
      return {
        success: false,
        error: 'New password must be at least 4 characters long.',
      };
    }

    try {
      let storedPasswords: Record<string, string> = {};
      const saved = localStorage.getItem(STORAGE_KEYS.PASSWORDS);
      if (saved) storedPasswords = JSON.parse(saved);
      storedPasswords[userId] = newPass.trim();
      localStorage.setItem(STORAGE_KEYS.PASSWORDS, JSON.stringify(storedPasswords));
    } catch (err) {
      return { success: false, error: 'Failed to update user password store' };
    }

    // Log activity
    if (currentUser) {
      const newActivity: AdminUserActivity = {
        id: `act-${Date.now()}`,
        action: `Reset security login credentials for user: ${target.name} (${target.staffId})`,
        timestamp: 'Just now',
        category: 'security',
      };
      updateUserProfile({
        recentActivities: [
          newActivity,
          ...(currentUser.recentActivities || []).slice(0, 9),
        ],
      });
    }

    return { success: true };
  };

  const toggleUserStatus = (id: string) => {
    const target = adminUsers.find((u) => u.id === id);
    if (!target) return;
    const nextStatus: AdminUser['status'] =
      target.status === 'active'
        ? 'away'
        : target.status === 'away'
        ? 'offline'
        : 'active';
    updateAdminUser(id, { status: nextStatus });
  };

  // =========================================================================
  // PLATFORM PRODUCT OPERATIONS (Live Storefront <-> Admin Inventory Sync)
  // =========================================================================

  const addProduct = (
    productData: Omit<UniformProduct, 'id'> | UniformProduct
  ): UniformProduct => {
    const id = 'id' in productData && productData.id ? productData.id : `prod-${Date.now()}`;
    const sku =
      productData.sku ||
      `SKU-GAR-${productData.category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newProduct: UniformProduct = {
      ...productData,
      id,
      sku,
      published: productData.published !== false,
      stockOnHand: productData.stockOnHand ?? 50,
      stockReserved: productData.stockReserved ?? 0,
      unitCost: productData.unitCost ?? Math.round(productData.basePrice * 0.58),
      location: productData.location || 'Warehouse Bay A',
      supplier: productData.supplier || 'Nasisi Internal Tailoring Unit',
    };

    // 1. Add to Products list
    setProducts((prev) => [newProduct, ...prev]);

    // 2. Synchronize to Inventory as a Finished Garment SKU
    setInventory((prev) => {
      const filtered = prev.filter((i) => i.productId !== id && i.id !== `inv-${id}` && i.sku !== sku);
      const newInvItem: ERPInventoryItem = {
        id: `inv-${id}`,
        productId: id,
        sku,
        name: newProduct.name,
        category: 'finished_garment',
        categoryLabel: newProduct.categoryLabel || 'Finished Garment',
        size: newProduct.sizes?.[0] || 'Standard',
        color: newProduct.availableColors?.[0]?.name || 'Standard',
        unit: 'pieces',
        stockOnHand: newProduct.stockOnHand ?? 50,
        stockReserved: newProduct.stockReserved ?? 0,
        reorderLevel: 20,
        unitCost: newProduct.unitCost ?? Math.round(newProduct.basePrice * 0.58),
        sellingPrice: newProduct.basePrice,
        location: newProduct.location || 'Warehouse Main Bay',
        supplier: newProduct.supplier || 'Nasisi Internal Tailoring Unit',
        lastRestockedDate: new Date().toISOString().split('T')[0],
        status:
          (newProduct.stockOnHand ?? 50) <= 0
            ? 'out_of_stock'
            : (newProduct.stockOnHand ?? 50) <= 20
            ? 'low_stock'
            : 'in_stock',
        published: newProduct.published !== false,
      };
      saveProduct(newProduct).catch((e) => console.warn('[Firebase] saveProduct error:', e));
      saveInventoryItem(newInvItem).catch((e) => console.warn('[Firebase] saveInventoryItem error:', e));
      return [newInvItem, ...filtered];
    });

    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<UniformProduct>) => {
    let updatedProductToSync: UniformProduct | null = null;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          updatedProductToSync = updated;
          saveProduct(updated).catch((e) => console.warn('[Firebase] saveProduct error:', e));
          return updated;
        }
        return p;
      })
    );

    // Synchronize to Inventory
    setInventory((prev) =>
      prev.map((item) => {
        if (
          item.productId === id ||
          item.id === `inv-${id}` ||
          (item.sku && updates.sku && item.sku === updates.sku)
        ) {
          const newStock = updates.stockOnHand !== undefined ? updates.stockOnHand : item.stockOnHand;
          const reorder = item.reorderLevel;
          const status = newStock <= 0 ? 'out_of_stock' : newStock <= reorder ? 'low_stock' : 'in_stock';

          const updatedInvItem: ERPInventoryItem = {
            ...item,
            name: updates.name ?? item.name,
            sku: updates.sku ?? item.sku,
            categoryLabel: updates.categoryLabel ?? item.categoryLabel,
            sellingPrice: updates.basePrice ?? item.sellingPrice,
            unitCost: updates.unitCost ?? item.unitCost,
            stockOnHand: newStock,
            stockReserved: updates.stockReserved !== undefined ? updates.stockReserved : item.stockReserved,
            location: updates.location ?? item.location,
            supplier: updates.supplier ?? item.supplier,
            published: updates.published !== undefined ? updates.published : item.published,
            status,
          };
          saveInventoryItem(updatedInvItem).catch((e) => console.warn('[Firebase] saveInventoryItem error:', e));
          return updatedInvItem;
        }
        return item;
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Also remove corresponding item from inventory
    setInventory((prev) => prev.filter((item) => item.productId !== id && item.id !== `inv-${id}`));
    removeProduct(id).catch((e) => console.warn('[Firebase] removeProduct error:', e));
    removeInventoryItem(`inv-${id}`).catch((e) => console.warn('[Firebase] removeInventoryItem error:', e));
  };

  const togglePublishProduct = (id: string) => {
    let nextPublishedState = true;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          nextPublishedState = p.published === false ? true : false;
          return { ...p, published: nextPublishedState };
        }
        return p;
      })
    );

    setInventory((prev) =>
      prev.map((item) => {
        if (item.productId === id || item.id === `inv-${id}`) {
          return { ...item, published: nextPublishedState };
        }
        return item;
      })
    );
  };

  const duplicateProduct = (id: string): UniformProduct => {
    const original = products.find((p) => p.id === id);
    if (!original) throw new Error('Product not found');

    const newId = `prod-copy-${Date.now()}`;
    const newSku = `SKU-GAR-${original.category.substring(0, 3).toUpperCase()}-${Math.floor(
      100 + Math.random() * 900
    )}`;

    const cloned: UniformProduct = {
      ...original,
      id: newId,
      name: `${original.name} (Copy)`,
      sku: newSku,
      published: false, // Start copies as draft
      stockOnHand: original.stockOnHand || 40,
    };

    return addProduct(cloned);
  };

  const syncAllProductsToInventory = () => {
    setInventory((prev) => {
      const updated = [...prev];
      products.forEach((prod) => {
        const existingIdx = updated.findIndex(
          (i) => i.productId === prod.id || i.id === `inv-${prod.id}` || i.sku === prod.sku
        );
        const itemPayload: ERPInventoryItem = {
          id: existingIdx >= 0 ? updated[existingIdx].id : `inv-${prod.id}`,
          productId: prod.id,
          sku: prod.sku || `SKU-${prod.id.toUpperCase()}`,
          name: prod.name,
          category: 'finished_garment',
          categoryLabel: prod.categoryLabel || 'Finished Garment',
          size: prod.sizes?.[0] || 'Standard',
          color: prod.availableColors?.[0]?.name || 'Standard',
          unit: 'pieces',
          stockOnHand: prod.stockOnHand ?? 50,
          stockReserved: prod.stockReserved ?? 0,
          reorderLevel: 20,
          unitCost: prod.unitCost ?? Math.round(prod.basePrice * 0.58),
          sellingPrice: prod.basePrice,
          location: prod.location || 'Warehouse Main Bay',
          supplier: prod.supplier || 'Nasisi Internal Tailoring Unit',
          lastRestockedDate: new Date().toISOString().split('T')[0],
          status:
            (prod.stockOnHand ?? 50) <= 0
              ? 'out_of_stock'
              : (prod.stockOnHand ?? 50) <= 20
              ? 'low_stock'
              : 'in_stock',
          published: prod.published !== false,
        };

        if (existingIdx >= 0) {
          updated[existingIdx] = { ...updated[existingIdx], ...itemPayload };
        } else {
          updated.unshift(itemPayload);
        }
      });
      return updated;
    });
  };

  // Document Operations
  const createDocument = (
    docData: Omit<ERPDocument, 'id' | 'createdAt' | 'updatedAt'>
  ): ERPDocument => {
    const newDoc: ERPDocument = {
      ...docData,
      id: `doc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDocuments((prev) => [newDoc, ...prev]);
    saveDocument(newDoc).catch((e) => console.warn('[Firebase] saveDocument error:', e));

    // Update customer spend/balance if it's an invoice
    if (newDoc.type === 'invoice' && newDoc.customerId) {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === newDoc.customerId) {
            const updatedCust = {
              ...c,
              totalOrdersCount: c.totalOrdersCount + 1,
              totalSpendKsh: c.totalSpendKsh + newDoc.totalAmount,
              outstandingBalanceKsh: c.outstandingBalanceKsh + newDoc.balanceDue,
            };
            saveCustomer(updatedCust).catch((e) => console.warn('[Firebase] saveCustomer error:', e));
            return updatedCust;
          }
          return c;
        })
      );
    }

    return newDoc;
  };

  const updateDocument = (id: string, updates: Partial<ERPDocument>) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const updated = { ...d, ...updates, updatedAt: new Date().toISOString() };
          saveDocument(updated).catch((e) => console.warn('[Firebase] saveDocument error:', e));
          return updated;
        }
        return d;
      })
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    removeDocument(id).catch((e) => console.warn('[Firebase] removeDocument error:', e));
  };

  const convertQuotationToInvoice = (quotationId: string): ERPDocument | null => {
    const quote = documents.find((d) => d.id === quotationId);
    if (!quote) return null;

    const invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvoice: ERPDocument = {
      ...quote,
      id: `doc-${Date.now()}`,
      docNumber: invoiceNumber,
      type: 'invoice',
      title: quote.title.replace('Quotation', 'Tax Invoice').replace('Quote', 'Tax Invoice'),
      status: 'issued',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amountPaid: 0,
      balanceDue: quote.totalAmount,
      relatedDocNumber: quote.docNumber,
      notes: `Converted from Quotation ${quote.docNumber}. 16% VAT applicable.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDocuments((prev) => [
      newInvoice,
      ...prev.map((d) => (d.id === quotationId ? { ...d, status: 'issued' as const } : d)),
    ]);

    // Update customer stats
    if (newInvoice.customerId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === newInvoice.customerId
            ? {
                ...c,
                totalOrdersCount: c.totalOrdersCount + 1,
                totalSpendKsh: c.totalSpendKsh + newInvoice.totalAmount,
                outstandingBalanceKsh: c.outstandingBalanceKsh + newInvoice.balanceDue,
              }
            : c
        )
      );
    }

    return newInvoice;
  };

  const createDeliveryNoteFromInvoice = (invoiceId: string): ERPDocument | null => {
    const invoice = documents.find((d) => d.id === invoiceId);
    if (!invoice) return null;

    const dlnNumber = `DLN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDLN: ERPDocument = {
      ...invoice,
      id: `doc-${Date.now()}`,
      docNumber: dlnNumber,
      type: 'delivery_note',
      title: `Dispatch Note for ${invoice.customerName}`,
      status: 'dispatched',
      issueDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      vehicleRegistration: 'KBZ 849X (Nasisi Logistics Van)',
      driverName: 'Peter Ochieng (Senior Driver)',
      driverPhone: '+254 728 901 234',
      dispatchedBy: 'Samson Kimani (Dispatch Supervisor)',
      deliveryStatus: 'in_transit',
      relatedDocNumber: invoice.docNumber,
      notes: `Official delivery acknowledgment for Invoice ${invoice.docNumber}. Goods inspected and packed.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDocuments((prev) => [newDLN, ...prev]);
    return newDLN;
  };

  const createReceiptFromInvoice = (
    invoiceId: string,
    amount: number,
    method: ERPPaymentTransaction['method'],
    mpesaOrBankRef?: string
  ): ERPDocument | null => {
    const invoice = documents.find((d) => d.id === invoiceId);
    if (!invoice) return null;

    const rctNumber = `RCT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReceipt: ERPDocument = {
      ...invoice,
      id: `doc-${Date.now()}`,
      docNumber: rctNumber,
      type: 'receipt',
      title: `Official Receipt - ${method.toUpperCase()} Payment`,
      status: 'paid',
      issueDate: new Date().toISOString().split('T')[0],
      items: [
        {
          id: `li-rct-${Date.now()}`,
          description: `Payment received towards Invoice ${invoice.docNumber} (${invoice.title})`,
          quantity: 1,
          unitPrice: amount,
          total: amount,
          taxRate: 0,
        },
      ],
      subtotal: amount,
      vatRate: 0,
      vatAmount: 0,
      totalAmount: amount,
      amountPaid: amount,
      balanceDue: 0,
      relatedDocNumber: invoice.docNumber,
      mpesaRef: method === 'mpesa' ? mpesaOrBankRef : undefined,
      bankRef: method === 'bank_transfer' ? mpesaOrBankRef : undefined,
      paymentTerms: `Settled via ${method.toUpperCase()} (${mpesaOrBankRef || 'Cash voucher'})`,
      notes: `Received with thanks. Remaining balance on ${invoice.docNumber}: Ksh ${(
        Math.max(0, invoice.balanceDue - amount)
      ).toLocaleString()}.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDocuments((prev) => [newReceipt, ...prev]);

    // Record the matching transaction
    recordPayment({
      transactionNumber: `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      amount,
      method,
      status: 'completed',
      documentId: invoice.id,
      documentNumber: invoice.docNumber,
      customerId: invoice.customerId,
      customerName: invoice.customerName,
      mpesaCode: method === 'mpesa' ? mpesaOrBankRef : undefined,
      mpesaType: 'paybill',
      bankName: method === 'bank_transfer' ? 'Equity Bank Kenya' : undefined,
      bankTransactionRef: method === 'bank_transfer' ? mpesaOrBankRef : undefined,
      receiptId: newReceipt.id,
      notes: `Payment for Invoice ${invoice.docNumber}`,
    });

    return newReceipt;
  };

  // Record Payment
  const recordPayment = (
    paymentData: Omit<ERPPaymentTransaction, 'id' | 'createdAt'>
  ): ERPPaymentTransaction => {
    const newTxn: ERPPaymentTransaction = {
      ...paymentData,
      id: `txn-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTxn, ...prev]);
    saveTransaction(newTxn).catch((e) => console.warn('[Firebase] saveTransaction error:', e));

    // Deduct balance from the linked document if provided
    if (newTxn.documentId || newTxn.documentNumber) {
      setDocuments((prev) =>
        prev.map((doc) => {
          if (doc.id === newTxn.documentId || doc.docNumber === newTxn.documentNumber) {
            const newAmountPaid = doc.amountPaid + newTxn.amount;
            const newBalanceDue = Math.max(0, doc.totalAmount - newAmountPaid);
            const newStatus =
              newBalanceDue <= 0 ? 'paid' : newAmountPaid > 0 ? 'partially_paid' : doc.status;

            const updatedDoc: ERPDocument = {
              ...doc,
              amountPaid: newAmountPaid,
              balanceDue: newBalanceDue,
              status: newStatus,
              mpesaRef: newTxn.mpesaCode || doc.mpesaRef,
              bankRef: newTxn.bankTransactionRef || doc.bankRef,
              updatedAt: new Date().toISOString(),
            };
            saveDocument(updatedDoc).catch((e) => console.warn('[Firebase] saveDocument error:', e));
            return updatedDoc;
          }
          return doc;
        })
      );
    }

    // Update customer outstanding balance
    if (newTxn.customerId) {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === newTxn.customerId) {
            const updatedCust = {
              ...c,
              outstandingBalanceKsh: Math.max(0, c.outstandingBalanceKsh - newTxn.amount),
            };
            saveCustomer(updatedCust).catch((e) => console.warn('[Firebase] saveCustomer error:', e));
            return updatedCust;
          }
          return c;
        })
      );
    }

    return newTxn;
  };

  const reconcileMpesaPayment = (
    mpesaCode: string,
    invoiceNumber: string,
    amount: number,
    senderPhone: string,
    senderName: string
  ): boolean => {
    const invoice = documents.find(
      (d) => d.docNumber.toLowerCase() === invoiceNumber.trim().toLowerCase()
    );

    recordPayment({
      transactionNumber: `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      amount,
      method: 'mpesa',
      status: 'completed',
      documentId: invoice?.id,
      documentNumber: invoice?.docNumber || invoiceNumber,
      customerId: invoice?.customerId,
      customerName: invoice?.customerName || senderName,
      mpesaCode: mpesaCode.toUpperCase().trim(),
      senderPhone,
      senderName: senderName.toUpperCase().trim(),
      mpesaType: 'paybill',
      notes: `Automated M-Pesa STK / Paybill reconciliation for ${invoiceNumber}`,
    });

    return true;
  };

  // Inventory Operations
  const addInventoryItem = (itemData: Omit<ERPInventoryItem, 'id'>): ERPInventoryItem => {
    const newItem: ERPInventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
    };
    setInventory((prev) => [newItem, ...prev]);
    saveInventoryItem(newItem).catch((e) => console.warn('[Firebase] saveInventoryItem error:', e));
    return newItem;
  };

  const updateInventoryItem = (id: string, updates: Partial<ERPInventoryItem>) => {
    setInventory((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const updated = { ...it, ...updates };
          // auto update status
          if (updated.stockOnHand <= 0) {
            updated.status = 'out_of_stock';
          } else if (updated.stockOnHand <= updated.reorderLevel) {
            updated.status = 'low_stock';
          } else {
            updated.status = 'in_stock';
          }

          saveInventoryItem(updated).catch((e) => console.warn('[Firebase] saveInventoryItem error:', e));

          // If linked to product, sync selling price
          if (it.productId && updates.sellingPrice) {
            setProducts((prodList) =>
              prodList.map((p) => {
                if (p.id === it.productId) {
                  const updatedProd = { ...p, basePrice: updates.sellingPrice! };
                  saveProduct(updatedProd).catch((e) => console.warn('[Firebase] saveProduct error:', e));
                  return updatedProd;
                }
                return p;
              })
            );
          }

          return updated;
        }
        return it;
      })
    );
  };

  const adjustStock = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const newStock = Math.max(0, it.stockOnHand + delta);
          const newStatus =
            newStock <= 0 ? 'out_of_stock' : newStock <= it.reorderLevel ? 'low_stock' : 'in_stock';

          // If linked to a product, sync product stockOnHand
          if (it.productId) {
            setProducts((prodList) =>
              prodList.map((p) => {
                if (p.id === it.productId) {
                  const updatedProd = { ...p, stockOnHand: newStock };
                  saveProduct(updatedProd).catch((e) => console.warn('[Firebase] saveProduct error:', e));
                  return updatedProd;
                }
                return p;
              })
            );
          }

          const updatedInvItem: ERPInventoryItem = {
            ...it,
            stockOnHand: newStock,
            status: newStatus,
            lastRestockedDate:
              delta > 0 ? new Date().toISOString().split('T')[0] : it.lastRestockedDate,
          };
          saveInventoryItem(updatedInvItem).catch((e) => console.warn('[Firebase] saveInventoryItem error:', e));
          return updatedInvItem;
        }
        return it;
      })
    );
  };

  const deleteInventoryItem = (id: string) => {
    setInventory((prev) => prev.filter((it) => it.id !== id));
    removeInventoryItem(id).catch((e) => console.warn('[Firebase] removeInventoryItem error:', e));
  };

  // Customer Operations
  const addCustomer = (customerData: Omit<ERPCustomer, 'id' | 'createdAt'>): ERPCustomer => {
    const newCust: ERPCustomer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);
    saveCustomer(newCust).catch((e) => console.warn('[Firebase] saveCustomer error:', e));
    return newCust;
  };

  const updateCustomer = (id: string, updates: Partial<ERPCustomer>) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...updates };
          saveCustomer(updated).catch((e) => console.warn('[Firebase] saveCustomer error:', e));
          return updated;
        }
        return c;
      })
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    removeCustomer(id).catch((e) => console.warn('[Firebase] removeCustomer error:', e));
  };

  // =========================================================================
  // INQUIRY TICKETS & INSTANT QUOTE REQUEST LEADS
  // =========================================================================

  const raiseInquiryTicket = (
    ticketData: Partial<ERPInquiryTicket> & {
      productName: string;
      quantity: number;
      estimatedTotalKsh: number;
    }
  ): ERPInquiryTicket => {
    const timestamp = new Date().toISOString();
    const count = inquiryTickets.length + 1;
    const ticketNumber = `INQ-2026-${String(count + 45).padStart(4, '0')}`;
    const cleanPlatformPhone = '254728102929';
    const displayPlatformPhone = '0728102929';

    const customerName = ticketData.customerName || 'Storefront Client';
    const organizationName = ticketData.organizationName || 'Direct Inquiry';
    const productName = ticketData.productName;
    const quantity = ticketData.quantity || 1;
    const estimatedTotalKsh = ticketData.estimatedTotalKsh || 0;
    const unitPrice = ticketData.unitPrice || (quantity > 0 ? Math.round(estimatedTotalKsh / quantity) : 0);

    const waText = encodeURIComponent(
      `Hello NASISI Uniforms, inquiry ticket #${ticketNumber} has been raised:\n` +
      `• Item: ${productName}\n` +
      `• Qty: ${quantity} units\n` +
      `• Est. Total: Ksh ${estimatedTotalKsh.toLocaleString()}\n` +
      (ticketData.selectedColor ? `• Color: ${ticketData.selectedColor}\n` : '') +
      (ticketData.brandingType ? `• Branding: ${ticketData.brandingType}\n` : '') +
      `Please confirm quote & delivery details.`
    );

    const newTicket: ERPInquiryTicket = {
      id: `tkt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      ticketNumber,
      title: ticketData.title || `${productName} (${quantity} pcs) - Quote Inquiry`,
      customerName,
      organizationName,
      phone: ticketData.phone || displayPlatformPhone,
      email: ticketData.email || 'inquiries@nasisiuniforms.co.ke',
      productName,
      category: ticketData.category || 'general',
      quantity,
      selectedColor: ticketData.selectedColor,
      brandingType: ticketData.brandingType,
      logoPlacement: ticketData.logoPlacement,
      unitPrice,
      estimatedTotalKsh,
      status: ticketData.status || 'new',
      priority: ticketData.priority || 'high',
      source: ticketData.source || 'storefront_quote_request',
      notes: ticketData.notes || 'Instant lead submitted from storefront quote request modal.',
      items: ticketData.items,
      whatsappUrl: ticketData.whatsappUrl || `https://wa.me/${cleanPlatformPhone}?text=${waText}`,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setInquiryTickets((prev) => [newTicket, ...prev]);
    saveInquiryTicket(newTicket).catch((e) => console.warn('[Firebase] saveInquiryTicket error:', e));
    return newTicket;
  };

  const updateInquiryTicket = (id: string, updates: Partial<ERPInquiryTicket>) => {
    const timestamp = new Date().toISOString();
    setInquiryTickets((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates, updatedAt: timestamp };
          saveInquiryTicket(updated).catch((e) => console.warn('[Firebase] saveInquiryTicket error:', e));
          return updated;
        }
        return t;
      })
    );
  };

  const deleteInquiryTicket = (id: string) => {
    setInquiryTickets((prev) => prev.filter((t) => t.id !== id));
    removeInquiryTicket(id).catch((e) => console.warn('[Firebase] removeInquiryTicket error:', e));
  };

  const convertTicketToInvoice = (ticketId: string): ERPDocument | null => {
    const ticket = inquiryTickets.find((t) => t.id === ticketId);
    if (!ticket) return null;

    const subtotal = ticket.estimatedTotalKsh;
    const vatRate = 0.16;
    const vatAmount = Math.round(subtotal * vatRate);
    const totalAmount = subtotal + vatAmount;

    const invDoc = createDocument({
      docNumber: `INV-2026-${String(documents.filter((d) => d.type === 'invoice').length + 46).padStart(4, '0')}`,
      type: 'invoice',
      title: `Invoice for ${ticket.productName} (${ticket.quantity} units)`,
      status: 'issued',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      customerName: ticket.organizationName || ticket.customerName,
      contactPerson: ticket.customerName,
      customerEmail: ticket.email || '',
      customerPhone: ticket.phone || '0728102929',
      customerKraPin: 'P050000000X',
      customerAddress: 'Nairobi, Kenya',
      customerCity: 'Nairobi',
      items: [
        {
          id: `li-${Date.now()}`,
          description: `${ticket.productName} - ${ticket.selectedColor || 'Custom'} (${ticket.brandingType || 'Branded'})`,
          category: ticket.category,
          size: 'Mixed Sizes (S-XXL)',
          color: ticket.selectedColor || 'Standard',
          branding: ticket.brandingType || 'Custom Crest',
          quantity: ticket.quantity,
          unitPrice: ticket.unitPrice,
          total: subtotal,
          taxRate: 0.16,
        },
      ],
      subtotal,
      vatRate,
      vatAmount,
      totalAmount,
      amountPaid: 0,
      balanceDue: totalAmount,
      paymentTerms: '50% deposit upon order confirmation, balance on delivery inspection',
      notes: `Converted directly from Client Inquiry Ticket #${ticket.ticketNumber}. Platform Hotline: 0728102929`,
      relatedDocNumber: ticket.ticketNumber,
    });

    updateInquiryTicket(ticketId, { status: 'converted_invoice' });
    return invDoc;
  };

  const convertTicketToQuotation = (ticketId: string): ERPDocument | null => {
    const ticket = inquiryTickets.find((t) => t.id === ticketId);
    if (!ticket) return null;

    const subtotal = ticket.estimatedTotalKsh;
    const vatRate = 0.16;
    const vatAmount = Math.round(subtotal * vatRate);
    const totalAmount = subtotal + vatAmount;

    const qtnDoc = createDocument({
      docNumber: `QTN-2026-${String(documents.filter((d) => d.type === 'quotation').length + 108).padStart(4, '0')}`,
      type: 'quotation',
      title: `Official Quotation - ${ticket.productName}`,
      status: 'sent',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      customerName: ticket.organizationName || ticket.customerName,
      contactPerson: ticket.customerName,
      customerEmail: ticket.email || '',
      customerPhone: ticket.phone || '0728102929',
      customerKraPin: 'P050000000X',
      customerAddress: 'Nairobi, Kenya',
      customerCity: 'Nairobi',
      items: [
        {
          id: `li-${Date.now()}`,
          description: `${ticket.productName} - ${ticket.selectedColor || 'Custom'} (${ticket.brandingType || 'Branded'})`,
          category: ticket.category,
          size: 'Standard Sizes',
          color: ticket.selectedColor || 'Standard',
          branding: ticket.brandingType || 'Custom Crest',
          quantity: ticket.quantity,
          unitPrice: ticket.unitPrice,
          total: subtotal,
          taxRate: 0.16,
        },
      ],
      subtotal,
      vatRate,
      vatAmount,
      totalAmount,
      amountPaid: 0,
      balanceDue: totalAmount,
      paymentTerms: 'Quotation valid for 30 calendar days. Includes digitized embroidery proof.',
      notes: `Generated from Inquiry Ticket #${ticket.ticketNumber}. Platform WhatsApp: 0728102929`,
      relatedDocNumber: ticket.ticketNumber,
    });

    updateInquiryTicket(ticketId, { status: 'quoted' });
    return qtnDoc;
  };

  // Production Orders
  const addProductionOrder = (
    orderData: Omit<ERPProductionOrder, 'id'>
  ): ERPProductionOrder => {
    const newOrder: ERPProductionOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
    };
    setProductionOrders((prev) => [newOrder, ...prev]);
    saveProductionOrder(newOrder).catch((e) => console.warn('[Firebase] saveProductionOrder error:', e));
    return newOrder;
  };

  const updateProductionOrder = (id: string, updates: Partial<ERPProductionOrder>) => {
    setProductionOrders((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const updated = { ...o, ...updates };
          saveProductionOrder(updated).catch((e) => console.warn('[Firebase] saveProductionOrder error:', e));
          return updated;
        }
        return o;
      })
    );
  };

  const deleteProductionOrder = (id: string) => {
    setProductionOrders((prev) => prev.filter((o) => o.id !== id));
    removeProductionOrder(id).catch((e) => console.warn('[Firebase] removeProductionOrder error:', e));
  };

  // Profile Settings
  const updateBusinessProfile = (updates: Partial<ERPBusinessProfile>) => {
    setBusinessProfile((prev) => {
      const updated = { ...prev, ...updates };
      saveBusinessProfile(updated).catch((e) => console.warn('[Firebase] saveBusinessProfile error:', e));
      return updated;
    });
  };

  const resetToDefaultData = () => {
    setBusinessProfile(INITIAL_BUSINESS_PROFILE);
    setCustomers(INITIAL_CUSTOMERS);
    setDocuments(INITIAL_DOCUMENTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setProducts(INITIAL_SYNCHRONIZED_PRODUCTS);
    setInventory(INITIAL_INVENTORY);
    setProductionOrders(INITIAL_PRODUCTION_ORDERS);
    setInquiryTickets(INITIAL_INQUIRY_TICKETS);
    resetHeroToDefault();
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.INVENTORY);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTION);
    localStorage.removeItem(STORAGE_KEYS.TICKETS);
  };

  return (
    <ERPContext.Provider
      value={{
        firebaseConnected,
        uploadImageToCloud,
        businessProfile,
        customers,
        documents,
        transactions,
        inventory,
        productionOrders,
        products,
        inquiryTickets,
        heroSlides,
        heroConfig,
        // Admin Auth & User Profile
        currentUser,
        isAuthenticated,
        adminUsers,
        login,
        loginWithGoogle,
        quickDemoLogin,
        logout,
        updateUserProfile,
        changePassword,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        resetUserPassword,
        toggleUserStatus,
        addHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        reorderHeroSlides,
        updateHeroConfig,
        resetHeroToDefault,
        syncHeroSlidesFromRepo,
        raiseInquiryTicket,
        updateInquiryTicket,
        deleteInquiryTicket,
        convertTicketToInvoice,
        convertTicketToQuotation,
        addProduct,
        updateProduct,
        deleteProduct,
        togglePublishProduct,
        duplicateProduct,
        syncAllProductsToInventory,
        createDocument,
        updateDocument,
        deleteDocument,
        convertQuotationToInvoice,
        createDeliveryNoteFromInvoice,
        createReceiptFromInvoice,
        recordPayment,
        reconcileMpesaPayment,
        addInventoryItem,
        updateInventoryItem,
        adjustStock,
        deleteInventoryItem,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addProductionOrder,
        updateProductionOrder,
        deleteProductionOrder,
        updateBusinessProfile,
        resetToDefaultData,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};

export const useERPSafe = () => {
  return useContext(ERPContext);
};

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import {
  UniformProduct,
  ERPInventoryItem,
  ERPCustomer,
  ERPDocument,
  ERPPaymentTransaction,
  ERPProductionOrder,
  ERPInquiryTicket,
  HeroSlide,
  ERPBusinessProfile,
  AdminUser,
} from '../types';

export interface UploadedMediaAsset {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
  category?: 'product_image' | 'brand_logo' | 'hero_banner' | 'customer_logo' | 'document';
  uploadedAt: string;
}

// =========================================================================
// PRODUCTS (INVENTORY & CATALOG GARMENTS)
// =========================================================================

export async function saveProduct(product: UniformProduct): Promise<void> {
  const path = `products/${product.id}`;
  try {
    const docRef = doc(db, 'products', product.id);
    // Sanitize undefined fields for Firestore
    const cleanProduct = JSON.parse(JSON.stringify(product));
    await setDoc(docRef, cleanProduct, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeProduct(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToProducts(
  onData: (products: UniformProduct[]) => void,
  onError?: (error: unknown) => void
) {
  const path = 'products';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items = snapshot.docs.map((d) => d.data() as UniformProduct);
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch {
        // Logged structured error, non-fatal for realtime listener
      }
      if (onError) onError(error);
    }
  );
}

// =========================================================================
// INVENTORY ITEMS
// =========================================================================

export async function saveInventoryItem(item: ERPInventoryItem): Promise<void> {
  const path = `inventory/${item.id}`;
  try {
    const docRef = doc(db, 'inventory', item.id);
    const cleanItem = JSON.parse(JSON.stringify(item));
    await setDoc(docRef, cleanItem, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeInventoryItem(itemId: string): Promise<void> {
  const path = `inventory/${itemId}`;
  try {
    await deleteDoc(doc(db, 'inventory', itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToInventory(onData: (items: ERPInventoryItem[]) => void) {
  const path = 'inventory';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items = snapshot.docs.map((d) => d.data() as ERPInventoryItem);
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch {
        // Handled structured error, non-fatal for realtime listener
      }
    }
  );
}

// =========================================================================
// CUSTOMERS
// =========================================================================

export async function saveCustomer(customer: ERPCustomer): Promise<void> {
  const path = `customers/${customer.id}`;
  try {
    const docRef = doc(db, 'customers', customer.id);
    const clean = JSON.parse(JSON.stringify(customer));
    await setDoc(docRef, clean, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeCustomer(customerId: string): Promise<void> {
  const path = `customers/${customerId}`;
  try {
    await deleteDoc(doc(db, 'customers', customerId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToCustomers(onData: (customers: ERPCustomer[]) => void) {
  const path = 'customers';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items = snapshot.docs.map((d) => d.data() as ERPCustomer);
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch {
        // Handled structured error, non-fatal for realtime listener
      }
    }
  );
}

// =========================================================================
// ERP DOCUMENTS (INVOICES, QUOTES, RECEIPTS, DELIVERY NOTES)
// =========================================================================

export async function saveDocument(document: ERPDocument): Promise<void> {
  const path = `documents/${document.id}`;
  try {
    const docRef = doc(db, 'documents', document.id);
    const clean = JSON.parse(JSON.stringify(document));
    await setDoc(docRef, clean, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeDocument(documentId: string): Promise<void> {
  const path = `documents/${documentId}`;
  try {
    await deleteDoc(doc(db, 'documents', documentId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToDocuments(onData: (documents: ERPDocument[]) => void) {
  const path = 'documents';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items = snapshot.docs.map((d) => d.data() as ERPDocument);
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch {
        // Handled structured error, non-fatal for realtime listener
      }
    }
  );
}

// =========================================================================
// TRANSACTIONS
// =========================================================================

export async function saveTransaction(tx: ERPPaymentTransaction): Promise<void> {
  const path = `transactions/${tx.id}`;
  try {
    const docRef = doc(db, 'transactions', tx.id);
    const clean = JSON.parse(JSON.stringify(tx));
    await setDoc(docRef, clean, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeToTransactions(onData: (transactions: ERPPaymentTransaction[]) => void) {
  const path = 'transactions';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items = snapshot.docs.map((d) => d.data() as ERPPaymentTransaction);
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch {
        // Handled structured error, non-fatal for realtime listener
      }
    }
  );
}

// =========================================================================
// PRODUCTION ORDERS
// =========================================================================

export async function saveProductionOrder(order: ERPProductionOrder): Promise<void> {
  const path = `productionOrders/${order.id}`;
  try {
    const docRef = doc(db, 'productionOrders', order.id);
    const clean = JSON.parse(JSON.stringify(order));
    await setDoc(docRef, clean, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeProductionOrder(orderId: string): Promise<void> {
  const path = `productionOrders/${orderId}`;
  try {
    await deleteDoc(doc(db, 'productionOrders', orderId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToProductionOrders(onData: (orders: ERPProductionOrder[]) => void) {
  const path = 'productionOrders';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items = snapshot.docs.map((d) => d.data() as ERPProductionOrder);
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch {
        // Handled structured error, non-fatal for realtime listener
      }
    }
  );
}

// =========================================================================
// INQUIRY TICKETS
// =========================================================================

export async function saveInquiryTicket(ticket: ERPInquiryTicket): Promise<void> {
  const path = `inquiryTickets/${ticket.id}`;
  try {
    const docRef = doc(db, 'inquiryTickets', ticket.id);
    const clean = JSON.parse(JSON.stringify(ticket));
    await setDoc(docRef, clean, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeInquiryTicket(ticketId: string): Promise<void> {
  const path = `inquiryTickets/${ticketId}`;
  try {
    await deleteDoc(doc(db, 'inquiryTickets', ticketId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToInquiryTickets(onData: (tickets: ERPInquiryTicket[]) => void) {
  const path = 'inquiryTickets';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items = snapshot.docs.map((d) => d.data() as ERPInquiryTicket);
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch {
        // Handled structured error, non-fatal for realtime listener
      }
    }
  );
}

// =========================================================================
// HERO SLIDES
// =========================================================================

export async function saveHeroSlide(slide: HeroSlide): Promise<void> {
  const path = `heroSlides/${slide.id}`;
  try {
    const docRef = doc(db, 'heroSlides', slide.id);
    const clean = JSON.parse(JSON.stringify(slide));
    await setDoc(docRef, clean, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeHeroSlide(slideId: string): Promise<void> {
  const path = `heroSlides/${slideId}`;
  try {
    await deleteDoc(doc(db, 'heroSlides', slideId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToHeroSlides(onData: (slides: HeroSlide[]) => void) {
  const path = 'heroSlides';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items = snapshot.docs.map((d) => d.data() as HeroSlide);
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch {
        // Handled structured error, non-fatal for realtime listener
      }
    }
  );
}

// =========================================================================
// BUSINESS PROFILE & SETTINGS
// =========================================================================

export async function saveBusinessProfile(profile: ERPBusinessProfile): Promise<void> {
  const path = 'settings/business_profile';
  try {
    const docRef = doc(db, 'settings', 'business_profile');
    const clean = JSON.parse(JSON.stringify({ ...profile, id: 'business_profile' }));
    await setDoc(docRef, clean, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeToBusinessProfile(onData: (profile: ERPBusinessProfile) => void) {
  const path = 'settings/business_profile';
  return onSnapshot(
    doc(db, 'settings', 'business_profile'),
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data() as ERPBusinessProfile);
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch {
        // Handled structured error, non-fatal for realtime listener
      }
    }
  );
}

// =========================================================================
// ADMIN USERS
// =========================================================================

export async function saveAdminUser(user: AdminUser): Promise<void> {
  const path = `adminUsers/${user.id}`;
  try {
    const docRef = doc(db, 'adminUsers', user.id);
    const clean = JSON.parse(JSON.stringify(user));
    await setDoc(docRef, clean, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeAdminUser(userId: string): Promise<void> {
  const path = `adminUsers/${userId}`;
  try {
    const docRef = doc(db, 'adminUsers', userId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToAdminUsers(onData: (users: AdminUser[]) => void) {
  const path = 'adminUsers';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items = snapshot.docs.map((d) => d.data() as AdminUser);
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch {
        // Handled structured error, non-fatal for realtime listener
      }
    }
  );
}

// =========================================================================
// MEDIA ASSETS / UPLOADED IMAGES
// =========================================================================

export async function saveUploadedMedia(media: UploadedMediaAsset): Promise<void> {
  const path = `mediaAssets/${media.id}`;
  try {
    const docRef = doc(db, 'mediaAssets', media.id);
    await setDoc(docRef, media, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeToMediaAssets(onData: (assets: UploadedMediaAsset[]) => void) {
  const path = 'mediaAssets';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items = snapshot.docs.map((d) => d.data() as UploadedMediaAsset);
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch {
        // Handled structured error, non-fatal for realtime listener
      }
    }
  );
}

// =========================================================================
// SEED INITIAL STORE DATA TO FIRESTORE IF EMPTY
// =========================================================================

export async function initializeFirestoreDatabaseIfEmpty(initialData: {
  products: UniformProduct[];
  inventory: ERPInventoryItem[];
  customers: ERPCustomer[];
  documents: ERPDocument[];
  transactions: ERPPaymentTransaction[];
  productionOrders: ERPProductionOrder[];
  inquiryTickets: ERPInquiryTicket[];
  heroSlides: HeroSlide[];
  businessProfile: ERPBusinessProfile;
  adminUsers: AdminUser[];
}) {
  try {
    const productsSnap = await getDocs(collection(db, 'products'));
    if (productsSnap.empty) {
      console.log('[Firebase] Populating initial Firestore catalog with products...');
      // Batch seed products
      const batch = writeBatch(db);
      for (const p of initialData.products) {
        batch.set(doc(db, 'products', p.id), JSON.parse(JSON.stringify(p)));
      }
      for (const inv of initialData.inventory) {
        batch.set(doc(db, 'inventory', inv.id), JSON.parse(JSON.stringify(inv)));
      }
      for (const cust of initialData.customers) {
        batch.set(doc(db, 'customers', cust.id), JSON.parse(JSON.stringify(cust)));
      }
      for (const docItem of initialData.documents) {
        batch.set(doc(db, 'documents', docItem.id), JSON.parse(JSON.stringify(docItem)));
      }
      for (const tx of initialData.transactions) {
        batch.set(doc(db, 'transactions', tx.id), JSON.parse(JSON.stringify(tx)));
      }
      for (const po of initialData.productionOrders) {
        batch.set(doc(db, 'productionOrders', po.id), JSON.parse(JSON.stringify(po)));
      }
      for (const tkt of initialData.inquiryTickets) {
        batch.set(doc(db, 'inquiryTickets', tkt.id), JSON.parse(JSON.stringify(tkt)));
      }
      for (const slide of initialData.heroSlides) {
        batch.set(doc(db, 'heroSlides', slide.id), JSON.parse(JSON.stringify(slide)));
      }
      for (const user of initialData.adminUsers) {
        batch.set(doc(db, 'adminUsers', user.id), JSON.parse(JSON.stringify(user)));
      }
      batch.set(
        doc(db, 'settings', 'business_profile'),
        JSON.parse(JSON.stringify({ ...initialData.businessProfile, id: 'business_profile' }))
      );

      await batch.commit();
      console.log('[Firebase] Successfully seeded Firestore database with all items.');
    }
  } catch (error) {
    console.warn('[Firebase] Non-blocking initial database seed note:', error);
  }
}

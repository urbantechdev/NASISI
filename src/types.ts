export type UniformCategory = 
  | 'all'
  | 'school'
  | 'service'
  | 'healthcare'
  | 'hospitality'
  | 'workwear'
  | 'knitwear';

export interface UniformProduct {
  id: string;
  name: string;
  category: UniformCategory;
  categoryLabel: string;
  tagline: string;
  basePrice: number; // in Ksh
  minOrder: number;
  availableColors: { name: string; hex: string; bgClass: string }[];
  sizes: string[];
  fabric: {
    composition: string;
    weight: string; // e.g. "220 GSM"
    features: string[];
  };
  customizationOptions: {
    embroidery: boolean;
    screenPrinting: boolean;
    wovenPatch: boolean;
    reflectiveStripes?: boolean;
    heatTransfer?: boolean;
  };
  description: string;
  idealFor: string[];
  image: string;
  badge?: string;
  popular?: boolean;
  // Synced inventory and publishing fields
  published?: boolean;
  sku?: string;
  stockOnHand?: number;
  stockReserved?: number;
  unitCost?: number;
  supplier?: string;
  location?: string;
}

export interface QuoteItem {
  id: string;
  product: UniformProduct;
  selectedColor: string;
  quantities: Record<string, number>; // size -> quantity
  totalQuantity: number;
  brandingType: 'embroidery' | 'screen_printing' | 'both' | 'blank';
  logoPlacement: string[];
  logoNotes?: string;
  unitPrice: number; // in Ksh
  totalPrice: number; // in Ksh
}

export interface QuoteSubmission {
  id?: string;
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  organizationType: 'school' | 'business' | 'healthcare' | 'hospitality' | 'sports_club' | 'other';
  requiredDate?: string;
  deliveryAddress?: string;
  notes?: string;
  items: QuoteItem[];
  uploadedLogoName?: string;
  uploadedLogoUrl?: string;
  submittedAt: string;
  status?: 'new' | 'reviewed' | 'quoted' | 'invoiced';
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  organization: string;
  location: string;
  category: string;
  rating: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  category: string;
  technique: string;
  description: string;
  tags: string[];
  image: string;
  quantityDelivered: string;
}

/* =========================================================================
   ERP & BUSINESS SUITE TYPES (KENYAN SHILLING / KES / Ksh SYSTEM)
   ========================================================================= */

export type ERPDocumentType = 
  | 'quotation'       // QTN-xxxx
  | 'proforma'        // PRO-xxxx
  | 'invoice'         // INV-xxxx (Tax Invoice)
  | 'receipt'         // RCT-xxxx (Official Receipt)
  | 'delivery_note';  // DLN-xxxx (Dispatch & Delivery)

export type ERPDocumentStatus = 
  | 'draft'
  | 'sent'
  | 'issued'
  | 'partially_paid'
  | 'paid'
  | 'overdue'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export type ERPPaymentMethod = 'mpesa' | 'cash' | 'bank_transfer' | 'cheque';

export interface ERPLineItem {
  id: string;
  description: string;
  category?: string;
  size?: string;
  color?: string;
  branding?: string;
  quantity: number;
  unitPrice: number; // in Ksh
  total: number;     // in Ksh
  taxRate?: number;  // e.g. 0.16 for 16% VAT or 0 for exempt
}

export interface ERPDocument {
  id: string;
  docNumber: string; // e.g. "INV-2026-0042" or "QTN-2026-0105"
  type: ERPDocumentType;
  title: string;
  status: ERPDocumentStatus;
  
  // Dates
  issueDate: string;
  dueDate?: string;
  validUntil?: string; // For quotations & proformas
  deliveryDate?: string; // For delivery notes
  
  // Client Details
  customerId?: string;
  customerName: string;
  contactPerson: string;
  customerEmail: string;
  customerPhone: string;
  customerKraPin?: string;
  customerAddress: string;
  customerCity?: string; // e.g. "Nairobi", "Mombasa", "Nakuru", "Eldoret"
  
  // Financials in Ksh
  items: ERPLineItem[];
  subtotal: number;
  vatRate: number; // 0.16 (16%) or 0
  vatAmount: number;
  discountAmount?: number;
  totalAmount: number; // Ksh
  amountPaid: number;  // Ksh
  balanceDue: number;  // Ksh
  
  // Delivery Note specific
  vehicleRegistration?: string;
  driverName?: string;
  driverPhone?: string;
  dispatchedBy?: string;
  receivedBy?: string;
  receiverIdNumber?: string;
  deliveryStatus?: 'packed' | 'in_transit' | 'delivered';
  
  // References & Linking
  relatedDocNumber?: string; // e.g. Invoice links to Quotation QTN-xxxx
  quoteRefId?: string;
  mpesaRef?: string;
  bankRef?: string;
  paymentTerms?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ERPPaymentTransaction {
  id: string;
  transactionNumber: string; // e.g. "TXN-2026-0089"
  date: string;
  amount: number; // in Ksh
  method: ERPPaymentMethod;
  status: 'completed' | 'pending' | 'failed' | 'reconciled';
  
  // Linkages
  documentId?: string;
  documentNumber?: string; // e.g. "INV-2026-0042"
  customerId?: string;
  customerName: string;
  
  // M-Pesa Specifics
  mpesaCode?: string;         // e.g. "SJK98LM24X"
  senderPhone?: string;       // e.g. "+254 712 345678"
  senderName?: string;        // e.g. "FRANCIS KARIUKI"
  mpesaType?: 'paybill' | 'till' | 'send_money';
  
  // Bank Specifics
  bankName?: string;          // e.g. "KCB Bank", "Equity Bank", "NCBA", "Co-op Bank"
  accountNumber?: string;
  bankTransactionRef?: string;
  chequeNumber?: string;
  
  // Cash Specifics
  receiptVoucherNo?: string;
  receivedByCashier?: string;
  branch?: string;
  
  notes?: string;
  receiptId?: string; // Generated official receipt RCT-xxxx
  createdAt: string;
}

export interface ERPInventoryItem {
  id: string;
  sku: string; // e.g. "BLZ-NAV-YM"
  name: string;
  category: 'finished_garment' | 'raw_fabric' | 'yarn_knit' | 'accessories' | 'packaging';
  categoryLabel: string;
  size?: string;
  color?: string;
  unit: 'pieces' | 'rolls' | 'kg' | 'meters' | 'cones' | 'boxes';
  
  stockOnHand: number;
  stockReserved: number; // In active factory production
  reorderLevel: number;
  
  unitCost: number; // Purchase / Production cost in Ksh
  sellingPrice: number; // Selling price in Ksh
  
  location: string; // e.g. "Warehouse Shelf A3", "Fabric Rack 2"
  supplier?: string;
  lastRestockedDate: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  productId?: string; // Links directly to platform UniformProduct
  published?: boolean; // Reflects live status on customer storefront
}

export interface ERPCustomer {
  id: string;
  name: string;
  category: 'School' | 'Hospital' | 'Corporate' | 'Hospitality' | 'Security / Industrial' | 'Individual';
  contactPerson: string;
  email: string;
  phone: string;
  kraPin?: string;
  address: string;
  city: string;
  totalOrdersCount: number;
  totalSpendKsh: number;
  outstandingBalanceKsh: number;
  creditLimitKsh?: number;
  paymentTerms: string; // e.g. "50% Advance, 50% on Delivery"
  notes?: string;
  createdAt: string;
}

export interface ERPProductionOrder {
  id: string;
  orderNumber: string; // e.g. "ORD-2026-0034"
  customerName: string;
  productName: string;
  quantity: number;
  stage: 'cutting' | 'embroidery_print' | 'stitching' | 'quality_check' | 'ironing_packing' | 'ready_dispatch';
  stageProgress: number; // 0 to 100%
  startDate: string;
  targetDeliveryDate: string;
  assignedSupervisor: string;
  linkedInvoiceNumber?: string;
  notes?: string;
}

export interface ERPInquiryTicket {
  id: string;
  ticketNumber: string; // e.g. "INQ-2026-0042"
  title: string;
  customerName: string;
  organizationName?: string;
  phone: string; // "0728102929" or client phone
  email?: string;
  productName: string;
  category: string;
  quantity: number;
  selectedColor?: string;
  brandingType?: string;
  logoPlacement?: string[];
  unitPrice: number;
  estimatedTotalKsh: number;
  status: 'new' | 'contacted' | 'quoted' | 'converted_invoice' | 'closed';
  priority: 'urgent' | 'high' | 'normal';
  source: 'storefront_quote_request' | 'mockup_studio' | 'quick_inquiry' | 'direct_submission';
  notes?: string;
  items?: QuoteItem[];
  whatsappUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ERPBusinessProfile {
  companyName: string;
  tagline: string;
  slogan?: string; // Official brand slogan (e.g. "We stitch it, You wear it, We print it, you represent.")
  registrationNumber: string;
  kraPin: string;
  vatRatePercent: number; // 16
  email: string;
  phone: string;
  altPhone: string;
  whatsappNumber: string;
  physicalAddress: string;
  city: string;
  country: string;
  
  // Payment Details for Kenyan Market
  mpesaPaybillNumber: string;
  mpesaAccountNumber: string;
  mpesaTillNumber: string;
  bankName: string;
  bankBranch: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankSwiftCode: string;

  // Instant Brand Logos & Favicon Assets
  logoUrl?: string; // Main brand logo (URL or Base64 data URL)
  faviconUrl?: string; // Browser tab favicon (URL or Base64 data URL)
  footerLogoUrl?: string; // Footer logo (URL or Base64 data URL)
  logoDisplayMode?: 'image-only' | 'image-and-text'; // Display preference
}

export interface HeroSlide {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  badge: string;
  alt: string;
  isActive: boolean;
  order: number;
}

export interface HeroConfig {
  autoPlay: boolean;
  autoPlayIntervalMs: number; // e.g. 5500
  showWaveDivider: boolean;
  showOverlayGradients: boolean;
  heightPreset: 'compact' | 'standard' | 'tall';
}

export type AdminRole = 
  | 'Super Admin' 
  | 'Managing Director' 
  | 'Operations Manager' 
  | 'Finance Controller' 
  | 'Production Supervisor';

export interface AdminUserActivity {
  id: string;
  action: string;
  timestamp: string;
  category: 'auth' | 'document' | 'finance' | 'inventory' | 'production' | 'security';
  details?: string;
  ipAddress?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  staffId: string;
  phone: string;
  department: string;
  avatar?: string;
  bio?: string;
  location?: string;
  status: 'active' | 'away' | 'offline';
  lastLogin?: string;
  joinedDate: string;
  twoFactorEnabled: boolean;
  notificationPreferences?: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    newOrders: boolean;
    mpesaReconciliations: boolean;
  };
  recentActivities?: AdminUserActivity[];
}


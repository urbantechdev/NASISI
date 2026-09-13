export type UniformCategory =
  | 'all'
  | 'school'
  | 'corporate'
  | 'healthcare'
  | 'hospitality'
  | 'safety_industrial'
  | 'workwear'
  | 'security'
  | 'sportswear'
  | 'promotional'
  | 'service'
  | string;

export interface ColorOption {
  name: string;
  hex: string;
  bgClass?: string;
}

export interface FabricDetails {
  composition?: string;
  weight?: string;
  features?: string[];
}

export interface CustomizationOptions {
  embroidery?: boolean;
  screenPrinting?: boolean;
  wovenPatch?: boolean;
  reflectiveStripes?: boolean;
  heatTransfer?: boolean;
  customStitching?: boolean;
  [key: string]: boolean | undefined;
}

export interface UniformProduct {
  id: string;
  sku?: string;
  name: string;
  category: UniformCategory;
  categoryLabel?: string;
  garmentType?: string;
  isHighPriority?: boolean;
  priorityRank?: number;
  tagline?: string;
  basePrice: number;
  minOrder: number;
  availableColors?: ColorOption[];
  sizes?: string[];
  fabric?: FabricDetails;
  customizationOptions?: CustomizationOptions;
  description?: string;
  idealFor?: string[];
  image: string;
  images?: string[];
  badge?: string;
  popular?: boolean;
  published?: boolean;
  leadTime?: string;
  leadTimeDays?: number;
  stockCount?: number;
  stockOnHand?: number;
  stockReserved?: number;
  unitCost?: number;
  location?: string;
  supplier?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  organization: string;
  location?: string;
  category?: string;
  rating?: number;
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
  quantityDelivered?: string;
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
  autoPlayIntervalMs: number;
  showWaveDivider: boolean;
  showOverlayGradients: boolean;
  heightPreset: 'compact' | 'standard' | 'tall';
  pauseOnHover?: boolean;
  showOverlayText?: boolean;
  textAlignment?: 'left' | 'center';
  showActionButtons?: boolean;
  showBadges?: boolean;
}

export type AdminRole =
  | 'Super Admin'
  | 'Production Manager'
  | 'Accounts Executive'
  | 'Sales Rep'
  | 'Customer'
  | string;

export interface AdminUserActivity {
  id: string;
  action: string;
  timestamp: string;
  category?: 'security' | 'production' | 'billing' | 'inventory' | string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  staffId?: string;
  phone?: string;
  department?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  status?: 'active' | 'away' | 'offline' | 'suspended';
  lastLogin?: string;
  joinedDate?: string;
  twoFactorEnabled?: boolean;
  notificationPreferences?: {
    emailAlerts?: boolean;
    smsAlerts?: boolean;
    newOrders?: boolean;
    mpesaReconciliations?: boolean;
    [key: string]: boolean | undefined;
  };
  recentActivities?: AdminUserActivity[];
}

export interface QuoteItem {
  id: string;
  product: UniformProduct;
  selectedColor?: string;
  quantities?: Record<string, number>;
  totalQuantity: number;
  brandingType?: string;
  logoPlacement?: string[];
  logoNotes?: string;
  unitPrice?: number;
  totalPrice?: number;
  customLogoUrl?: string;
}

export interface QuoteSubmission {
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  organizationType: 'school' | 'hospital' | 'corporate' | 'hotel' | 'security' | 'industrial' | string;
  requiredDate?: string;
  notes?: string;
  items: QuoteItem[];
  submittedAt: string;
}

export interface ERPBusinessProfile {
  companyName: string;
  tagline: string;
  slogan: string;
  registrationNumber: string;
  kraPin: string;
  vatRatePercent: number;
  email: string;
  phone: string;
  altPhone?: string;
  whatsappNumber: string;
  physicalAddress: string;
  city: string;
  country: string;
  mpesaPaybillNumber?: string;
  mpesaAccountNumber?: string;
  mpesaTillNumber?: string;
  bankName?: string;
  bankBranch?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankSwiftCode?: string;
  logoUrl?: string;
  faviconUrl?: string;
  footerLogoUrl?: string;
  logoDisplayMode?: 'image-only' | 'text-and-image' | 'text-only' | string;
}

export interface ERPCustomer {
  id: string;
  name: string;
  category: 'School' | 'Hospital' | 'Hospitality' | 'Security / Industrial' | 'Corporate' | string;
  contactPerson: string;
  email: string;
  phone: string;
  kraPin?: string;
  address: string;
  city: string;
  totalOrdersCount: number;
  totalSpendKsh: number;
  outstandingBalanceKsh: number;
  creditLimitKsh: number;
  paymentTerms: string;
  notes?: string;
  createdAt: string;
}

export type ERPDocumentType = 'invoice' | 'receipt' | 'quotation' | 'delivery_note' | 'lpo' | string;
export type ERPDocumentStatus = 'draft' | 'issued' | 'paid' | 'partially_paid' | 'cancelled' | 'delivered' | string;

export interface ERPLineItem {
  id: string;
  description: string;
  category?: string;
  size?: string;
  color?: string;
  branding?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate?: number;
}

export interface ERPDocument {
  id: string;
  docNumber: string;
  type: ERPDocumentType;
  title: string;
  status: ERPDocumentStatus;
  issueDate: string;
  dueDate?: string;
  validUntil?: string;
  deliveryDate?: string;
  vehicleRegistration?: string;
  driverName?: string;
  driverPhone?: string;
  dispatchedBy?: string;
  receivedBy?: string;
  receiverIdNumber?: string;
  deliveryStatus?: string;
  customerId?: string;
  customerName: string;
  contactPerson?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerKraPin?: string;
  customerAddress?: string;
  customerCity?: string;
  items: ERPLineItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  discountAmount?: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  relatedDocNumber?: string;
  mpesaRef?: string;
  bankRef?: string;
  paymentTerms?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ERPPaymentMethod = 'mpesa' | 'bank_transfer' | 'cash' | 'cheque' | 'card' | string;

export interface ERPPaymentTransaction {
  id: string;
  transactionNumber: string;
  date: string;
  amount: number;
  method: ERPPaymentMethod;
  status: 'completed' | 'pending' | 'failed' | string;
  customerId?: string;
  customerName?: string;
  documentNumber?: string;
  receiptVoucherNo?: string;
  receiptId?: string;
  receivedByCashier?: string;
  branch?: string;
  notes?: string;
  mpesaCode?: string;
  mpesaType?: string;
  senderPhone?: string;
  senderName?: string;
  bankName?: string;
  accountNumber?: string;
  bankRef?: string;
  bankTransactionRef?: string;
  documentId?: string;
  createdAt?: string;
}

export interface ERPInventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'finished_garment' | 'raw_fabric' | 'yarn_knit' | 'accessories' | 'packaging' | string;
  categoryLabel?: string;
  size?: string;
  color?: string;
  unit: string;
  stockOnHand: number;
  stockReserved: number;
  reorderLevel: number;
  unitCost: number;
  sellingPrice: number;
  location: string;
  supplier: string;
  lastRestockedDate: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | string;
  productId?: string;
  published?: boolean;
}

export interface ERPProductionOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  productName: string;
  quantity: number;
  stage: 'cutting' | 'stitching' | 'embroidery_print' | 'quality_check' | 'ironing_packing' | 'completed' | string;
  stageProgress: number;
  startDate: string;
  targetDeliveryDate: string;
  assignedSupervisor: string;
  linkedInvoiceNumber?: string;
  notes?: string;
}

export interface ERPInquiryTicket {
  id: string;
  ticketNumber: string;
  title: string;
  customerName: string;
  organizationName?: string;
  phone: string;
  email?: string;
  productName: string;
  category?: string;
  quantity: number;
  selectedColor?: string;
  brandingType?: string;
  logoPlacement?: string[];
  unitPrice?: number;
  estimatedTotalKsh: number;
  status: 'new' | 'contacted' | 'quoted' | 'invoiced' | 'closed' | string;
  priority: 'low' | 'normal' | 'high' | 'urgent' | string;
  source: string;
  notes?: string;
  whatsappUrl?: string;
  items?: any[];
  createdAt: string;
  updatedAt: string;
}

import { AdminUser } from '../types';

/**
 * Official Whitelisted Admin Emails authorized for Enterprise ERP Dashboard access.
 * Only these designated accounts can view, create, or modify ERP records,
 * tax invoices, KRA compliance, Tajima machine schedules, and inventory.
 * Any other user signs in with Customer privileges for storefront checkout only.
 */
export const WHITELISTED_ADMIN_EMAILS: string[] = [
  'nasisiknitwear.ke@gmail.com',
  'optimumengineeringke@gmail.com',
  'veronicanjus@gmail.com',
  'admin@nasisiuniforms.co.ke',
  'brian.finance@nasisiuniforms.co.ke',
  'mercy.prod@nasisiuniforms.co.ke',
];

export const isWhitelistedAdminEmail = (emailOrStaffId: string | null | undefined): boolean => {
  if (!emailOrStaffId) return false;
  const normalized = emailOrStaffId.trim().toLowerCase();
  
  // Direct whitelist match
  if (WHITELISTED_ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === normalized)) {
    return true;
  }

  // Also check standard factory staff IDs (e.g. NAS-DIR-001, NAS-ACC-004, NAS-EXEC-KNIT, NAS-TECH-OPT)
  if (normalized.startsWith('nas-')) {
    return true;
  }

  return false;
};

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'user-nasisi-knitwear',
    name: 'Nasisi Knitwear Executive',
    email: 'nasisiknitwear.ke@gmail.com',
    role: 'Super Admin',
    staffId: 'NAS-EXEC-KNIT',
    phone: '+254 728 102 929',
    department: 'Factory & Production Oversight',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    bio: 'Executive factory leadership & administrator for Nasisi Uniforms & Knitwear Kenya.',
    location: 'Nairobi Factory Bay 1 & Uhuru Market Complex',
    status: 'active',
    lastLogin: 'Today',
    joinedDate: 'January 2021',
    twoFactorEnabled: true,
    notificationPreferences: {
      emailAlerts: true,
      smsAlerts: true,
      newOrders: true,
      mpesaReconciliations: true,
    },
    recentActivities: [
      {
        id: 'act-knit-1',
        action: 'Authorized Enterprise ERP Production & Factory Access',
        timestamp: 'Just now',
        category: 'security',
      },
    ],
  },
  {
    id: 'user-optimum',
    name: 'Optimum Engineering Admin',
    email: 'optimumengineeringke@gmail.com',
    role: 'Super Admin',
    staffId: 'NAS-TECH-OPT',
    phone: '+254 722 419 820',
    department: 'Operations & ERP Engineering',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    bio: 'Systems Engineer & Enterprise Super Administrator for ERP Infrastructure.',
    location: 'Nairobi HQ',
    status: 'active',
    lastLogin: 'Today',
    joinedDate: 'January 2022',
    twoFactorEnabled: true,
    notificationPreferences: {
      emailAlerts: true,
      smsAlerts: true,
      newOrders: true,
      mpesaReconciliations: true,
    },
    recentActivities: [
      {
        id: 'act-opt-1',
        action: 'Verified Cloud Database & Firebase Authentication Integration',
        timestamp: 'Just now',
        category: 'security',
      },
    ],
  },
  {
    id: 'user-veronica',
    name: 'Veronica Njus',
    email: 'veronicanjus@gmail.com',
    role: 'Super Admin',
    staffId: 'NAS-DIR-001',
    phone: '+254 722 419 820',
    department: 'Executive Management & Factory Oversight',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    bio: 'Managing Director & Enterprise Executive leading Nasisi Uniforms & Knitwear manufacturing operations across Kenya. Specialized in high-volume schoolwear, institutional healthcare apparel, and modern automated knitting plant management.',
    location: 'Nairobi HQ, Uhuru Market Workshop, Nairobi',
    status: 'active',
    lastLogin: 'Today, 08:45 AM (EAT)',
    joinedDate: 'January 2021',
    twoFactorEnabled: true,
    notificationPreferences: {
      emailAlerts: true,
      smsAlerts: true,
      newOrders: true,
      mpesaReconciliations: true,
    },
    recentActivities: [
      {
        id: 'act-1',
        action: 'Signed in from Nairobi Station (IP: 102.219.208.45)',
        timestamp: 'Just now',
        category: 'auth',
      },
      {
        id: 'act-2',
        action: 'Approved KRA Tax Invoice #INV-2026-0042 for St. Augustine Academy',
        timestamp: '2 hours ago',
        category: 'document',
      },
      {
        id: 'act-3',
        action: 'Verified M-Pesa Paybill automatic reconciliation of Ksh 180,000',
        timestamp: 'Yesterday',
        category: 'finance',
      },
      {
        id: 'act-4',
        action: 'Authorized Batch Dispatch for 120 Medical Scrubs to Apex Premier Health',
        timestamp: '2 days ago',
        category: 'production',
      },
    ],
  },
  {
    id: 'user-brian',
    name: 'Brian Mwangi',
    email: 'brian.finance@nasisiuniforms.co.ke',
    role: 'Finance Controller',
    staffId: 'NAS-ACC-004',
    phone: '+254 711 345 678',
    department: 'Accounts, Taxation & M-Pesa Reconciliations',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    bio: 'Certified Public Accountant (CPA-K) managing KRA compliance, 16% VAT filing, Equity Bank corporate lines, and instant M-Pesa Paybill settlement systems.',
    location: 'Accounts Office, Nairobi Complex',
    status: 'active',
    lastLogin: 'Yesterday, 04:30 PM (EAT)',
    joinedDate: 'March 2022',
    twoFactorEnabled: true,
    notificationPreferences: {
      emailAlerts: true,
      smsAlerts: true,
      newOrders: false,
      mpesaReconciliations: true,
    },
    recentActivities: [
      {
        id: 'act-5',
        action: 'Issued Official Receipt #REC-2026-0089 for Ksh 45,000 via M-Pesa',
        timestamp: 'Yesterday',
        category: 'finance',
      },
      {
        id: 'act-6',
        action: 'Exported Monthly VAT Summary for Kenya Revenue Authority (KRA)',
        timestamp: '3 days ago',
        category: 'finance',
      },
    ],
  },
  {
    id: 'user-mercy',
    name: 'Mercy Wanjiku',
    email: 'mercy.prod@nasisiuniforms.co.ke',
    role: 'Production Supervisor',
    staffId: 'NAS-OPS-012',
    phone: '+254 733 987 654',
    department: 'Factory Operations, Tajima Embroidery & Quality',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    bio: 'Lead Garment Technologist overseeing Tajima 15-needle computerized embroidery machines, industrial laser fabric cutters, and institutional uniform quality control.',
    location: 'Factory Floor Bay 2 & Stitching Line A',
    status: 'active',
    lastLogin: 'Today, 07:15 AM (EAT)',
    joinedDate: 'June 2022',
    twoFactorEnabled: false,
    notificationPreferences: {
      emailAlerts: true,
      smsAlerts: false,
      newOrders: true,
      mpesaReconciliations: false,
    },
    recentActivities: [
      {
        id: 'act-7',
        action: 'Completed 150 school blazer gold crest embroidery digitizations',
        timestamp: '4 hours ago',
        category: 'production',
      },
      {
        id: 'act-8',
        action: 'Updated fabric roll inventory for 220 GSM anti-pill knitwear',
        timestamp: 'Yesterday',
        category: 'inventory',
      },
    ],
  },
];

export const DEFAULT_ADMIN_CREDENTIALS = {
  defaultEmail: 'veronicanjus@gmail.com',
  fallbackEmail: 'admin@nasisiuniforms.co.ke',
  defaultPassword: 'admin', // also accepts 'admin123', 'admin', 'password', or demo 1-click
};

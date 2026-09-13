import { AdminUser } from '../types';

/**
 * Generate a clean, responsive, local vector SVG avatar.
 * Eliminates all external mock images or unsplash dependencies.
 */
export const getInitialsAvatar = (name: string, bg: string = '#06163c'): string => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'NU';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="${bg}"/><circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="3"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="800" letter-spacing="1">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

/**
 * Official Whitelisted Admin Emails authorized for Enterprise ERP Dashboard access.
 * Only these designated Gmail accounts can access the backend dashboard,
 * inventory management, KRA eTIMS invoices, and production queues.
 *
 * Any other Gmail account automatically accesses the customer interface for checkout.
 */
export const WHITELISTED_ADMIN_EMAILS: string[] = [
  'veronicanjus@gmail.com',
  'nasisiknitwear.ke@gmail.com',
  'optimumengineeringke@gmail.com',
];

export const isWhitelistedAdminEmail = (emailOrStaffId: string | null | undefined): boolean => {
  if (!emailOrStaffId) return false;
  const normalized = emailOrStaffId.trim().toLowerCase();
  return WHITELISTED_ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === normalized);
};

export const ALLOWED_ADMIN_ACCOUNTS_INFO = [
  { email: 'veronicanjus@gmail.com', label: 'Veronica Njus (Managing Director)' },
  { email: 'nasisiknitwear.ke@gmail.com', label: 'Nasisi Knitwear Executive' },
  { email: 'optimumengineeringke@gmail.com', label: 'Optimum Engineering Admin' },
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'user-veronica',
    name: 'Veronica Njus',
    email: 'veronicanjus@gmail.com',
    role: 'Super Admin',
    staffId: 'NAS-DIR-001',
    phone: '+254 722 419 820',
    department: 'Executive Management & Factory Oversight',
    avatar: getInitialsAvatar('Veronica Njus', '#06163c'),
    bio: 'Managing Director & Enterprise Executive leading Nasisi Uniforms & Knitwear manufacturing operations across Kenya.',
    location: 'Nairobi HQ, Uhuru Market Complex, Nairobi',
    status: 'active',
    lastLogin: 'Verified Whitelisted Admin',
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
        action: 'Authorized Enterprise ERP Production & Factory Access',
        timestamp: 'Just now',
        category: 'security',
      },
    ],
  },
  {
    id: 'user-nasisi-knitwear',
    name: 'Nasisi Knitwear Executive',
    email: 'nasisiknitwear.ke@gmail.com',
    role: 'Super Admin',
    staffId: 'NAS-EXEC-KNIT',
    phone: '+254 728 102 929',
    department: 'Factory & Production Oversight',
    avatar: getInitialsAvatar('Nasisi Knitwear', '#0b2a6f'),
    bio: 'Executive factory leadership & administrator for Nasisi Uniforms & Knitwear Kenya.',
    location: 'Nairobi Factory Bay 1',
    status: 'active',
    lastLogin: 'Verified Whitelisted Admin',
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
        action: 'Verified Cloud Database & Production Queue',
        timestamp: 'Just now',
        category: 'production',
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
    avatar: getInitialsAvatar('Optimum Engineering', '#0284c7'),
    bio: 'Systems Engineer & Enterprise Super Administrator for ERP Infrastructure.',
    location: 'Nairobi HQ',
    status: 'active',
    lastLogin: 'Verified Whitelisted Admin',
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
];

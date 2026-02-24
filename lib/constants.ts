// Route constants
export const ROUTES = {
  LOGIN: '/login',
  CALLBACK: '/callback',

  // Staff routes
  STAFF: {
    DASHBOARD: '/dashboard',
    KOLS: '/kols',
    KOL_ADD: '/kols/add',
    KOL_ADD_POTENTIAL: '/kols/add-potential',
    KOL_DETAIL: (id: string) => `/kols/${id}`,
    KOL_EDIT: (id: string) => `/kols/${id}/edit`,
    CHECKIN: '/checkin',
    PR_PRODUCTS: '/pr-products',
    SETTLEMENTS: '/settlements',
    PROFILE: '/profile',
  },

  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    KOLS: '/admin/kols',
    KOL_ADD: '/admin/kols/add',
    KOL_ADD_POTENTIAL: '/admin/kols/add-potential',
    KOL_DETAIL: (id: string) => `/admin/kols/${id}`,
    KOL_EDIT: (id: string) => `/admin/kols/${id}/edit`,
    PRODUCTS: '/admin/products',
    PRODUCT_ADD: '/admin/products/add',
    PRODUCT_EDIT: (id: string) => `/admin/products/${id}/edit`,
    PR_PRODUCTS: '/admin/pr-products',
    SETTLEMENTS: '/admin/settlements',
    SETTLEMENT_DETAIL: (id: string) => `/admin/settlements/${id}`,
  },
} as const;

// KOL display status (includes "待開團" derived from active + future start date)
export type KolDisplayStatus = 'potential' | 'upcoming' | 'active' | 'ended';

export const KOL_STATUS_LABELS: Record<string, string> = {
  potential: '潛在',
  upcoming: '待開團',
  active: '開團中',
  ended: '已結束',
};

export const KOL_STATUS_COLORS: Record<string, string> = {
  potential: '#faad14',
  upcoming: '#1677ff',
  active: '#52c41a',
  ended: '#ff4d4f',
};

/** Derive display status from KOL data */
export function getKolDisplayStatus(kol: { status: string; group_buy_start_date: string | null }): KolDisplayStatus {
  if (kol.status === 'active' && kol.group_buy_start_date) {
    const today = new Date().toISOString().slice(0, 10);
    if (kol.group_buy_start_date > today) return 'upcoming';
  }
  return kol.status as KolDisplayStatus;
}

// Upload limits
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

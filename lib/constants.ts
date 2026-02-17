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
    PROFILE: '/profile',
  },

  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    KOLS: '/admin/kols',
    KOL_DETAIL: (id: string) => `/admin/kols/${id}`,
    PRODUCTS: '/admin/products',
    PRODUCT_ADD: '/admin/products/add',
    PRODUCT_EDIT: (id: string) => `/admin/products/${id}/edit`,
    PR_PRODUCTS: '/admin/pr-products',
    SETTLEMENTS: '/admin/settlements',
    SETTLEMENT_DETAIL: (id: string) => `/admin/settlements/${id}`,
  },
} as const;

// KOL status labels
export const KOL_STATUS_LABELS: Record<string, string> = {
  potential: '潛在',
  active: '進行中',
  paused: '暫停',
  ended: '已結束',
};

export const KOL_STATUS_COLORS: Record<string, string> = {
  potential: '#faad14',
  active: '#52c41a',
  paused: '#d9d9d9',
  ended: '#ff4d4f',
};

// Upload limits
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

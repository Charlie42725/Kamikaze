import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '神風系統 - KOL 管理',
    short_name: '神風系統',
    description: 'KOL 網紅管理系統',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1677ff',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

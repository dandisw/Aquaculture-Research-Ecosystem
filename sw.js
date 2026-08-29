// Naikkan versi menjadi v6 untuk mendukung offline caching penuh AquaLab Workspace
const CACHE_NAME = 'ares-aqualab-v6';

// Daftar file inti yang diklasifikasikan untuk pre-cache offline
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './AREs%20Logo%20Outline.png',
  './AREs%20Logo%20Acronim.png',
  
  // Modul Utama AquaLab Workspace & Modul Terkait
  './AquaLab-Workspace/index.html',
  './AquaLab-Workspace/css/print-dashboard.css',
  './js/aqualab.js',
  './js/theme-manager.js',
  './js/i18n.js',
  './js/statwise.js',
  './js/biotools.js',
  './js/ecometrics.js',
  
  // Daftarkan modul alat pendukung (AREs Ecosystem Tools)
  './StatWise/index.html',
  './BioTools/index.html',
  './EcoMetrics-Multivariat/index.html',
  './CiteShift/index.html',
  './ShifterAI/index.html',
  './GeoPlot/index.html',
  './Mendeley-Citation-Portal-FPIK-Unsoed-2018/index.html',
  './Career-Map/index.html',
  './logo%20FishCareer.png',

  // Pustaka CDN Utama untuk Grafik & Tipografi Offline
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=Fraunces:opsz,wght@9..144,300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap'
];

// EVENT 1: INSTALASI (Menyimpan file ke dalam Cache)
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('AREs Service Worker v6: Pre-cache AquaLab Workspace & ekosistem berhasil.');
        return Promise.allSettled(
          urlsToCache.map(url => cache.add(url).catch(err => console.warn('PWA Pre-cache skipped for:', url, err)))
        );
      })
  );
});

// EVENT 2: AKTIVASI (Membersihkan Cache versi lama)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('AREs Service Worker: Menghapus cache versi lama (' + cacheName + ').');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// EVENT 3: FETCHING (Network-First dengan Fallback Offline Cache & Opaque Response Support)
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Validasi response valid (termasuk opaque CDN)
        if (response && (response.status === 200 || response.type === 'opaque' || response.type === 'cors')) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Jika jaringan mati / offline, cari dari cache
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Jika navigasi HTML halaman, fallback ke index AquaLab jika request berada di bawah AquaLab-Workspace
          if (event.request.mode === 'navigate') {
            if (event.request.url.includes('AquaLab-Workspace')) {
              return caches.match('./AquaLab-Workspace/index.html');
            }
            return caches.match('./index.html');
          }
        });
      })
  );
});


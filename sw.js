// Ganti versi menjadi v3 agar browser melakukan update otomatis
const CACHE_NAME = 'ares-portal-v3';

// Daftar file inti yang wajib didownload saat pertama kali instal (Pre-cache)
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './AREs%20Logo%20Outline.png',
  './AREs%20Logo%20Acronim.png',
  
  // Daftarkan halaman utama masing-masing alat (Tools)
  './AquaLab-Workspace/index.html',
  './StatWise/index.html',
  './BioTools/index.html',
  './EcoMetrics-Multivariat/index.html',
  './CiteShift/index.html',
  './ShifterAI/index.html',
  './Mendeley-Citation-Portal-FPIK-Unsoed-2018/index.html'
];

// EVENT 1: INSTALASI (Menyimpan file ke dalam Cache)
self.addEventListener('install', event => {
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('AREs Service Worker v3: Cache inti berhasil disimpan.');
        return cache.addAll(urlsToCache);
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

// EVENT 3: FETCHING (Strategi "Network First, Fallback to Cache")
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
        return response; 
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

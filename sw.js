const CACHE_NAME = 'ares-portal-v1';

// Daftar file inti milik portal AREs yang wajib disimpan ke memori HP (Cache) saat pertama kali diinstal
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './AREs%20Logo%20Outline.png',
  './AREs%20Logo%20Acronim.png'
];

// EVENT 1: INSTALASI (Menyimpan file ke dalam Cache)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('AREs Service Worker: Cache inti berhasil disimpan.');
        return cache.addAll(urlsToCache);
      })
  );
});

// EVENT 2: AKTIVASI (Membersihkan Cache lama jika Anda melakukan update versi aplikasi)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('AREs Service Worker: Menghapus cache versi lama.');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// EVENT 3: FETCHING (Strategi "Network First, Fallback to Cache")
self.addEventListener('fetch', event => {
  event.respondWith(
    // Langkah A: Coba ambil data terbaru dari Internet dulu
    fetch(event.request)
      .then(response => {
        // Cek jika respon dari internet valid, maka salin ke dalam Cache untuk update data offline
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
        return response; // Tampilkan halaman terbaru
      })
      .catch(() => {
        // Langkah B: Jika GAGAL (karena OFFLINE/Tidak ada sinyal), ambil data dari memori Cache!
        return caches.match(event.request);
      })
  );
});

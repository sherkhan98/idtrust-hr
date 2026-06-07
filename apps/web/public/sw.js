// PeopleOS Service Worker — Offline Mode
const CACHE_NAME = 'peopleos-v1';
const OFFLINE_QUEUE_KEY = 'offline-attendance-queue';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/school',
  '/kinder',
  '/offline',
];

// Install — cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // API requests — queue if offline
  if (url.pathname.startsWith('/api/v1/attendance')) {
    event.respondWith(
      fetch(event.request.clone()).catch(async () => {
        // Queue for later sync
        if (event.request.method === 'POST') {
          const body = await event.request.clone().json().catch(() => ({}));
          await queueOfflineAttendance(body);
          return new Response(
            JSON.stringify({ queued: true, message: 'Offline: Davomat navbatga qo\'shildi' }),
            { status: 202, headers: { 'Content-Type': 'application/json' } }
          );
        }
        return new Response(JSON.stringify({ error: 'Offline' }), { status: 503 });
      })
    );
    return;
  }

  // Pages — cache first for navigation
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(event.request).then(r => r || caches.match('/'))
      )
    );
    return;
  }

  // Default
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Queue offline attendance action
async function queueOfflineAttendance(data) {
  const db = await openDB();
  const tx = db.transaction('queue', 'readwrite');
  await tx.objectStore('queue').add({
    ...data,
    timestamp: Date.now(),
    synced: false,
  });
}

// Background sync — send queued attendance when online
self.addEventListener('sync', (event) => {
  if (event.tag === 'attendance-sync') {
    event.waitUntil(syncQueuedAttendance());
  }
});

async function syncQueuedAttendance() {
  try {
    const db = await openDB();
    const tx = db.transaction('queue', 'readwrite');
    const store = tx.objectStore('queue');
    const items = await store.getAll();

    for (const item of items) {
      if (item.synced) continue;
      try {
        await fetch('/api/v1/attendance/check-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
        await store.delete(item.id);
      } catch {}
    }
  } catch {}
}

// Simple IndexedDB helper
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('peopleos-offline', 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('queue')) {
        db.createObjectStore('queue', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

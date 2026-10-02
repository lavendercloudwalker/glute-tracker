// Cycle Compass. Bump this number whenever you upload a new version of the app
const VERSION = 'v3';
const CACHE = 'cycle-compass-' + VERSION;
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k.startsWith('cycle-compass-') && k !== CACHE).map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  // The app page: network first so updates arrive, saved copy when offline
  if (req.mode === 'navigate') {
    // Use the network if it answers within 3 seconds, otherwise open the saved copy.
    // Only good responses are saved, so an error page never becomes the offline copy.
    const net = fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); }
      return res;
    });
    e.respondWith(new Promise(resolve => {
      let done = false;
      const finish = r => { if (!done && r) { done = true; resolve(r); } };
      const timer = setTimeout(() => caches.match('./index.html').then(finish), 3000);
      net.then(res => { clearTimeout(timer); finish(res); })
         .catch(() => caches.match('./index.html').then(hit => finish(hit || Response.error())));
    }));
    return;
  }
  // Icons and fonts: saved copy first, then network
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});

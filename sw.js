const CACHE_NAME = 'audio-player-shell-v1';
// Файлы, которые мы хотим закэшировать.
// В нашем случае это только главная страница.
const urlsToCache = [
  './' // Означает index.html
];

// Событие 'install': срабатывает при установке Service Worker
self.addEventListener('install', (event) => {
  // Ждем, пока откроется кэш и добавятся наши файлы
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Кэш открыт');
        return cache.addAll(urlsToCache);
      })
  );
});

// Событие 'fetch': срабатывает каждый раз, когда страница делает сетевой запрос
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Ищем ответ в кэше
    caches.match(event.request)
      .then((response) => {
        // Если ответ найден в кэше, возвращаем его.
        // Иначе - делаем реальный сетевой запрос.
        return response || fetch(event.request);
      })
  );
});

const CACHE_NAME = 'audio-player-shell-v2'; // Увеличили версию кэша
// Кэшируем оболочку приложения и наши локальные иконки
const urlsToCache = [
  './', // index.html
  'icon-192.png',
  'icon-512.png'
];

// Событие 'install': кэшируем оболочку
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Кэшируем оболочку приложения');
        return cache.addAll(urlsToCache);
      })
  );
});

// Событие 'fetch': как обрабатывать запросы
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Если ресурс найден в кэше - отдаем его
        if (response) {
          return response;
        }

        // Если ресурс НЕ из нашего домена (например, аудио с ddns.net),
        // то мы его НЕ кэшируем, а просто делаем сетевой запрос.
        if (!event.request.url.startsWith(self.location.origin)) {
          return fetch(event.request);
        }
        
        // Если ресурс наш, но его нет в кэше,
        // делаем запрос, получаем ответ, клонируем его,
        // кладем клон в кэш и отдаем оригинал странице.
        return fetch(event.request).then(
          (response) => {
            // Проверяем, что ответ корректный
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Событие 'activate': удаляем старые кэши
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

export function generateFirebaseServiceWorker() {
  const swContent = `
    importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
    importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

    const firebaseConfig = {
      apiKey: "${import.meta.env.VITE_FIREBASE_API_KEY}",
      authDomain: "${import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}",
      projectId: "${import.meta.env.VITE_FIREBASE_PROJECT_ID}",
      storageBucket: "${import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}",
      messagingSenderId: "${import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID}",
      appId: "${import.meta.env.VITE_FIREBASE_APP_ID}"
    };

    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    self.addEventListener('install', (event) => {
      console.log('Service Worker installing...');
      self.skipWaiting();
    });

    self.addEventListener('activate', (event) => {
      console.log('Service Worker activating...');
      event.waitUntil(clients.claim());
    });

    messaging.onBackgroundMessage((payload) => {
      console.log('Received background message:', payload);
      
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: '/logo192.png',
        badge: '/badge-icon.png',
        tag: payload.data?.tag || 'default',
        data: payload.data,
        actions: [
          {
            action: 'view',
            title: 'Xem chi tiết'
          }
        ]
      };

      return self.registration.showNotification(notificationTitle, notificationOptions);
    });

    self.addEventListener('notificationclick', (event) => {
      const notification = event.notification;
      const action = event.action;
      const data = notification.data;

      notification.close();

      if (action === 'view' && data?.url) {
        clients.openWindow(data.url);
      }
      
      event.waitUntil(
        clients.matchAll({type: 'window'}).then(windowClients => {
          for (let client of windowClients) {
            if (client.url === '/' && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
      );
    });
  `;

  const blob = new Blob([swContent], { type: 'text/javascript' });
  return URL.createObjectURL(blob);
} 
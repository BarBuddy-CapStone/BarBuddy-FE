importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Lấy config từ server
fetch('/api/firebase/config')
  .then(response => response.json())
  .then(config => {
    firebase.initializeApp(config);
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
  }); 
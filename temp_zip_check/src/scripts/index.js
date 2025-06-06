// CSS imports
import '../styles/styles.css';

// Import routes and router
import './components/bottom-bar.js';
import App from './pages/app.js';
import router from './routes/index.js';
import pushNotification from './utils/push-notification.js';
import { NotificationView } from './views/notification-view.js';

// Inisialisasi NotificationView global
if (!window.globalNotificationView) {
  window.globalNotificationView = new NotificationView();
  document.body.insertAdjacentHTML('beforeend', window.globalNotificationView.render());
  window.globalNotificationView.afterRender();
}

window.addEventListener('hashchange', () => {
  router.renderPage();
});

window.addEventListener('load', () => {
  const token = localStorage.getItem('token');
  if (!token && (window.location.hash === '' || window.location.hash === '#/' || window.location.hash === '#')) {
    window.location.hash = '#/auth';
  } else {
    router.renderPage();
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  // Tidak perlu renderPage di sini, sudah di-handle di event load di atas

  // Initialize skip link
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      document.querySelector('#main-content').focus();
    });
  }

  // Initialize App for mobile navigation
  const navigationDrawer = document.getElementById('navigation-drawer');
  const drawerButton = document.getElementById('drawer-button');
  const content = document.getElementById('main-content');
  if (navigationDrawer && drawerButton && content) {
    new App({ navigationDrawer, drawerButton, content });
  }

  // Initialize push notifications
  try {
    await pushNotification.register();
    console.log('Push notifications initialized successfully');
  } catch (error) {
    console.error('Failed to initialize push notifications:', error);
  }
});

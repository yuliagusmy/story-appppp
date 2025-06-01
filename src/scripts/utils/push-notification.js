import CONFIG from '../config.js';

const pushNotification = {
  async register(token) {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    const registration = await navigator.serviceWorker.register('/service-worker.js');
    await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY)
    });

    // Kirim subscription ke API Dicoding
    await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subscription)
    });

    return subscription;
  },

  async unregister(token) {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ endpoint: subscription.endpoint })
      });
      await subscription.unsubscribe();
    }
  },

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
  }
};
export default pushNotification;
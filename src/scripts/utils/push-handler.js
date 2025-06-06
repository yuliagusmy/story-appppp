import CONFIG from '../config.js';

const pushHandler = {
  async sendPushNotification(subscription, payload) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/push/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          payload: {
            title: CONFIG.PUSH_NOTIFICATION_TITLE,
            body: payload,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png',
            data: {
              url: '/',
              timestamp: new Date().toISOString()
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send push notification');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  },

  async subscribeToPush(subscription) {
    try {
      const filtered = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth
        }
      };
      const response = await fetch(`${CONFIG.BASE_URL}/push/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filtered)
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe to push notifications');
      }

      return await response.json();
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      throw error;
    }
  },

  async unsubscribeFromPush(subscription) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/push/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });

      if (!response.ok) {
        throw new Error('Failed to unsubscribe from push notifications');
      }

      return await response.json();
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      throw error;
    }
  }
};

export default pushHandler;
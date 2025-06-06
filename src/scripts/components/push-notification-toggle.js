import pushNotification from '../utils/push-notification.js';

class PushNotificationToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    await this.render();
    await this.setInitialToggleState();
    this.setupEventListeners();
  }

  async setInitialToggleState() {
    const toggle = this.shadowRoot.querySelector('#push-toggle');
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !toggle) return;
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    toggle.checked = !!subscription;
  }

  async setupEventListeners() {
    const toggle = this.shadowRoot.querySelector('#push-toggle');
    if (toggle) {
      toggle.addEventListener('change', async (event) => {
        if (!('serviceWorker' in navigator)) {
          if (window.globalNotificationView) {
            window.globalNotificationView.showError('Service Worker tidak didukung di browser ini.');
          }
          toggle.checked = false;
          this.dispatchEvent(new CustomEvent('notif-status-changed', {
            detail: false,
            bubbles: true,
            composed: true
          }));
          return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
          if (window.globalNotificationView) {
            window.globalNotificationView.showError('Anda harus login untuk mengaktifkan notifikasi.');
          }
          toggle.checked = false;
          // Tetap dispatch event agar bottom bar update
          this.dispatchEvent(new CustomEvent('notif-status-changed', {
            detail: false,
            bubbles: true,
            composed: true
          }));
          return;
        }
        try {
          if (event.target.checked) {
            await pushNotification.register(token);
            if (window.globalNotificationView) {
              window.globalNotificationView.showSuccess('Push notifications enabled!');
            }
            this.dispatchEvent(new CustomEvent('notif-status-changed', {
              detail: true,
              bubbles: true,
              composed: true
            }));
          } else {
            await pushNotification.unregister(token);
            if (window.globalNotificationView) {
              window.globalNotificationView.showSuccess('Push notifications disabled');
            }
            this.dispatchEvent(new CustomEvent('notif-status-changed', {
              detail: false,
              bubbles: true,
              composed: true
            }));
          }
        } catch (error) {
          console.error('Error toggling push notifications:', error);
          if (window.globalNotificationView) {
            window.globalNotificationView.showError('Failed to toggle push notifications: ' + error.message);
          }
          if (toggle) {
            toggle.checked = !toggle.checked;
          }
          // Tetap dispatch event agar bottom bar update
          this.dispatchEvent(new CustomEvent('notif-status-changed', {
            detail: toggle.checked,
            bubbles: true,
            composed: true
          }));
        }
      });
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 1rem 0;
        }
        .toggle-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .toggle {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }
        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: background-color 0.4s;
          border-radius: 34px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: transform 0.4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #22c55e;
        }
        input:checked + .slider:before {
          transform: translateX(26px);
        }
        .notif-label {
          font-weight: 600;
          font-size: 1.08rem;
          transition: color 0.3s;
        }
        .notif-label.on {
          color: #22c55e;
        }
        .notif-label.off {
          color: #b0b0b0;
        }
      </style>
      <div class="toggle-container">
        <label class="toggle">
          <input type="checkbox" id="push-toggle">
          <span class="slider"></span>
        </label>
        <span class="notif-label off" id="notifLabel">Notif OFF</span>
      </div>
    `;

    // After render, set label state
    setTimeout(() => {
      const toggle = this.shadowRoot.querySelector('#push-toggle');
      const label = this.shadowRoot.querySelector('#notifLabel');
      if (toggle && label) {
        const updateLabel = () => {
          if (toggle.checked) {
            label.textContent = 'Notif ON';
            label.classList.add('on');
            label.classList.remove('off');
          } else {
            label.textContent = 'Notif OFF';
            label.classList.remove('on');
            label.classList.add('off');
          }
        };
        updateLabel();
        toggle.addEventListener('change', updateLabel);
      }
    }, 0);
  }
}

customElements.define('push-notification-toggle', PushNotificationToggle);
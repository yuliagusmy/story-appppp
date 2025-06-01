import pushNotification from '../utils/push-notification.js';

class PushNotificationToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  async setupEventListeners() {
    const toggle = this.shadowRoot.querySelector('#push-toggle');
    if (toggle) {
      toggle.addEventListener('change', async (event) => {
        const token = localStorage.getItem('token'); // Ambil token dari localStorage
        try {
          if (event.target.checked) {
            await pushNotification.register(token);
            this.showMessage('Push notifications enabled!');
          } else {
            await pushNotification.unregister(token);
            this.showMessage('Push notifications disabled');
          }
        } catch (error) {
          console.error('Error toggling push notifications:', error);
          this.showMessage('Failed to toggle push notifications: ' + error.message);
          if (toggle) {
            toggle.checked = !toggle.checked;
          }
        }
      });
    }
  }

  showMessage(message) {
    const messageElement = this.shadowRoot.querySelector('#message');
    if (messageElement) {
      messageElement.textContent = message;
      messageElement.style.display = 'block';
      setTimeout(() => {
        messageElement.style.display = 'none';
      }, 3000);
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
          transition: .4s;
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
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #2196F3;
        }
        input:checked + .slider:before {
          transform: translateX(26px);
        }
        #message {
          display: none;
          margin-top: 0.5rem;
          padding: 0.5rem;
          border-radius: 4px;
          background-color: #e3f2fd;
          color: #1976d2;
        }
      </style>
      <div class="toggle-container">
        <label class="toggle">
          <input type="checkbox" id="push-toggle">
          <span class="slider"></span>
        </label>
        <span>Enable Push Notifications</span>
      </div>
      <div id="message"></div>
    `;
  }
}

customElements.define('push-notification-toggle', PushNotificationToggle);
class BottomBar extends HTMLElement {
  connectedCallback() {
    this.render();
    this.highlightActive();
    this.setupListeners();
    window.addEventListener('hashchange', () => {
      if (!this.isTransitioning) {
        this.isTransitioning = true;
        this.showLoading();
        setTimeout(() => {
          this.highlightActive();
          this.toggleVisibility();
          this.hideLoading();
          this.isTransitioning = false;
        }, 200);
      }
    });
    this.toggleVisibility();
    this.checkNotifStatus();
    // Listen for notif status change event if available
    const toggle = document.querySelector('push-notification-toggle');
    if (toggle) {
      toggle.addEventListener('notif-status-changed', (e) => {
        this.updateNotifButton(e.detail === true);
      });
    }
  }

  render() {
    this.innerHTML = `
      <nav class="bottom-bar-nav">
        <button class="bottom-bar-btn" id="bottom-home" title="Beranda">
          <i class="fas fa-home"></i>
          <span class="label">Home</span>
        </button>
        <button class="bottom-bar-btn" id="bottom-saved" title="Save Story">
          <i class="fas fa-bookmark"></i>
          <span class="label">Save</span>
        </button>
        <button class="bottom-bar-btn" id="bottom-add" title="Add Story">
          <i class="fas fa-plus-circle"></i>
          <span class="label">Add</span>
        </button>
        <button class="bottom-bar-btn" id="bottom-notif" title="Notif" data-notif="off">
          <span class="notif-badge" style="display:none;"></span>
          <i class="fas fa-bell"></i>
          <span class="label">Notif</span>
        </button>
        <button class="bottom-bar-btn" id="bottom-logout" title="Logout">
          <i class="fas fa-sign-out-alt"></i>
          <span class="label">Logout</span>
        </button>
      </nav>
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
    `;
  }

  highlightActive() {
    const hash = window.location.hash;
    this.querySelectorAll('.bottom-bar-btn').forEach(btn => btn.classList.remove('active'));
    if (hash.startsWith('#/saved')) {
      this.querySelector('#bottom-saved').classList.add('active');
    } else if (hash.startsWith('#/add')) {
      this.querySelector('#bottom-add').classList.add('active');
    } else if (hash === '' || hash === '#' || hash === '#/' || hash.startsWith('#/')) {
      this.querySelector('#bottom-home').classList.add('active');
    }
  }

  setupListeners() {
    this.querySelector('#bottom-home').onclick = () => window.location.hash = '#/';
    this.querySelector('#bottom-saved').onclick = () => window.location.hash = '#/saved';
    this.querySelector('#bottom-add').onclick = () => window.location.hash = '#/add';
    this.querySelector('#bottom-notif').onclick = () => {
      // Toggle push notification modal or switch
      const toggle = document.querySelector('push-notification-toggle');
      if (toggle) toggle.shadowRoot.querySelector('#push-toggle').click();
    };
    this.querySelector('#bottom-logout').onclick = () => {
      if (typeof window.showLogoutDialog === 'function') {
        window.showLogoutDialog();
      }
    };
  }

  updateNotifButton(isActive) {
    const notifBtn = this.querySelector('#bottom-notif');
    const notifIcon = notifBtn?.querySelector('i');
    const badge = notifBtn?.querySelector('.notif-badge');
    if (!notifBtn || !notifIcon || !badge) return;
    if (isActive) {
      notifBtn.setAttribute('data-notif', 'on');
      notifIcon.style.color = '#22c55e'; // green
      badge.style.display = 'block';
      badge.style.background = '#22c55e';
      badge.style.width = '10px';
      badge.style.height = '10px';
      badge.style.borderRadius = '50%';
      badge.style.position = 'absolute';
      badge.style.top = '8px';
      badge.style.right = '18px';
      badge.style.boxShadow = '0 0 4px #22c55e88';
    } else {
      notifBtn.setAttribute('data-notif', 'off');
      notifIcon.style.color = '';
      badge.style.display = 'none';
    }
  }

  checkNotifStatus() {
    // Assume push-notification-toggle exposes a method or event for status
    const toggle = document.querySelector('push-notification-toggle');
    if (toggle && typeof toggle.isSubscribed === 'function') {
      this.updateNotifButton(toggle.isSubscribed());
    } else if (window.localStorage) {
      // Fallback: check localStorage (customize as needed)
      const notif = localStorage.getItem('push-subscribed');
      this.updateNotifButton(notif === 'true');
    }
  }

  toggleVisibility() {
    if (window.location.hash.startsWith('#/auth')) {
      this.style.display = 'none';
    } else {
      this.style.display = '';
    }
  }

  showLoading() {
    // Implementation of showLoading method
  }

  hideLoading() {
    // Implementation of hideLoading method
  }
}
customElements.define('bottom-bar', BottomBar);
import AuthModel from '../models/auth-model.js';
import UrlParser from '../utils/url-parser';
import NotFoundView from '../views/not-found-view';
import { NotificationView } from '../views/notification-view.js';

export class Router {
  constructor(routes) {
    this.routes = routes;
    this.contentElement = document.querySelector('#main-content');
    this.authModel = new AuthModel();
    this.notification = new NotificationView();
    this.notFoundView = new NotFoundView();
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    const route = this.routes[url] || null;
    const urlParts = UrlParser.parseActiveUrlWithoutCombiner();

    try {
      if (route) {
        // Check authentication for protected routes
        const protectedRoutes = ['/', '/add', '/saved'];
        const isLoggedIn = !!this.authModel.getToken();
        if (protectedRoutes.includes(url) && !isLoggedIn) {
          window.location.hash = '#/auth';
          return;
        }

        // Start view transition
        let presenter;
        if (url.includes('/:id') && urlParts.id) {
          presenter = new route.Presenter(urlParts.id);
        } else if (route.param) {
          presenter = new route.Presenter(route.param);
        } else {
          presenter = new route.Presenter();
        }

        if (document.startViewTransition) {
          await document.startViewTransition(async () => {
            if (!presenter.view || typeof presenter.view.render !== 'function') {
              throw new Error('View not properly initialized');
            }
            this.contentElement.innerHTML = presenter.view.render();
            if (typeof presenter.view.afterRender === 'function') {
              await presenter.view.afterRender();
            }
            await presenter.init();
            this.updateNavigation();
          }).finished;
        } else {
          // Fallback for browsers that don't support View Transitions API
          if (!presenter.view || typeof presenter.view.render !== 'function') {
            throw new Error('View not properly initialized');
          }
          this.contentElement.innerHTML = presenter.view.render();
          if (typeof presenter.view.afterRender === 'function') {
            await presenter.view.afterRender();
          }
          await presenter.init();
          this.updateNavigation();
        }
      } else {
        this.contentElement.innerHTML = this.notFoundView.getTemplate();
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      this.contentElement.innerHTML = this.notFoundView.getTemplate();
    }
  }

  navigate(path) {
    window.location.hash = path;
  }

  updateNavigation() {
    const navList = document.querySelector('#nav-list');
    if (!navList) return;

    const isLoggedIn = this.authModel.isLoggedIn();

    // Update navigation items based on auth status
    if (isLoggedIn) {
      navList.innerHTML = `
        <li><a href="#/" class="nav-link"><i class="fas fa-home"></i> Beranda</a></li>
        <li><a href="#/saved" class="nav-link"><i class="fas fa-bookmark"></i> Save Story</a></li>
        <li><a href="#/add" class="nav-link btn-action btn-navbar-add"><i class="fas fa-plus-circle"></i> Add Story</a></li>
        <li><push-notification-toggle></push-notification-toggle></li>
        <li><a href="#" id="logout-button" class="nav-link"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
      `;

      // Add logout handler with confirmation dialog
      const logoutButton = document.querySelector('#logout-button');
      if (logoutButton) {
        logoutButton.addEventListener('click', async (e) => {
          e.preventDefault();
          // Show confirmation dialog
          let dialog = document.querySelector('.logout-dialog');
          if (!dialog) {
            dialog = document.createElement('div');
            dialog.className = 'logout-dialog';
            dialog.innerHTML = `
              <div class="logout-dialog-content">
                <h3>Konfirmasi Logout</h3>
                <p>Apakah Anda yakin ingin keluar?</p>
                <div class="logout-dialog-buttons">
                  <button class="btn-cancel">Tidak</button>
                  <button class="btn-confirm">Ya</button>
                </div>
              </div>
            `;
            document.body.appendChild(dialog);
          }
          dialog.classList.add('active');
          document.body.classList.add('dialog-open');

          // Handler
          const cleanup = () => {
            dialog.classList.remove('active');
            document.body.classList.remove('dialog-open');
          };
          const btnCancel = dialog.querySelector('.btn-cancel');
          const btnConfirm = dialog.querySelector('.btn-confirm');

          // Remove previous listeners
          btnCancel.onclick = null;
          btnConfirm.onclick = null;
          dialog.onclick = null;

          // Cancel
          btnCancel.onclick = (ev) => {
            ev.stopPropagation();
            cleanup();
          };
          // Confirm
          btnConfirm.onclick = (ev) => {
            ev.stopPropagation();
            cleanup();
            this.authModel.logout();
            this.notification.showSuccess('Berhasil logout');
            setTimeout(() => {
              this.navigate('/auth');
            }, 1000);
          };
          // Click outside
          dialog.onclick = (ev) => {
            if (ev.target === dialog) {
              cleanup();
            }
          };
        });
      }
    } else {
      navList.innerHTML = `
        <li><a href="#/auth" class="nav-link"><i class="fas fa-sign-in-alt"></i> Login</a></li>
      `;
    }
  }
}

// Export the Router class
export default Router;
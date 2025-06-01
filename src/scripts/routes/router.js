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
        if (document.startViewTransition) {
          await document.startViewTransition(async () => {
            const presenter = route.param ? new route.Presenter(route.param) : new route.Presenter();
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
          const presenter = route.param ? new route.Presenter(route.param) : new route.Presenter();
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
        <li><a href="#/" class="nav-link">Beranda</a></li>
        <li><a href="#/saved" class="nav-link">Story Disimpan</a></li>
        <li><a href="#/add" class="nav-link btn-action btn-navbar-add">Tambah Cerita</a></li>
        <li><a href="#" id="logout-button" class="nav-link">Logout</a></li>
      `;

      // Add logout handler
      const logoutButton = document.querySelector('#logout-button');
      if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
          e.preventDefault();
          this.authModel.logout();
          this.notification.showSuccess('Berhasil logout');
          setTimeout(() => {
            this.navigate('/auth');
          }, 1000);
        });
      }
    } else {
      navList.innerHTML = `
        <li><a href="#/auth" class="nav-link">Login</a></li>
      `;
    }
  }
}

// Export the Router class
export default Router;
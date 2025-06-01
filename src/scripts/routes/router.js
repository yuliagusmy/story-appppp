import AuthModel from '../models/auth-model.js';
import { AddStoryPresenter } from '../presenters/add-story-presenter.js';
import { AuthPresenter } from '../presenters/auth-presenter.js';
import { SavedStoryPresenter } from '../presenters/saved-story-presenter.js';
import { StoryDetailPresenter } from '../presenters/story-detail-presenter.js';
import { StoryListPresenter } from '../presenters/story-list-presenter.js';
import { NotificationView } from '../views/notification-view.js';

export class Router {
  constructor() {
    this.routes = {
      '/': StoryListPresenter,
      '/add': AddStoryPresenter,
      '/auth': AuthPresenter,
      '/detail': StoryDetailPresenter,
      '/saved': SavedStoryPresenter,
    };
    this.contentElement = document.querySelector('#main-content');
    this.authModel = new AuthModel();
    this.notification = new NotificationView();
  }

  async renderPage() {
    const hash = window.location.hash.slice(1) || '/';
    let route = hash;
    let param = null;
    if (route.startsWith('/detail/')) {
      route = '/detail';
      param = hash.split('/')[2];
    }
    const Presenter = this.routes[route];

    if (!Presenter) {
      this.contentElement.innerHTML = '<h1>404 - Page Not Found</h1>';
      return;
    }

    // Check authentication for protected routes
    const protectedRoutes = ['/', '/add', '/saved'];
    const isLoggedIn = !!this.authModel.getToken();
    if (protectedRoutes.includes(route) && !isLoggedIn) {
      window.location.hash = '#/auth';
      return;
    }

    try {
      // Start view transition
      if (document.startViewTransition) {
        await document.startViewTransition(async () => {
          const presenter = param ? new Presenter(param) : new Presenter();
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
        const presenter = param ? new Presenter(param) : new Presenter();
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
    } catch (error) {
      console.error('Error rendering page:', error);
      this.contentElement.innerHTML = `<div class="error-message">${error.message}</div>`;
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
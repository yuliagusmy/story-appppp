import NotFoundView from './not-found-view';

export class StoryDetailView {
  constructor() {
    this.container = null;
  }

  setContainer(container) {
    this.container = container;
  }

  render() {
    return '<div class="story-detail-container"><p>Memuat detail cerita...</p></div>';
  }

  renderDetail(story) {
    const hasLocation = story.lat && story.lon;
    const mapId = 'map-' + story.id;
    const createdAt = new Date(story.createdAt);

    this.container.innerHTML = `
      <div class="story-detail-container">
        <div class="story-detail-header">
          <h1 class="story-detail-title">${story.name || 'Untitled Story'}</h1>
          <div class="story-detail-meta-row">
            <div class="meta-item">
              <i class="fas fa-user"></i>
              <span>Oleh: ${story.name}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-calendar"></i>
              <span>${createdAt.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })} ${createdAt.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
            ${hasLocation ? `
              <div class="meta-item">
                <i class="fas fa-map-marker-alt"></i>
                <a href="https://www.google.com/maps?q=${story.lat},${story.lon}"
                   target="_blank"
                   rel="noopener noreferrer">
                  Lihat di Google Maps
                </a>
              </div>
              <div class="meta-item coordinates">
                <i class="fas fa-compass"></i>
                ${story.lat.toFixed(6)}, ${story.lon.toFixed(6)}
              </div>
            ` : ''}
          </div>
        </div>

        <div class="story-detail-image">
          <img
            src="${story.photoUrl || story.photo}"
            alt="Foto cerita ${story.name}"
            loading="lazy"
            onerror="this.src='/placeholder.png'"
          >
        </div>
        ${hasLocation ? `
          <div class="story-detail-map-preview">
            <div id="detail-map-preview" class="map-static-preview" style="width:100%;height:200px;border-radius:12px;box-shadow:0 2px 8px rgba(44,62,80,0.10);margin-bottom:1.2rem;"></div>
          </div>
        ` : ''}
        <div class="story-detail-content">
          <p class="story-detail-description">${story.description}</p>

          ${hasLocation ? `
            <div class="story-detail-map">
              <h2 class="map-title">Lokasi</h2>
              <div id="${mapId}" class="map"></div>
            </div>
          ` : ''}
        </div>

        <div class="story-detail-actions">
          ${!story.isSaved ? `
          <button id="save-story" class="story-more-btn">
            <i class="fas fa-bookmark-o"></i>
            Simpan Cerita
          </button>
          ` : ''}
          <a href="#/" class="story-more-btn">
            <i class="fas fa-arrow-left"></i>
            Kembali
          </a>
        </div>
      </div>
    `;

    if (hasLocation) {
      setTimeout(() => {
        if (window.L && document.getElementById('detail-map-preview')) {
          this.initializeMap(story);
        }
      }, 100);
    }

    // Save button logic (hanya jika tombol ada)
    const saveBtn = document.getElementById('save-story');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (this.onSaveStory) {
          this.onSaveStory(story);
        }
      });
    }
  }

  initializeMap(story) {
    if (this.onInitializeMap) {
      this.onInitializeMap(story);
    }
  }

  setSaveStoryCallback(callback) {
    this.onSaveStory = callback;
  }

  setInitializeMapCallback(callback) {
    this.onInitializeMap = callback;
  }

  renderError(message) {
    let errorMessage;
    if (message && message.toLowerCase().includes('not found')) {
      const notFoundView = new NotFoundView();
      errorMessage = notFoundView.getTemplate();
    } else {
      errorMessage = `<div class="error-message">${message}</div><a href="#/" class="story-more-btn">Kembali</a>`;
    }
    if (!this.container) {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.innerHTML = errorMessage;
      } else {
        alert(message);
      }
      return;
    }
    this.container.innerHTML = errorMessage;
  }
}
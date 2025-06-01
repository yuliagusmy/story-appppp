export class SavedStoryView {
  constructor() {
    this.container = null;
  }

  setContainer(container) {
    this.container = container;
  }

  render() {
    return `
      <section class="story-list-container">
        <h1 class="story-list-title">Story Disimpan</h1>
        <div id="saved-story-list" class="story-list"></div>
      </section>
    `;
  }

  renderStories(stories) {
    const container = document.getElementById('saved-story-list');
    if (!container) return;

    if (!stories || stories.length === 0) {
      container.innerHTML = '<div class="no-stories">Belum ada story yang disimpan.</div>';
      return;
    }

    container.innerHTML = stories.map(story => `
      <article class="story-card">
        <div class="story-image">
          <img src="${story.photoUrl || story.photo}" alt="Foto cerita ${story.name}" loading="lazy">
        </div>
        <div class="story-content">
          <div>
            <h2 class="story-title">${story.name}</h2>
            <p class="story-description">${story.description}</p>
            <div class="story-meta">
              <span class="story-date">
                <i class="fas fa-calendar"></i>
                ${new Date(story.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              ${story.lat && story.lon ? `<span class="story-location"><i class="fas fa-map-marker-alt"></i> <a href="https://www.google.com/maps?q=${story.lat},${story.lon}" target="_blank">Lihat Lokasi</a></span>` : ''}
            </div>
          </div>
          <a class="story-more-btn" href="#/detail/${story.id}">Selengkapnya</a>
        </div>
      </article>
    `).join('');
  }

  renderError(message) {
    const container = document.getElementById('saved-story-list');
    if (container) {
      container.innerHTML = `<div class="error-message">${message}</div>`;
    }
  }
}
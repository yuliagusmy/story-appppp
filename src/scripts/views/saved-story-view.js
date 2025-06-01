export class SavedStoryView {
  constructor() {
    this.container = null;
    this.onUnsaveStory = null;
  }

  setContainer(container) {
    this.container = container;
  }

  setUnsaveStoryCallback(callback) {
    this.onUnsaveStory = callback;
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
      <article class="story-card" style="position:relative;">
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
        <button class="story-more-btn unsave-btn" data-id="${story.id}" title="Hapus dari Story Disimpan" style="position:absolute;bottom:1rem;right:1rem;z-index:2;min-width:unset;padding:0.5rem 1rem;background:#e74c3c;color:#fff;border:none;box-shadow:0 2px 8px rgba(44,62,80,0.10);display:flex;align-items:center;gap:0.5rem;"><i class="fas fa-trash"></i> Hapus</button>
      </article>
    `).join('');

    // Tambahkan event listener untuk tombol hapus
    container.querySelectorAll('.unsave-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        if (this.onUnsaveStory) this.onUnsaveStory(id);
      });
    });
  }

  renderError(message) {
    const container = document.getElementById('saved-story-list');
    if (container) {
      container.innerHTML = `<div class="error-message">${message}</div>`;
    }
  }
}
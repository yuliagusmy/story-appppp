import { StoryModel } from '../models/story-model.js';
import { isStorySaved, saveStory } from '../utils/saved-story.js';
import { StoryDetailView } from '../views/story-detail-view.js';

export class StoryDetailPresenter {
  constructor(storyId) {
    this.storyId = storyId;
    this.model = new StoryModel();
    this.view = new StoryDetailView();
    this.setupViewCallbacks();
    this.currentStory = null;
  }

  setupViewCallbacks() {
    this.view.setSaveStoryCallback(this.handleSaveStory.bind(this));
    this.view.setInitializeMapCallback(this.initializeMap.bind(this));
  }

  async init() {
    try {
      console.log('DetailPresenter: storyId =', this.storyId);
      const story = await this.model.getStoryById(this.storyId);
      console.log('DetailPresenter: story =', story);
      if (!story) throw new Error('Cerita tidak ditemukan');

      // Add saved status to story object
      story.isSaved = await isStorySaved(story.id);
      this.currentStory = story;

      this.view.setContainer(document.querySelector('#main-content'));
      this.view.renderDetail(story);
    } catch (error) {
      this.view.renderError(error.message || 'Gagal memuat detail cerita');
    }
  }

  async handleSaveStory(story) {
    await saveStory(story);
    await this.init(); // refresh UI
  }

  initializeMap(story) {
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    });
    const carto = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
    });
    const baseMaps = {
      "OpenStreetMap": osm,
      "CartoDB Light": carto
    };
    const map = L.map('detail-map-preview', {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false
    }).setView([story.lat, story.lon], 14);

    osm.addTo(map);
    L.control.layers(baseMaps).addTo(map);
    const marker = L.marker([story.lat, story.lon]).addTo(map);
    marker.bindPopup(`<b>${story.name}</b><br>${story.description || ''}`).openPopup();
  }
}
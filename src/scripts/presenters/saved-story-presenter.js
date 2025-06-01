import { getSavedStories, unsaveStory } from '../utils/saved-story.js';
import { SavedStoryView } from '../views/saved-story-view.js';

export class SavedStoryPresenter {
  constructor() {
    this.view = new SavedStoryView();
    this.setupViewCallbacks();
  }

  setupViewCallbacks() {
    this.view.setUnsaveStoryCallback(this.handleUnsaveStory.bind(this));
  }

  async init() {
    try {
      this.view.setContainer(document.querySelector('#main-content'));
      const savedStories = await getSavedStories();
      this.view.renderStories(savedStories);
    } catch (error) {
      this.view.renderError(error.message || 'Gagal memuat cerita yang disimpan');
    }
  }

  async handleUnsaveStory(storyId) {
    await unsaveStory(storyId);
    await this.init(); // refresh UI
  }
}
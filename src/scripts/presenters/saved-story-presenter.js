import { StoryModel } from '../models/story-model.js';
import { getSavedStories } from '../utils/saved-story.js';
import { SavedStoryView } from '../views/saved-story-view.js';

export class SavedStoryPresenter {
  constructor() {
    this.model = new StoryModel();
    this.view = new SavedStoryView();
  }

  async init() {
    try {
      this.view.setContainer(document.querySelector('#main-content'));
      const savedIds = getSavedStories();

      if (!savedIds.length) {
        this.view.renderStories([]);
        return;
      }

      const allStories = await this.model.getStories();
      const savedStories = allStories.filter(story => savedIds.includes(story.id));
      this.view.renderStories(savedStories);
    } catch (error) {
      this.view.renderError(error.message || 'Gagal memuat cerita yang disimpan');
    }
  }
}
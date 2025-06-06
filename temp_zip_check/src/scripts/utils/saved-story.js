import { saveStory as dbSaveStory, deleteSavedStory, getAllSavedStories, getSavedStory } from './story-db.js';

// Helper untuk fitur save story di localStorage
const SAVED_STORY_KEY = 'saved_story_ids';

export async function getSavedStories() {
  return getAllSavedStories();
}

export async function isStorySaved(storyId) {
  return !!(await getSavedStory(storyId));
}

export async function saveStory(story) {
  return dbSaveStory(story);
}

export async function unsaveStory(storyId) {
  return deleteSavedStory(storyId);
}
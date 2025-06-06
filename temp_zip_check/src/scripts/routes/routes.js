import { AddStoryPresenter } from '../presenters/add-story-presenter.js';
import { AuthPresenter } from '../presenters/auth-presenter.js';
import { SavedStoryPresenter } from '../presenters/saved-story-presenter.js';
import { StoryDetailPresenter } from '../presenters/story-detail-presenter.js';
import { StoryListPresenter } from '../presenters/story-list-presenter.js';

const routes = {
  '/': {
    Presenter: StoryListPresenter,
    param: null
  },
  '/add': {
    Presenter: AddStoryPresenter,
    param: null
  },
  '/auth': {
    Presenter: AuthPresenter,
    param: null
  },
  '/detail/:id': {
    Presenter: StoryDetailPresenter,
    param: null
  },
  '/saved': {
    Presenter: SavedStoryPresenter,
    param: null
  }
};

export default routes;

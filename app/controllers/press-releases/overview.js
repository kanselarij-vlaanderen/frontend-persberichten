import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import CONFIG from '../../config/constants';

export default class PressReleasesOverviewController extends Controller {
  @service store;
  @service currentSession;
  @service router;

  @tracked showNewPressReleaseModal = false;

  @task
  *createNewPressRelease(title) {
    const now = new Date();
    const creator = this.currentSession.organization;
    const user = this.currentSession.user;
    const pressRelease = this.store.createRecord('press-release', {
      title,
      created: now,
      modified: now,
      creator
    });
    yield pressRelease.save();
    const { CREATE } = CONFIG.PRESS_RELEASE_ACTIVITY;
    const activity = this.store.createRecord('press-release-activity', {
      startDate: now,
      type: CREATE,
      organization: creator,
      pressRelease: pressRelease,
      creator: user
    });
    yield activity.save();
    this.showNewPressReleaseModal = false;
    this.router.transitionTo('press-releases.press-release.edit', pressRelease.id);
  }

  @action
  openNewPressReleaseModal() {
    this.showNewPressReleaseModal = true;
  }

  @action
  closeNewPressReleaseModal() {
    this.showNewPressReleaseModal = false;
  }
}

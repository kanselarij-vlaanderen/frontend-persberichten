import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import CONFIG from '../../config/constants';

export default class PressReleasesOverviewController extends Controller {
  @service currentSession;
  @service activityTracker;
  @service store;
  @service router;

  @tracked showNewPressReleaseModal = false;

  @task
  *createNewPressRelease(title) {
    const now = new Date();
    const pressRelease = this.store.createRecord('press-release', {
      title,
      created: now,
      modified: now,
      creator: this.currentSession.organization
    });
    yield pressRelease.save();
    yield this.activityTracker.addActivity(this.pressRelease, CONFIG.PRESS_RELEASE_ACTIVITY.CREATE);
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

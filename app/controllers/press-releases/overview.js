import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';

export default class PressReleasesOverviewController extends Controller {
  @service store;
  @service currentSession;

  @tracked showNewPressReleaseModal = false;

  @task
  *createNewPressRelease(title) {
    const now = new Date();
    const creator = this.currentSession.organization;
    const pressRelease = this.store.createRecord('press-release', {
      title,
      created: now,
      modified: now,
      creator
    });
    yield pressRelease.save();
    this.showNewPressReleaseModal = false;
    this.transitionToRoute('press-releases.press-release.edit', pressRelease.id);
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

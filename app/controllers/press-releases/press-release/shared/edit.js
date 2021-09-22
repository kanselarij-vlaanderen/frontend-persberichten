import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';
import { isBlank } from '@ember/utils';

export default class PressReleasesPressReleaseSharedEditController extends Controller {
  @service currentSession;

  @tracked showConfirmationModal = false;

  get snapshot() {
    return this.model;
  }

  get pressRelease() {
    return this.snapshot.pressRelease;
  }

  async deleteClaimToken() {
    const collaborationActivity = await this.pressRelease.collaboration;
    const url = `/collaboration-activities/${collaborationActivity.id}/claims`;
    const response = await fetch(url, {
        method: 'DELETE',
      }
    );
    return response;
  }

  async transitionBack() {
    // If no route where you returned from go to the shared page
    const response = await this.deleteClaimToken();
    if (response.status ===  204) {
      if (history.length > 1) {
        history.back();
      } else {
        this.router.transitionTo('press-releases.overview.shared');
      }
    }
  }

  @task
  *navigateBack() {
    const isDirty = yield this.snapshot.isDirty();
    if (isDirty) {
      this.showConfirmationModal = true;
    } else {
      this.transitionBack();
    }
  }

  @task
  *confirmNavigationBack() {
    yield this.snapshot.rollback();
    this.showConfirmationModal = false;
    this.transitionBack();
  }

  @action
  cancelNavigationBack() {
    this.showConfirmationModal = false;
  }

  @action
  saveChanges() {
    this.savePressRelease.perform();
  }

  @action
  async saveChangesAndNavigateBack() {
    await this.savePressRelease.perform();
    this.transitionBack();
  }

  @task
  *savePressRelease() {
    yield this.snapshot.save();
  }
}
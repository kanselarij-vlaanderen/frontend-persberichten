import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';
import CONFIG from '../../../../config/constants';

export default class PressReleasesPressReleaseSharedEditController extends Controller {
  @service toaster;
  @service currentSession;
  @service activityTracker;
  @service router;

  @tracked collaboration;
  @tracked showConfirmationModal = false;

  get snapshot() {
    return this.model;
  }

  get pressRelease() {
    return this.snapshot.pressRelease;
  }

  @task
  *navigateBack() {
    const isDirty = yield this.snapshot.isDirty();
    if (isDirty) {
      this.showConfirmationModal = true;
    } else {
      yield this.unclaimEditToken();
    }
  }

  @task
  *confirmNavigationBack() {
    yield this.snapshot.rollback();
    this.showConfirmationModal = false;
    yield this.unclaimEditToken();
  }

  @action
  cancelNavigationBack() {
    this.showConfirmationModal = false;
  }

  @task
  *savePressRelease() {
    if (yield this.snapshot.isDirty()) {
      // Note: press-release-activity must be created before distributing data across collaborators
      yield this.activityTracker.addActivity(this.pressRelease, CONFIG.PRESS_RELEASE_ACTIVITY.EDIT);

      yield this.snapshot.save();

      // Distribute activity across all collaborators
      try {
        const url = `/collaboration-activities/${this.collaboration.id}`;
        const response = yield fetch(url, {
          method: 'PUT'
        });
        if (response.status === 204) {
          // Remove existing approvals because press-release has changed
          const url = `/collaboration-activities/${this.collaboration.id}/approvals`;
          const response = yield fetch(url, {
            method: 'DELETE',
          });
          if (response.status === 204) {
            // TODO force reload of approval-status component
            this.toaster.success('Persbericht werd succesvol opgeslagen.');
          } else {
            this.toaster.error('Er is iets misgelopen bij het ongedaan maken van de goedkeuringen.');
          }
        } else {
          this.toaster.error('Er is iets misgelopen bij het verspreiden van de wijzigingen aan het persbericht.');
        }
      } catch(err) {
        this.toaster.error('Er is iets misgegaan bij het opslaan van het persbericht.');
      }
    }
  }

  @task
  *saveAndClose() {
    yield this.savePressRelease.perform();
    yield this.unclaimEditToken();
  }

  async unclaimEditToken() {
    const url = `/collaboration-activities/${this.collaboration.id}/claims`;
    const response = await fetch(url, {
        method: 'DELETE',
      }
    );
    if (response.status === 204 || response.status === 409) {
      // Note: 409 Conflict response status means the token claim is already removed by a batch job
      this.router.transitionTo('press-releases.press-release.shared.read');
    } else {
      this.toaster.error('Er is iets misgelopen bij het vrijgeven van het persbericht.');
    }
  }
}

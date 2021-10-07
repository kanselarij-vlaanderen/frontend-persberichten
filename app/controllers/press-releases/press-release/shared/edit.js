import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';
import CONFIG from '../../../../config/constants';

export default class PressReleasesPressReleaseSharedEditController extends Controller {
  @service currentSession;
  @service store;
  @service router;

  @tracked collaborators;
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
        this.router.transitionTo('press-releases.overview.shared');
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
  async saveChanges() {
    // Create press release activity
    const creator = this.currentSession.organization;
    const user = this.currentSession.user;
    const { EDIT } = CONFIG.PRESS_RELEASE_ACTIVITY;
    const activity = this.store.createRecord('press-release-activity', {
      startDate: new Date(),
      type: EDIT,
      organization: creator,
      pressRelease: this.pressRelease,
      creator: user
    });
    await activity.save();
    await this.savePressRelease.perform();

    const collaborationActivity = await this.pressRelease.collaboration;
    // Make updated data available for all collaborators
    const url = `/collaboration-activities/${collaborationActivity.id}`;
    const response = await fetch(url, {
        method: 'PUT',
      }
    ).catch(err => console.log(err));
    if (response.status === 200) {
      // Remove existing approvals because press-release has changed
      const url = `/collaboration-activities/${collaborationActivity.id}/approvals`;
      const response = await fetch(url, {
          method: 'DELETE',
        }
      ).catch(err => console.log(err));
      if (response.status === 204) {
        // TODO Force reload of approvals linked to the collaboration-activity
        await collaborationActivity.hasMany('approvalActivities').reload();
      }
    }
  }

  @action
  async saveChangesAndNavigateBack() {
    await this.saveChanges();
    this.transitionBack();
  }

  @task
  *savePressRelease() {
    yield this.snapshot.save();
  }
}

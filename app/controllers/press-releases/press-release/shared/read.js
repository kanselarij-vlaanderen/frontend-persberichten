import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PressReleasesPressReleaseSharedReadController extends Controller {
  @service currentSession;
  @service router;

  @tracked collaboration;
  @tracked collaborators;
  @tracked approvalActivities;
  @tracked editingUser;
  @tracked isEditPossible;
  @tracked showApprovalModal = false;
  @tracked showCoEditModal = false;
  @tracked didUserApprove = false;

  @task
  *confirmApproval() {
    const url = `/collaboration-activities/${this.collaboration.id}/approvals`;
    const response = yield fetch(url, {
        method: 'POST',
      }
    ).catch(err => console.log(err));
    if (response.status === 201) {
      const url = `/collaboration-activities/${this.collaboration.id}`;
      const response = yield fetch(url, {
          method: 'PUT'
        }
      ).catch(err => console.log(err));
      if (response.status === 200) {
        this.closeApprovalModal();
        this.router.refresh();
      }
    }
  }

  @task
  *stopCoEdit() {
    const url = `/collaboration-activities/${this.collaboration.id}`;
    const response = yield fetch(url, {
        method: 'DELETE',
      }
    ).catch(err => console.log(err));

    if (response.status === 200) {
      this.router.transitionTo('press-releases.press-release.edit', this.pressRelease.id);
    }
  }

  @action
  async checkApprovals() {
    if (this.collaborators.length === this.approvalActivities.length + 1) {
      this.stopCoEdit.perform();
    } else {
      this.openCoEditModal();
    }
  }

  @action
  openApprovalModal() {
    this.showApprovalModal = true;
  }

  @action
  closeApprovalModal() {
    this.showApprovalModal = false;
  }

  @action
  openCoEditModal() {
    this.showCoEditModal = true;
  }

  @action
  closeCoEditModal() {
    this.showCoEditModal = false;
  }
}

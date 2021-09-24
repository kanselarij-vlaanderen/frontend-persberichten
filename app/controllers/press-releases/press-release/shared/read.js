import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PressReleasesPressReleaseSharedReadController extends Controller {
  @service currentSession;

  @tracked collaboration;
  @tracked collaborators;
  @tracked showApprovalModal = false;

  @task
  *confirmApproval() {
    const url = `/collaboration-activities/${this.collaboration.id}/approvals`;
    const response = yield fetch(url, {
        method: 'POST',
      }
    ).catch(err => console.log(err));
    if (response.status === 201) {
      const url = `/collaboration-activities/${this.collaboration.id}`;
      yield fetch(url, {
          methor: 'PUT'
        }
      ).catch(err => console.log(err));
    }
    this.closeApprovalModal();
    this.send('reloadModel');
  }

  @action
  openApprovalModal() {
    this.showApprovalModal = true;
  }

  @action
  closeApprovalModal() {
    this.showApprovalModal = false;
  }
}

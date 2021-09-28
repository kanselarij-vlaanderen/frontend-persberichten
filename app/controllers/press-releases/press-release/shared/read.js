import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PressReleasesPressReleaseSharedReadController extends Controller {
  @service currentSession;
  @service('router') routerService;

  @tracked collaboration;
  @tracked collaborators;
  @tracked showApprovalModal = false;
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
      console.log(response)
      if (response.status === 204) {}
    }
    this.closeApprovalModal();
    // this.routerService.refresh('press-releases.press-release.shared.read');
    // this.routerService.refresh();
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

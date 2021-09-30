import Controller from '@ember/controller';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PressReleasesPressReleaseSharedReadController extends Controller {
  @service currentSession;
  @service router;

  @tracked collaboration;
  @tracked collaborators;
  @tracked tokenClaimUser;
  @tracked showApprovalModal = false;
  @tracked didUserApprove = false;

  get isClaimedByOtherUser() {
    return this.tokenClaimUser;
  }

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

  @action
  openApprovalModal() {
    this.showApprovalModal = true;
  }

  @action
  closeApprovalModal() {
    this.showApprovalModal = false;
  }

  scheduleTokenClaimRefresh() {
    this.scheduledTokenClaimRefresh = later(this, () => this.refreshTokenClaim(), 10000);
  }

  async refreshTokenClaim() {
    const tokenClaim = await this.store.queryOne('token-claim', {
      'filter[collaboration-activity][:id:]': this.collaboration.id,
      include: 'user'
    });

    if (tokenClaim) {
      this.tokenClaimUser = await tokenClaim.user;
    } else {
      this.tokenClaimUser = null;
    }

    this.scheduleTokenClaimRefresh();
  }
}

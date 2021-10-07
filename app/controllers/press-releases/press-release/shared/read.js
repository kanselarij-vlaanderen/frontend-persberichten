import Controller from '@ember/controller';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import CONFIG from '../../../../config/constants';

export default class PressReleasesPressReleaseSharedReadController extends Controller {
  @service currentSession;
  @service router;
  @service toaster;

  @tracked collaboration;
  @tracked collaborators;
  @tracked tokenClaimUser;
  @tracked approvalActivities;
  @tracked showApprovalModal = false;
  @tracked showCoEditModal = false;
  @tracked didUserApprove = false;

  get isClaimedByOtherUser() {
    return this.tokenClaimUser;
  }

  @task
  *confirmApproval() {
    // Create press release activity
    const creator = this.currentSession.organization;
    const user = this.currentSession.user;
    const { APPROVE } = CONFIG.PRESS_RELEASE_ACTIVITY;
    const activity = this.store.createRecord('press-release-activity', {
      startDate: new Date(),
      type: APPROVE,
      organization: creator,
      pressRelease: this.model,
      creator: user
    });
    yield activity.save();

    const url = `/collaboration-activities/${this.collaboration.id}/approvals`;
    const response = yield fetch(url, {
        method: 'POST',
      }
    ).catch(err => this.toaster.error('Er is iets misgegaan bij het goedkeuren van het persbericht.'));
    if (response.status === 201) {
      const url = `/collaboration-activities/${this.collaboration.id}`;
      const response = yield fetch(url, {
          method: 'PUT'
        }
      ).catch(err => this.toaster.error('Er is iets misgegaan bij het goedkeuren van het persbericht.'));
      if (response.status === 200) {
        this.closeApprovalModal();
        this.toaster.success('Persbericht werd succesvol goedgekeurd.');
        this.router.refresh();
      }
    }
  }

  @task
  *stopCoEdit() {
    // Create press release activity
    const creator = this.currentSession.organization;
    const user = this.currentSession.user;
    const { UNSHARE } = CONFIG.PRESS_RELEASE_ACTIVITY;
    const activity = this.store.createRecord('press-release-activity', {
      startDate: new Date(),
      type: UNSHARE,
      organization: creator,
      pressRelease: this.model,
      creator: user
    });
    yield activity.save();

    const url = `/collaboration-activities/${this.collaboration.id}`;
    const response = yield fetch(url, {
        method: 'DELETE',
      }
    ).catch(err => this.toaster.error('Er is iets misgegaan bij het stoppen van co-editeren.'));

    if (response.status === 200) {
      this.toaster.success('Co-editeren werd succesvol stopgezet.');
      this.router.transitionTo('press-releases.press-release.edit', this.pressRelease.id);
    }
  }

  @action
  checkApprovals() {
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

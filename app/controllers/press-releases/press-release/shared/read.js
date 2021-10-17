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

  @tracked tokenClaimUser;
  @tracked hasApproved = false;
  @tracked showApprovalModal = false;
  @tracked showCoEditModal = false;

  get pressRelease() {
    return this.model.pressRelease;
  }

  get collaboration() {
    return this.model.collaboration;
  }

  get isClaimedByOtherUser() {
    // Note: if this.tokenClaimUser is the current logged in user, he would have been redirected
    // to the press-releases.press-release.shared.edit route instead of being on this read-route
    return this.tokenClaimUser && this.tokenClaimUser != this.currentSession.user;
  }

  get isPressReleaseOwner() {
    return this.currentSession.organization
      && this.pressRelease.creator
      && this.currentSession.organization.uri == this.pressRelease.creator.get('uri');
  }

  @action
  openApprovalModal() {
    this.showApprovalModal = true;
  }

  @action
  closeApprovalModal() {
    this.showApprovalModal = false;
  }

  @task
  *confirmApproval() {
    try {
      // Create approval
      const url = `/collaboration-activities/${this.collaboration.id}/approvals`;
      const response = yield fetch(url, {
        method: 'POST',
      });
      if (response.status === 201) {
        // Note: press-release-activity must be created before distributing data across collaborators
        const creator = this.currentSession.organization;
        const user = this.currentSession.user;
        const { APPROVE } = CONFIG.PRESS_RELEASE_ACTIVITY;
        const activity = this.store.createRecord('press-release-activity', {
          startDate: new Date(),
          type: APPROVE,
          organization: creator,
          pressRelease: this.pressRelease,
          creator: user
        });
        yield activity.save();

        // Distribute approval across all collaborators
        const url = `/collaboration-activities/${this.collaboration.id}`;
        const response = yield fetch(url, {
          method: 'PUT'
        });
        if (response.status === 204) {
          this.closeApprovalModal();
          this.toaster.success('Persbericht werd succesvol goedgekeurd.');
        }
      }
    } catch(err) {
      this.toaster.error('Er is iets misgegaan bij het goedkeuren van het persbericht.');
    }
  }

  @action
  openCoEditModal() {
    this.showCoEditModal = true;
  }

  @action
  closeCoEditModal() {
    this.showCoEditModal = false;
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
      pressRelease: this.pressRelease,
      creator: user
    });
    yield activity.save();

    const url = `/collaboration-activities/${this.collaboration.id}`;
    const response = yield fetch(url, {
        method: 'DELETE',
      }
    ).catch(() => this.toaster.error('Er is iets misgegaan bij het stoppen van co-editeren.'));

    if (response.status === 204) {
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

  scheduleTokenClaimRefresh() {
    // TODO move refresh interval to config
    this.scheduledTokenClaimRefresh = later(this, () => this.refreshTokenClaim(), 10000);
  }

  async refreshTokenClaim() {
    // Using this.store.query to ensure non-stale token-claim from backend
    // instead of cached ember-data record
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

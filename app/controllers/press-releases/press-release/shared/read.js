import Controller from '@ember/controller';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { task, keepLatestTask } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import CONFIG from '../../../../config/constants';

const TOKEN_REFRESH_INTERVAL_MS = 10000; // 10 seconds

export default class PressReleasesPressReleaseSharedReadController extends Controller {
  @service currentSession;
  @service router;
  @service toaster;

  @tracked tokenClaimUser;
  @tracked hasApproved = false;
  @tracked showApprovalModal = false;
  @tracked showStopCoEditWarningModal = false;

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

  @keepLatestTask
  *loadApprovalStatus() {
    const approvalActivity = yield this.store.queryOne('approval-activity', {
      'filter[collaboration-activity][press-release][:id:]': this.pressRelease.id,
      'filter[collaborator][:id:]': this.currentSession.organization.id
    });
    this.hasApproved = approvalActivity != null;
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
          yield this.loadApprovalStatus.perform();
          this.toaster.success('Persbericht werd succesvol goedgekeurd.');
        } else {
          this.toaster.error('Er is iets misgegaan bij het verspreiden van de goedkeuring.');
        }
      } else {
        this.toaster.error('Er is iets misgegaan bij het goedkeuren van het persbericht.');
      }
    } catch(err) {
      this.toaster.error('Er is iets misgegaan bij het goedkeuren van het persbericht.');
    }
    this.closeApprovalModal();
  }

  @task
  *stopCoEdit() {
    // Refresh collaborators and approval-activities by using store.query
    // to avoid using stale/cached ember-data records
    const collaboration = yield this.store.queryOne('collaboration-activity', {
      'filter[:id:]': this.collaboration.id,
      include: [
        'collaborators',
        'approval-activities'
      ].join(',')
    });

    const collaborators = yield collaboration.collaborators;
    const approvals = yield collaboration.approvalActivities;

    // Using include in the query above to ensure we get a full list instead of a paginated one
    if ((collaborators.length - 1) == approvals.length) {
      yield this.confirmStopCoEdit.perform();
    } else {
      this.showStopCoEditWarningModal = true;
    }
  }

  @task
  *confirmStopCoEdit() {
    try {
      const url = `/collaboration-activities/${this.collaboration.id}`;
      const response = yield fetch(url, {
        method: 'DELETE',
      });

      if (response.status === 204) {
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

        // Note: no need to distribute data anymore since co-editing has already been stopped

        // Force reload of collaboration related to press-release such that
        // ember-data is aware the collaboration has been deleted in the backend
        yield this.pressRelease.belongsTo('collaboration').reload();

        this.toaster.success('Co-editeren van het persbericht is afgesloten.');
        this.router.transitionTo('press-releases.press-release.edit', this.pressRelease.id);
      } else {
        this.toaster.error('Er is iets misgegaan bij het stoppen met co-editeren.');
      }
    } catch(err) {
      this.toaster.error('Er is iets misgegaan bij het stoppen met co-editeren.');
    }
    this.showStopCoEditWarningModal = false;
  }

  @action
  cancelStopCoEdit() {
    this.showStopCoEditWarningModal = false;
  }

  scheduleTokenClaimRefresh() {
    this.scheduledTokenClaimRefresh = later(this, () => this.refreshTokenClaim(), TOKEN_REFRESH_INTERVAL_MS);
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

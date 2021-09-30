import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { cancel } from '@ember/runloop';

export default class PressReleasesPressReleaseSharedReadRoute extends Route {
  @service currentSession;

  async afterModel(model) {
    this.collaboration = await model.collaboration;
    const tokenClaim = await this.store.queryOne('token-claim', {
      'filter[collaboration-activity][:id:]': this.collaboration.id,
      include: 'user'
    });

    if (tokenClaim) {
      this.tokenClaimUser = await tokenClaim.user;
      if (this.tokenClaimUser === this.currentSession.user) {
        this.transitionTo('press-releases.press-release.shared.edit');
      }
    }

    this.collaborators = await this.collaboration.collaborators;
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.collaboration = this.collaboration;
    controller.collaborators = this.collaborators;
    controller.tokenClaimUser = this.tokenClaimUser;
    controller.didUserApprove = false;
    this.loadUserApprovalStatus(controller);
    controller.scheduleTokenClaimRefresh();
  }

  resetController(controller) {
    cancel(controller.scheduledTokenClaimRefresh);
  }

  async loadUserApprovalStatus(controller) {
    const activity = await this.store.findRecord('collaboration-activity', this.collaboration.id, {
      include: [
        'approval-activities',
      ].join(',')
    });
    const approvalActivities = await activity.approvalActivities;
    approvalActivities.forEach(async activity => {
      const collaborator = await activity.collaborator;
      const approved = collaborator.uri === this.currentSession.organization.uri;
      if (approved) {
        controller.didUserApprove = approved;
        return;
      }
    });
  }
}

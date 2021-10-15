import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { cancel } from '@ember/runloop';
import { hash } from 'rsvp';

export default class PressReleasesPressReleaseSharedReadRoute extends Route {
  @service currentSession;

  model() {
    const pressRelease = this.modelFor('press-releases.press-release');
    const collaboration = this.modelFor('press-releases.press-release.shared');

    return hash({
      pressRelease,
      collaboration
    });
  }

  async afterModel(model) {
    // Using this.store.query to ensure non-stale token-claim from backend
    // instead of cached ember-data record
    const tokenClaim = await this.store.queryOne('token-claim', {
      'filter[collaboration-activity][:id:]': model.collaboration.id,
      include: 'user'
    });

    if (tokenClaim) {
      this.tokenClaimUser = await tokenClaim.user;
      if (this.tokenClaimUser === this.currentSession.user) {
        this.transitionTo('press-releases.press-release.shared.edit');
      }
    }

    this.approvalActivity = await this.store.queryOne('approval-activity', {
      'filter[collaboration-activity][press-release][:id:]': model.pressRelease.id,
      'filter[collaborator][:id:]': this.currentSession.organization.id
    });
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.tokenClaimUser = this.tokenClaimUser;
    controller.hasApproved = this.approvalActivity != null;
    controller.scheduleTokenClaimRefresh();
  }

  resetController(controller) {
    cancel(controller.scheduledTokenClaimRefresh);
  }
}

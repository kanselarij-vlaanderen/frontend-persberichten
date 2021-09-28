import Route from '@ember/routing/route';
import { later, cancel } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default class PressReleasesPressReleaseSharedReadRoute extends Route {

  @service currentSession;

  async afterModel(model) {
    this.collaboration = await model.collaboration;
    const tokenClaim = await this.collaboration.tokenClaim;
    if (tokenClaim) {
      const user = await tokenClaim.user;
      this.editingUser = await user.group;
      if (user === this.currentSession.user) {
        this.transitionTo('press-releases.press-release.shared.edit')
      } else {
        this.isEditPossible = user === this.currentSession.user;
      }
    } else {
      this.isEditPossible = true;
    }
    this.collaborators = await this.collaboration.collaborators;
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.collaborators = this.collaborators;
    this.loadTokenClaimInfo(controller);
  }

  resetController() {
    cancel(this.loop);
  }

  async loadTokenClaimInfo(controller) {
    const activity = await this.store.findRecord('collaboration-activity', this.collaboration.id, {
      include: [
        'token-claim',
        'token-claim.user'
      ].join(',')
    });
    const tokenClaim = await activity.tokenClaim;
    if (tokenClaim) {
      const user = await tokenClaim.user;
      this.editingUser = await user.group;
      if (user === this.currentSession.user) {
        this.transitionTo('press-releases.press-release.shared.edit', true)
      } else {
        this.isEditPossible = user === this.currentSession.user;
      }
    } else {
      controller.isEditPossible = true;
    }
    this.loop = later(this, () => this.loadTokenClaimInfo(controller), 10000);
  }
}

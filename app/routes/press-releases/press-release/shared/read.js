import Route from '@ember/routing/route';
import { later, cancel } from '@ember/runloop';

export default class PressReleasesPressReleaseSharedReadRoute extends Route {
  async afterModel(model) {
    this.collaboration = await model.collaboration;
    const tokenClaim = await this.collaboration.tokenClaim;
    if (tokenClaim) {
      this.isEditPossible = false;
      const user = await tokenClaim.user;
      this.editingUser = await user.group;
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
    const tokenClaim = await this.collaboration.tokenClaim;
    if (tokenClaim) {
      controller.isEditPossible = false;
      const user = await tokenClaim.user;
      controller.editingUser = user;
      controller.editingUserGroup = await user.group;
    } else {
      controller.isEditPossible = true;
    }
    this.loop = later(this, () => this.loadTokenClaimInfo(controller), 2000);
  }
}

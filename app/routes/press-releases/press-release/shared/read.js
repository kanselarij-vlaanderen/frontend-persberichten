import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class PressReleasesPressReleaseSharedReadRoute extends Route {
  async afterModel(model) {
    this.collaboration = await model.collaboration;
    this.collaborators = await this.collaboration.collaborators;
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.collaboration = this.collaboration;
    controller.collaborators = this.collaborators;
  }

  @action
  reloadModel() {
    this.refresh();
  }
}

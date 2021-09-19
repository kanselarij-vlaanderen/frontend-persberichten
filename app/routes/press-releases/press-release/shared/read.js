import Route from '@ember/routing/route';

export default class PressReleasesPressReleaseSharedReadRoute extends Route {
  async afterModel(model) {
    const collaboration = await model.collaboration;
    this.collaborators = await collaboration.collaborators;
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.collaborators = this.collaborators;
  }

}

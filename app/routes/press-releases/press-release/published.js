import Route from '@ember/routing/route';

export default class PressReleasesPressReleasePublishedRoute extends Route {
  setupController(controller, model) {
    console.log(model)
    super.setupController(controller, model);
  }
}

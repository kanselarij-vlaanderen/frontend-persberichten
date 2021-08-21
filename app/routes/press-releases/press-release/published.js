import Route from '@ember/routing/route';

export default class PressReleasesPressReleasePublishedRoute extends Route {
  setupController(controller, model) {
    const pressRelease = model.pressRelease;
    super.setupController(controller, pressRelease);
  }
}

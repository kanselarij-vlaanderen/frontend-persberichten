import Route from '@ember/routing/route';

export default class PressReleasesPressReleaseEditRoute extends Route {
  beforeModel(transition) {
    if (transition.from) {
      if (transition.from.name === 'press-releases.overview.published') {
        this.transitionTo('press-releases.press-release.published')
      }
      this.fromRoute = transition.from.name;
    } else {
      this.fromRoute = 'press-releases.overview.concept';
    }
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.fromRoute = this.fromRoute;
  }
}

import Route from '@ember/routing/route';
import PressReleaseSnapshot from '../../utils/press-release-snapshot';

export default class PressReleasesPressReleaseRoute extends Route {
  async model(params) {
    const pressRelease = await this.store.findRecord('press-release', params.press_release_id, {
      include: [
        'publication-channels',
        'publication-event'
      ].join(',')
    });
    const snapshot = new PressReleaseSnapshot(pressRelease);
    await snapshot.commit();
    return snapshot;
  }


  beforeModel(transition) {
    if(transition.from) {
      this.fromRoute = transition.from.name;
    } else {
      this.fromRoute = 'press-releases.overview.concept'
    }
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    this.controllerFor('press-releases.press-release');
    controller.fromRoute = this.fromRoute;
  }
}

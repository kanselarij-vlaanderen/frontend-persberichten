import Route from '@ember/routing/route';
import PressReleaseSnapshot from '../../utils/press-release-snapshot';

export default class PressReleasesPressReleaseRoute extends Route {
  from;
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
      this.from = transition.from.name;
    } else {
      this.from = 'press-releases.overview.concept'
    }
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    this.controllerFor('press-releases.press-release').set('from', this.from);
  }
}

import Route from '@ember/routing/route';

export default class PressReleasesPressReleaseRoute extends Route {
  model(params) {
    return this.store.findRecord('press-release', params.press_release_id, {
      include: 'publication-event'
    });
  }
}

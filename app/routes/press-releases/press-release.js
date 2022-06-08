import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PressReleasesPressReleaseRoute extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('press-release', params.press_release_id, {
      include: [
        'publication-channels',
        'publication-event'
      ].join(',')
    });
  }
}

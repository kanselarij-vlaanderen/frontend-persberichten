import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PressReleasesIndexRoute extends Route {
  @service router;

  beforeModel() {
    this.router.transitionTo('press-releases.overview.index');
  }
}

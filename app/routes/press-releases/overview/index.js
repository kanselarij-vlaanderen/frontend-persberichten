import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PressReleasesOverviewIndexRoute extends Route {
  @service router;

  beforeModel() {
    this.router.transitionTo('press-releases.overview.concept');
  }
}

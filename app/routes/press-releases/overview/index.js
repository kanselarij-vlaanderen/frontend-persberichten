import Route from '@ember/routing/route';

export default class PressReleasesOverviewIndexRoute extends Route {
  beforeModel() {
    this.transitionTo('press-releases.overview.concept');
  }
}

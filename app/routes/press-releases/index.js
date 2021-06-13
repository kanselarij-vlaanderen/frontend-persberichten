import Route from '@ember/routing/route';

export default class PressReleasesIndexRoute extends Route {
  beforeModel() {
    this.transitionTo('press-releases.overview.index');
  }
}

import Route from '@ember/routing/route';

export default class SourcesOverviewIndexRoute extends Route {
  beforeModel() {
    this.transitionTo('sources.overview.active');
  }
}

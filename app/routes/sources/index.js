import Route from '@ember/routing/route';

export default class SourcesIndexRoute extends Route {
  beforeModel() {
    this.transitionTo('sources.overview.index');
  }
}

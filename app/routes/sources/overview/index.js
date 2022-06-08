import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SourcesOverviewIndexRoute extends Route {
  @service router;

  beforeModel() {
    this.router.transitionTo('sources.overview.active');
  }
}

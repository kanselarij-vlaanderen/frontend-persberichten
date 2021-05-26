import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SourcesSourceRoute extends Route {
  @service store;
  model(params) {
    return params;
  }

  setupController(controller, model) {
    super.setupController(controller, model);
  }
}

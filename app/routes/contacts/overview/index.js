import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ContactsOverviewIndexRoute extends Route {
  @service router;

  beforeModel() {
    this.router.transitionTo('contacts.overview.mailing-lists');
  }
}

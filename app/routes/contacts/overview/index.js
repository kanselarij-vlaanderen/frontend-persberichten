import Route from '@ember/routing/route';

export default class ContactsOverviewIndexRoute extends Route {
  beforeModel() {
    this.transitionTo('contacts.overview.mailing-lists');
  }
}

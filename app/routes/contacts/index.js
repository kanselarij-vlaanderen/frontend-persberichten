import Route from '@ember/routing/route';

export default class ContactsIndexRoute extends Route {
  beforeModel() {
    this.transitionTo('contacts.overview.index');
  }
}

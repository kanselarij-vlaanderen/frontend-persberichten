import Route from '@ember/routing/route';

export default class ContactsNewRoute extends Route {
  model() {
    return this.store.createRecord('contact-list', {});
  }
}

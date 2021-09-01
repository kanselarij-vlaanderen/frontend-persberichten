import Route from '@ember/routing/route';
import { A } from '@ember/array';

export default class ContactsNewRoute extends Route {
  model() {
    return this.store.createRecord('contact-list', {});
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.step = 0;
    controller.inputType = null;
    controller.selectedContact = null;
    controller.contacts = A([]);
  }
}

import Route from '@ember/routing/route';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';

export default class ContactsNewRoute extends Route {
  @service store;

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

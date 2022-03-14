import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ContactsOverviewController extends Controller {
  @service currentSession;
  @service store;
  @service router;

  @tracked showContactItemModal = false;
  @tracked selectedContact;

  @action
  openContactItemModal() {
    const creator = this.currentSession.organization;
    const telephone = this.store.createRecord('telephone', { creator });
    const mailAddress = this.store.createRecord('mail-address', { creator });
    this.selectedContact = this.store.createRecord('contact-item', { telephone, mailAddress });
    this.showContactItemModal = true;
  }

  @task
  *saveContactItem() {
    yield Promise.all([
      (yield this.selectedContact.telephone).save(),
      (yield this.selectedContact.mailAddress).save()
    ]);
    const now = new Date();
    this.selectedContact.created = now;
    this.selectedContact.modified = now;
    yield this.selectedContact.save();
    this.showContactItemModal = false;
    // force reload of the contacts.overview.persons model-hook to update the list
    this.router.transitionTo('contacts.overview.persons');
  }

  @action
  closeContactItemModal() {
    this.selectedContact = null;
    this.showContactItemModal = false;
  }
}

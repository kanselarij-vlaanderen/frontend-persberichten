import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
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
    const telephone = this.store.createRecord('telephone', {creator});
    const mailAddress = this.store.createRecord('mail-address', {creator});
    this.selectedContact = this.store.createRecord('contact-item', {telephone, mailAddress});
    this.showContactItemModal = true;
  }

  @task
  *saveContactItem() {
    const newDate = new Date();
    yield Promise.all([
      (yield this.selectedContact.telephone).save(),
      (yield this.selectedContact.mailAddress).save()
    ]);

    this.selectedContact.created = newDate;
    this.selectedContact.modified = newDate;
    yield this.selectedContact.save();
    this.showContactItemModal = false;
    this.router.transitionTo('contacts.overview.persons');

  }

  @action
  closeContactItemModal() {
    this.selectedContact = null;
    this.showContactItemModal = false;
  }
}

import Controller from '@ember/controller';
import { task } from 'ember-concurrency-decorators';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';

export default class ContactsNewController extends Controller {
  TITLES_ARRAY = ['Basis informatie', 'Ontvangers', 'Contactgegevens'];

  @tracked step = 0;
  @tracked isManualInput = '';
  @tracked showContactItemModal = false;
  @tracked showConfirmationModal = false;
  @tracked selectedContact;

  @tracked contacts = A([]);

  get hasPrevious() {
    return this.step > 0;
  }

  get hasNext() {
    return this.step < this.TITLES_ARRAY.length - 1;
  }

  get isLast() {
    return this.step === this.TITLES_ARRAY.length - 1;
  }

  get title() {
    return this.TITLES_ARRAY[this.step];
  }

  get progress() {
    return this.step * 100 / this.TITLES_ARRAY.length;
  }

  get isDisabledNextStep() {
    if (this.step === 0) {
      return !this.model.name;
    } else if (this.step === 1) {
      return !this.isManualInput;
    }
  }

  @action
  setInputType(event) {
    this.isManualInput = event.target.value;
  }

  @action
  openContactItemModal() {
    this.selectedContact = null;
    this.showContactItemModal = true;
  }

  @action
  closeContactItemModal() {
    this.showContactItemModal = false;
  }

  @action
  navigateBack() {
    this.showConfirmationModal = true;
  }

  @action
  cancelNavigationBack() {
    this.showConfirmationModal = false;
  }

  @task
  *confirmNavigationBack() {
    yield this.model.destroyRecord();
    this.showConfirmationModal = false;
    this.transitionToRoute('contacts.overview');
  }

  @action
  setInputValue(record, attribute, event) {
    record[attribute] = event.target.value;
  }

  @action
  addContact(contact) {
    this.contacts.pushObject(contact);
    this.showContactItemModal = false;
  }

  @action
  openContactItem(index) {
    this.selectedContact = this.contacts[index];
    this.showContactItemModal = true;
  }

  @action
  deleteContact() {
    this.contacts.removeObject(this.selectedContact);
    this.showContactItemModal = false;
  }

  @action
  changeContact(contact) {
    this.contacts.removeObject(this.selectedContact);
    this.contacts.addObject(contact);
    this.showContactItemModal = false;
  }

  @task
  *saveContactList() {
    yield this.model.save();

    yield Promise.all(this.contacts.map(async contact => {
      contact.contactList = this.model;
      await Promise.all([
        (await contact.telephone).save(),
        (await contact.mailAddress).save()
      ]);
      return await contact.save();
    }));
    this.transitionToRoute('contacts.overview');
  }

  @action
  nextStep() {
    this.step += 1;
  }

  @action
  previousStep() {
    this.step -= 1;
  }
}

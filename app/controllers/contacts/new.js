import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { isBlank } from '@ember/utils';
import { guidFor } from '@ember/object/internals';

export default class ContactsNewController extends Controller {
  TITLES_ARRAY = ['Basis informatie', 'Ontvangers', 'Contactgegevens'];

  @service currentSession;
  @service store;
  @service router;

  @tracked step;
  @tracked inputType;
  @tracked showContactItemModal = false;
  @tracked showConfirmationModal = false;
  @tracked isNewContact = true;
  @tracked isUploadComplete = false;
  @tracked selectedContact;

  tempContact = {};

  @tracked contacts;

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
      return isBlank(this.model.name);
    } else if (this.step === 1) {
      return isBlank(this.inputType);
    } else {
      return false;
    }
  }

  get fileQueueName() {
    return `${guidFor(this)}-file-queue`;
  }

  @action
  setInputType(event) {
    this.inputType = event.target.value;
  }

  @action
  openContactItemModal() {
    const creator = this.currentSession.organization;
    const telephone = this.store.createRecord('telephone', {creator});
    const mailAddress = this.store.createRecord('mail-address', {creator});
    this.selectedContact = this.store.createRecord('contact-item', {telephone, mailAddress});
    this.isNewContact = true;
    this.showContactItemModal = true;
  }

  @action
  closeContactItemModalAndReset() {
    this.rollbackContact();
  }

  @action
  closeContactItemModal() {
    this.isNewContact = false;
    this.selectedContact = null;
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
    this.router.transitionTo('contacts.overview');
  }

  @action
  setInputValue(record, attribute, event) {
    record[attribute] = event.target.value;
  }

  @action
  addContact() {
    this.contacts.pushObject(this.selectedContact);
    this.closeContactItemModal();
  }

  @action
  openContactItem(contact) {
    this.snapshotContact(contact);
    this.selectedContact = contact;
    this.isNewContact = false;
    this.showContactItemModal = true;
  }

  @action
  deleteContact() {
    this.contacts.removeObject(this.selectedContact);
    this.closeContactItemModal();
  }

  @action
  changeContact() {
    this.closeContactItemModal();
  }

  /**
     Generating a snapshot of the contact record in order to be able
     to rollback the changes in case the user discards edits on a new contact-item.
     Regular rollbackAttributes() doesn't work on new ember-data records:
     it will rollback all attributes to the blank state instead of to the previous value.
  */
  async snapshotContact(contact) {
    const telephone = (await contact.telephone).value;
    const mailAddress = (await contact.mailAddress).value;
    this.tempContact = {
      givenName: contact.givenName,
      familyName: contact.familyName,
      organizationName: contact.organizationName,
      telephone,
      mailAddress
    };
  }

  async rollbackContact() {
    const telephone = await this.selectedContact.telephone;
    const mailAddress = await this.selectedContact.mailAddress;

    this.selectedContact.givenName = this.tempContact.givenName;
    this.selectedContact.familyName = this.tempContact.familyName;
    this.selectedContact.fullName = `${this.tempContact.givenName} ${this.tempContact.familyName}`;
    this.selectedContact.organizationName = this.tempContact.organizationName;
    telephone.value = this.tempContact.telephone;
    mailAddress.value = this.tempContact.mailAddress;
    this.closeContactItemModal();
  }

  @task
  *saveContactList() {
    const newDate = new Date();
    this.model.created = newDate;
    this.model.modified = newDate;
    yield this.model.save();

    yield Promise.all(this.contacts.map(async contact => {
      contact.contactList = this.model;
      await Promise.all([
        (await contact.telephone).save(),
        (await contact.mailAddress).save()
      ]);

      contact.created = newDate;
      contact.modified = newDate;
      return await contact.save();
    }));

    this.router.transitionTo('contacts.overview');
  }

  @task
  *convertFile(file) {
    this.isUploadComplete = true;
    const url = `/csv/${file.id}/parse`;
    const response = yield fetch(url);
    if (response.status !== 200) {
      yield file.destroyRecord();
      return;
    }
    const payload = yield response.json();
    payload.forEach(contact => {
      const creator = this.currentSession.organization;
      const telephone = this.store.createRecord('telephone', {
        creator,
        value: contact["Telefoon"]
      });
      const mailAddress = this.store.createRecord('mail-address', {
        creator,
        value: contact["Email"]
      });
      const contactItem = this.store.createRecord('contact-item', {
        telephone,
        mailAddress,
        givenName: contact["Voornaam"],
        familyName: contact["Achternaam"],
        fullName: `${contact["Voornaam"]} ${contact["Achternaam"]}`,
        organizationName: contact["Organisatie Naam"]
      });
      this.contacts.pushObject(contactItem);
    });
    yield file.destroyRecord();
  }

  @action
  uploadNewFile() {
    this.isUploadComplete = false;
    this.contacts.clear();
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

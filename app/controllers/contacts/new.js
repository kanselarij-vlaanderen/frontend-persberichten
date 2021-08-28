import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';

export default class ContactsNewController extends Controller {
  @service currentSession;

  @tracked step = 0;
  @tracked isManualInput = true;
  @tracked showContactItemModal = false;
  @tracked selectedContact;

  @tracked contacts = A([]);

  get title() {
    return ['Basis informatie', 'Ontvangers', 'Contactgegevens'][this.step];
  }

  get progress() {
    return (this.step + 1) * 25;
  }

  @action
  setInputType() {
    this.isManualInput = !this.isManualInput;
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
  async navigateBack() {
    await this.model.destroyRecord();
    this.selectedContact = null;
    this.contacts = A([]);
    this.step = 0;
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

  @action
  async saveContactList() {
    const creator = this.currentSession.organization;

    this.contacts.map(async contact => {
      const contactItem = this.store.createRecord('contact-item', {
        givenName: contact.givenName,
        familyName: contact.familyName,
        organizationName: contact.organizationName,
        contactList: this.model
      });


      if (contact.telephone) {
        const telephone = this.store.createRecord('telephone', {creator, value: contact.telephone});
        await telephone.save();
        contactItem.telephone = telephone;
      }

      if (contact.mailAddress) {
        const mailAddress = this.store.createRecord('mail-address', {creator, value: contact.mailAddress});
        await mailAddress.save();
        contactItem.mailAddress = mailAddress;
      }

      await contactItem.save();
      this.model.contactItems.addObject(contactItem);
    });
    await this.model.save();

    this.selectedContact = null;
    this.contacts = A([]);
    this.step = 0;
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

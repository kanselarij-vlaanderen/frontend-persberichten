import Controller from '@ember/controller';
import { task } from 'ember-concurrency-decorators';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ContactsMailingListController extends Controller {
  @service router;
  @service currentSession;

  @tracked isEditEnabled = false;
  @tracked showConfirmationModal = false;
  @tracked showContactItemModal = false;
  @tracked selectedContact;
  @tracked contactList;

  @tracked sort = '-full-name';
  @tracked page = 0;
  @tracked size = 25;

  tempContact = {};

  @action
  prevPage() {
    if (this.page > 0) {
       this.page -= 1;
    }
  }

  @action
  nextPage() {
    this.page += 1;
  }

  @action
  setPageSize(size) {
    this.size = size;
    this.page = 0;
  }

  @action
  setSort(sort) {
    this.sort = sort;
  }

  @action
  setInputValue(attribute, event) {
    this.contactList[attribute] = event.target.value;
  }

  @action
  openContactItemModal() {
    const creator = this.currentSession.organization;
    const telephone = this.store.createRecord('telephone', {creator});
    const mailAddress = this.store.createRecord('mail-address', {creator});
    this.selectedContact = this.store.createRecord('contact-item', {
      telephone,
      mailAddress,
      contactList: this.contactList
    });
    this.showContactItemModal = true;
  }

  @action
  closeContactItemModal() {
    this.showContactItemModal = false;
  }

  @action
  async closeContactItemModalAndReset() {
    if (!this.selectedContact.isNew) {
      if (this.selectedContact.hasDirtyAttributes) {
        this.selectedContact.rollbackAttributes();
      }
      const telephone = await this.selectedContact.telephone;
      const mailAddress = await this.selectedContact.mailAddress;
      if (telephone.hasDirtyAttributes) {
        telephone.rollbackAttributes();
      }
      if (mailAddress.hasDirtyAttributes) {
        mailAddress.rollbackAttributes();
      }
    }
    this.closeContactItemModal();
  }

  @action
  confirmNavigationBack() {
    this.contactList.rollbackAttributes();
    this.router.transitionTo('contacts.overview');
    this.showConfirmationModal = false;
  }

  @action
  openContactItem(contact) {
    this.selectedContact = contact;
    this.showContactItemModal = true;
  }

  @action
  async addContact() {
    await Promise.all([
      (await this.selectedContact.telephone).save(),
      (await this.selectedContact.mailAddress).save()
    ]);
    this.selectedContact.modified = new Date();
    this.selectedContact.created = new Date();
    await this.selectedContact.save();
    await this.updateContactListModificationDate();
    this.send('reloadModel');
    this.closeContactItemModal();
  }

  @action
  async changeContact() {
    const telephone = await this.selectedContact.telephone;
    const mailAddress = await this.selectedContact.mailAddress;
    await Promise.all([
      telephone.hasDirtyAttributes ? await telephone.save() : null,
      mailAddress.hasDirtyAttributes ? await mailAddress.save() : null
    ]);
    this.selectedContact.modified = new Date();
    await this.selectedContact.save();
    await this.updateContactListModificationDate();
    this.closeContactItemModal();
  }

  @action
  async deleteContact() {
    await this.selectedContact.destroyRecord();
    await this.updateContactListModificationDate();
    this.send('reloadModel');
    this.closeContactItemModal();
  }

  @action
  enableEdit() {
    this.isEditEnabled = true;
  }

  @task
  *saveAndDisableEdit() {
    const contactList = yield this.contactList;
    if (contactList.hasDirtyAttributes) {
      yield this.updateContactListModificationDate();
    }
    this.isEditEnabled = false;
  }

  @action
  navigateBack() {
    if (this.contactList.hasDirtyAttributes) {
      this.showConfirmationModal = true;
    } else {
      this.router.transitionTo('contacts.overview');
    }
  }

  @action
  cancelNavigationBack() {
    this.showConfirmationModal = false;
  }

  async updateContactListModificationDate() {
    this.contactList.modified = new Date();
    await this.contactList.save();
  }
}

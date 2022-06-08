import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ContactsMailingListController extends Controller {
  @service router;
  @service currentSession;
  @service store;

  @tracked sort = '-full-name';
  @tracked page = 0;
  @tracked size = 25;

  @tracked contactList; // set by setupController

  @tracked isEditEnabled = false;
  @tracked showConfirmationModal = false;
  @tracked showContactItemModal = false;
  @tracked showDeleteContactListModal = false;
  @tracked selectedContact;

  @action
  setInputValue(attribute, event) {
    this.contactList[attribute] = event.target.value;
  }

  @action
  createNewContact() {
    const creator = this.currentSession.organization;
    const telephone = this.store.createRecord('telephone', { creator });
    const mailAddress = this.store.createRecord('mail-address', { creator });
    const newContact = this.store.createRecord('contact-item', {
      telephone,
      mailAddress,
      contactList: this.contactList
    });
    this.openContactItem(newContact);
  }

  @action
  openContactItem(contact) {
    this.selectedContact = contact;
    this.showContactItemModal = true;
  }

  @action
  async cancelContactModal() {
    const rollbackTelephone = async () => {
      const telephone = await this.selectedContact.telephone;
      telephone.rollbackAttributes();
    };
    const rollbackMailAddress = async () => {
      const mailAddress = await this.selectedContact.mailAddress;
      mailAddress.rollbackAttributes();
    };
    await Promise.all([
      rollbackTelephone(),
      rollbackMailAddress()
    ]);
    this.selectedContact.rollbackAttributes();
    this.closeContactItemModal();
  }

  @action
  async addContact() {
    await Promise.all([
      (await this.selectedContact.telephone).save(),
      (await this.selectedContact.mailAddress).save()
    ]);
    const now = new Date();
    this.selectedContact.created = now;
    this.selectedContact.modified = now;
    await this.selectedContact.save();
    await this.updateContactListModificationDate();
    this.send('reloadModel');
    this.closeContactItemModal();
  }

  @action
  async updateContact() {
    const updateTelephone = async () => {
      const telephone = await this.selectedContact.telephone;
      if (telephone.hasDirtyAttributes)
        await telephone.save();
    };
    const updateMailAddress = async () => {
      const mailAddress = await this.selectedContact.mailAddress;
      if (mailAddress.hasDirtyAttributes)
        await mailAddress.save();
    };
    await Promise.all([
      updateTelephone(),
      updateMailAddress()
    ]);
    this.selectedContact.modified = new Date();
    await this.selectedContact.save();
    await this.updateContactListModificationDate();
    this.closeContactItemModal();
  }

  @action
  async deleteContact() {
    const destroyTelephone = async () => {
      const telephone = await this.selectedContact.telephone;
      telephone.destroyRecord();
    };
    const destroyMailAddress = async () => {
      const mailAddress = await this.selectedContact.mailAddress;
      mailAddress.destroyRecord();
    };
    await Promise.all([
      destroyTelephone(),
      destroyMailAddress()
    ]);
    await this.selectedContact.destroyRecord();
    await this.updateContactListModificationDate();
    this.send('reloadModel');
    this.closeContactItemModal();
  }

  closeContactItemModal() {
    this.showContactItemModal = false;
  }

  @action
  enableEdit() {
    this.isEditEnabled = true;
  }

  @task
  *updateContactList() {
    if (this.contactList.hasDirtyAttributes) {
      yield this.updateContactListModificationDate();
    }
    this.isEditEnabled = false;
  }

  @action
  openDeleteContactListModal() {
    this.showDeleteContactListModal = true;
  }

  @task
  *confirmDeletion() {
    const deleteContact = async (contact) => {
      await Promise.all([
        (await contact.telephone).destroyRecord(),
        (await contact.mailAddress).destroyRecord()
      ]);
      await contact.destroyRecord();
    };
    yield Promise.all(this.model.map(contact => deleteContact(contact)));
    yield this.contactList.destroyRecord();
    this.closeDeleteContactListModal();
    this.router.transitionTo('contacts.overview');
  }

  @action
  closeDeleteContactListModal() {
    this.showDeleteContactListModal = false;
  }

  @action
  navigateBack() {
    if (this.contactList.hasDirtyAttributes) {
      this.showConfirmationModal = true;
    } else {
      if (this.isEditEnabled) {
        this.isEditEnabled = false;
      } else {
        this.router.transitionTo('contacts.overview');
      }
    }
  }

  @action
  cancelNavigationBack() {
    this.showConfirmationModal = false;
  }

  @action
  confirmNavigationBack() {
    this.contactList.rollbackAttributes();
    this.showConfirmationModal = false;
    if (this.isEditEnabled) {
      this.isEditEnabled = false;
    } else {
      this.router.transitionTo('contacts.overview');
    }
  }

  async updateContactListModificationDate() {
    this.contactList.modified = new Date();
    await this.contactList.save();
  }

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
}

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ContactsOverviewPersonsController extends Controller {
  @tracked selectedContact;
  @tracked showContactItemModal = false;

  @tracked sort = '-full-name';
  @tracked page = 0;
  @tracked size = 25;

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
  openContactItem(contact) {
    this.selectedContact = contact;
    this.showContactItemModal = true;
  }

  @action
  async deleteContact() {
    await this.selectedContact.destroyRecord();
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
    this.closeContactItemModal();
  }

  @action
  async closeContactItemModalAndReset() {
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
    this.closeContactItemModal();
  }

  @action
  closeContactItemModal() {
    this.showContactItemModal = false;
  }
}

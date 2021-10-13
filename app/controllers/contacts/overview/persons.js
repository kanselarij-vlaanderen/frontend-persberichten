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
  openContactItem(contact) {
    this.selectedContact = contact;
    this.showContactItemModal = true;
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
    this.closeContactItemModal();
  }

  @action
  async cancelContactModal() {
    this.selectedContact.rollbackAttributes();
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
    this.closeContactItemModal();
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

  closeContactItemModal() {
    this.selectedContact = null;
    this.showContactItemModal = false;
  }
}

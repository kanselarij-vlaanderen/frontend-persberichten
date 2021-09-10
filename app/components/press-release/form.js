import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import CONFIG from '../../config/constants';

export default class PressReleaseFormComponent extends Component {
  @service store;

  @tracked showSourceModal = false;
  @tracked showUploadModal = false;
  @tracked showContactListModal = false;
  @tracked showContactItemModal = false;
  @tracked mailingListPublicationChannel;

  constructor() {
    super(...arguments);
    this.loadMailingListPublicationChannel.perform();
  }

  @task
  *loadMailingListPublicationChannel() {
    this.mailingListPublicationChannel = yield this.store.findRecordByUri(
      'publication-channel',
      CONFIG.PUBLICATION_CHANNEL.MAILING_LIST
    );
  }

  @action
  setInputValue(record, attribute, event) {
    record[attribute] = event.target.value;
  }

  @action
  addKeyword(newKeyword) {
    let keyWordArray = this.args.pressRelease.keywords;
    if (keyWordArray) {
      keyWordArray.push(newKeyword);
      this.args.pressRelease.keywords = [...new Set(keyWordArray)];
    } else {
      keyWordArray = new Set([newKeyword]);
      this.args.pressRelease.keywords = [...keyWordArray];
    }
  }

  @action
  deleteKeyword(keyword) {
    const keyWordArray = this.args.pressRelease.keywords;
    const index = keyWordArray.indexOf(keyword);
    keyWordArray.splice(index, 1);
    this.args.pressRelease.keywords = [...keyWordArray];
  }

  @action
  setGovernmentFields(selectedOptions) {
    this.args.pressRelease.governmentFields = selectedOptions;
  }

  @action
  setPublicationChannels(selectedChannels) {
    this.args.pressRelease.publicationChannels = selectedChannels;
  }

  @action
  async addSources(newSources) {
    const sources = await this.args.pressRelease.sources;
    sources.pushObjects(newSources);
    this.showSourceModal = false;
  }

  @action
  async removeSource(source) {
    const sources = await this.args.pressRelease.sources;
    sources.removeObject(source);
  }

  @action
  async addContactItems(newContactItems) {
    const contactLists = await this.args.pressRelease.contactItems;
    const publicationChannels = await this.args.pressRelease.publicationChannels;
    contactLists.pushObjects(newContactItems);
    publicationChannels.pushObject(this.mailingListPublicationChannel);
    this.showContactItemModal = false;
  }

  @action
  async removeContactItem(contactItem) {
    const contactItems = await this.args.pressRelease.contactItems;
    const contactLists = await this.args.pressRelease.contactLists;
    contactItems.removeObject(contactItem);
    if (contactLists.length === 0 && contactItems.length === 0) {
      const publicationChannels = await this.args.pressRelease.publicationChannels;
      publicationChannels.removeObject(this.mailingListPublicationChannel);
    }
  }


  @action
  async addContactLists(newContactLists) {
    const contactLists = await this.args.pressRelease.contactLists;
    const publicationChannels = await this.args.pressRelease.publicationChannels;
    contactLists.pushObjects(newContactLists);
    publicationChannels.pushObject(this.mailingListPublicationChannel);
    this.showContactListModal = false;
  }

  @action
  async removeContactList(contactList) {
    const contactLists = await this.args.pressRelease.contactLists;
    const contactItems = await this.args.pressRelease.contactItems;
    contactLists.removeObject(contactList);
    if (contactLists.length === 0 && contactItems.length === 0) {
      const publicationChannels = await this.args.pressRelease.publicationChannels;
      publicationChannels.removeObject(this.mailingListPublicationChannel);
    }
  }

  @action
  async addAttachment(attachment) {
    const attachments = await this.args.pressRelease.attachments;
    attachments.pushObject(attachment);
    this.showUploadModal = false;
  }

  @action
  async removeAttachment(attachment) {
    const attachments = await this.args.pressRelease.attachments;
    attachments.removeObject(attachment);
    attachment.deleteRecord();
    // we don't destroy the record to make sure a rollback is possible
  }

  @action
  setThemes(themes) {
    this.args.pressRelease.themes = themes;
  }

  @action
  openSourceModal() {
    this.showSourceModal = true;
  }

  @action
  openContactListModal() {
    this.showContactListModal = true;
  }

  @action
  closeContactListModal() {
    this.showContactListModal = false;
  }

  @action
  openContactItemModal() {
    this.showContactItemModal = true;
  }

  @action
  closeContactItemModal() {
    this.showContactItemModal = false;
  }

  @action
  closeSourceModal() {
    this.showSourceModal = false;
  }

  @action
  openUploadModel() {
    this.showUploadModal = true;
  }

  @action
  closeUploadModal() {
    this.showUploadModal = false;
  }
}

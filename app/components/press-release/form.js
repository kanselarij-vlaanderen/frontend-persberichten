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
  @tracked mailingList;

  constructor() {
    super(...arguments);
    this.loadMailingListPublicationChannel.perform();
  }

  @task
  *loadMailingListPublicationChannel() {
    let publicationChannels = yield this.store.query('publication-channel', {
      'page[size]': 100,
      sort: 'name'
    });
    this.mailingList = publicationChannels.find(channel => channel.uri === CONFIG.PUBLICATION_CHANNEL.MAILING_LIST);
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
  async addContactLists(newContactLists) {
    const contactLists = await this.args.pressRelease.contactLists;
    const publicationChannels = await this.args.pressRelease.publicationChannels;
    contactLists.pushObjects(newContactLists);
    publicationChannels.pushObject(this.mailingList);
    this.showContactListModal = false;
  }

  @action
  async removeContactList(contactList) {
    const contactLists = await this.args.pressRelease.contactLists;
    contactLists.removeObject(contactList);
    if (contactLists.length === 0) {
      const publicationChannels = await this.args.pressRelease.publicationChannels;
      publicationChannels.removeObject(this.mailingList);
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
    //we don't destroy the record to make sure a rollback is possible
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

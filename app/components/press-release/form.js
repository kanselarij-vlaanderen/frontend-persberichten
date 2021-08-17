import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';

export default class PressReleaseFormComponent extends Component {
  @tracked showSourceModal = false;
  @tracked showUploadModal = false;

  get fileQueueName() {
    return `${guidFor(this)}-file-queue`;
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
  async uploadFile(file) {
    const attachments = await this.args.pressRelease.attachments;
    attachments.addObject(file);
    this.showUploadModal = false;
  }

  @action
  async removeSource(source) {
    const sources = await this.args.pressRelease.sources;
    sources.removeObject(source);
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

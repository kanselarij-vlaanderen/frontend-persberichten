import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import { guidFor } from '@ember/object/internals';

export default class PressReleaseFormComponent extends Component {

  @tracked selectedPublicationChannels = [];
  @tracked showSourceModal = false;
  @tracked showUploadModal = false;

  constructor() {
    super(...arguments);
    this.loadSelectedPublicationChannels.perform();
  }

  get fileQueueName() {
    return `${guidFor(this)}-file-queue`;
  }

  @task
  *loadSelectedPublicationChannels() {
    this.selectedPublicationChannels = yield this.args.pressRelease.publicationChannels;
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
  setSources(sources) {
    this.args.pressRelease.sources = sources;
    this.showSourceModal = false;
  }

  @action
  uploadFile(file) {
    const attachments = this.args.pressRelease.attachments;
    attachments.addObject(file);
    this.args.pressRelease.attachments = attachments;
    this.showUploadModal = false;
  }

  @action
  removeSource(source) {
    const sources = this.args.pressRelease.sources.slice(0);
    sources.removeObject(source);
    this.args.pressRelease.sources = sources;
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

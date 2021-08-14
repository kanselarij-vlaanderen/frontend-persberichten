import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';

export default class PressReleaseFormComponent extends Component {

  @tracked selectedPublicationChannels = [];
  @tracked showContactModal = false;

  constructor() {
    super(...arguments);
    this.loadSelectedPublicationChannels.perform();
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
  setThemes(themes) {
    this.args.pressRelease.themes = themes;
  }

  @action
  openContactModal() {
    this.showContactModal = true;
  }

  @action
  closeContactModal() {
    this.showContactModal = false;
  }
}

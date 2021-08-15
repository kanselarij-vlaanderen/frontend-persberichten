import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';

export default class PressReleaseFormComponent extends Component {

  @tracked selectedPublicationChannels = [];
  @tracked showSourceModal = false;

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
  setSources(sources) {
    this.args.pressRelease.sources = sources;
    this.showSourceModal = false;
  }

  @action
  removeSource(sources) {
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
}

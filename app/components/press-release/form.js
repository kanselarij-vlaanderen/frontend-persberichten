import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class PressReleaseFormComponent extends Component {
  @action
  setInputValue(record, attribute, event) {
    record[attribute] = event.target.value;
  }

  @action
  addKeyword(newKeyword) {
    let keyWordArray = this.args.pressRelease.keywords;
    if (keyWordArray) {
      keyWordArray.push(newKeyword)
      this.args.pressRelease.keywords = [...new Set(keyWordArray)];
    } else {
      keyWordArray = new Set(newKeyword);
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
}

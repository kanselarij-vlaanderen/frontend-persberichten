import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class PressReleaseFormComponent extends Component {
  @action
  setInputValue(record, attribute, event) {
    record[attribute] = event.target.value;
  }

  @action
  addKeyword(model, newKeyword) {
    let keyWordArray = model.keyword;
    if (keyWordArray) {
      keyWordArray.push(newKeyword)
      model.keyword = [...new Set(keyWordArray)];
    } else {
      keyWordArray = new Set();
      keyWordArray.add(newKeyword)
      let newKeywordArray = [...keyWordArray]
      model.keyword = newKeywordArray;
    }
  }

  @action
  deleteKeyword(model, keyword) {
    const keyWordArray = model.keyword;
    const index = keyWordArray.indexOf(keyword);
    keyWordArray.splice(index, 1);
    model.keyword = [...keyWordArray];
  }
}

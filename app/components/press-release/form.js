import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class PressReleaseFormComponent extends Component {
  @action
  setInputValue(record, attribute, event) {
    record[attribute] = event.target.value;
  }
}

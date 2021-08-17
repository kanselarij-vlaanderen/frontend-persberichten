import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class PressReleaseFilesTableComponent extends Component {
  @action
  removeAttachment(attachment) {
    this.args.onRemoveAttachment(attachment);
  }
}

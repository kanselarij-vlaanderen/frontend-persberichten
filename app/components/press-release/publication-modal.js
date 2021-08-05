import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class PressReleasePublicationModalComponent extends Component {
  @action
  publish() {
    const now = new Date();
    this.args.onPublish(now);
  }
}

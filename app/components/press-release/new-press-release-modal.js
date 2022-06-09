import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PressReleaseNewPressReleaseModalComponent extends Component {
  @tracked title;

  @action
  createPressRelease(event) {
    event.preventDefault();
    this.args.onCreate(this.title);
  }
}

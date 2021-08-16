import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class PressReleaseSourcesTableComponent extends Component {
  @action
  removeSource(source) {
    this.args.onRemoveSource(source);
  }
}

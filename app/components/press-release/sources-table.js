import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class PressReleaseSourcesTableComponent extends Component {
  @action
  removeSource(source) {
    const sources = this.args.model.slice(0);
    sources.removeObject(source);
    this.args.onRemoveSource(sources);
  }
}

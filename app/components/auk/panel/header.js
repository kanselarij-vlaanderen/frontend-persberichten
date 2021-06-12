import Component from '@glimmer/component';

/**
 *
 * @argument {Boolean} borderless
 */
export default class PanelHeader extends Component {
  get borderless() {
    if (this.args.borderless) {
      return 'auk-panel__header--borderless';
    }
    return null;
  }
}

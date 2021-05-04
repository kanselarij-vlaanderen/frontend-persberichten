import Component from '@glimmer/component';

export default class Alert extends Component {
  /**
   * skin can be:
   * (empty, default)
   * succes
   * warning
   * error
   * loading (not yet implemented in our code below)
   */
  get skin() {
    if (this.args.skin) {
      return `auk-alert--${this.args.skin}`;
    }
    return 'auk-alert--default';
  }

  get icon() {
    if (this.args.icon) {
      return this.args.icon;
    } else if (this.args.skin) {
      if (this.args.skin === 'success') {
        return 'check';
      } else if (this.args.skin === 'warning' || this.args.skin === 'error') {
        return 'alert-triangle';
      }
    }
    return 'circle-info';
  }
}

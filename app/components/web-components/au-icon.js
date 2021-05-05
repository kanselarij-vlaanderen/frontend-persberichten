import Component from '@glimmer/component';

/**
 * Important, @name should be the icon name without prefix
 */
export default class Icon extends Component {
  get size() {
    if (this.args.size) {
      return `auk-icon--${this.args.size}`;
    }
    return 'auk-icon--default';
  }

  get grab() {
    if (this.args.grab) {
      return 'auk-u-cursor-grab';
    }
    return null;
  }

  /*
    Skins can be:
    - muted
    - warning
    - primary
    - success
    - danger
   */
  get iconSkinColor() {
    if (this.args.iconSkinColor) {
      return `auk-icon--${this.args.iconSkinColor}`;
    }
    return null;
  }
}

import Component from '@glimmer/component';
import CONFIG from '../../config/constants';

export default class PressReleaseActivityStepComponent extends Component {
  constructor() {
    super(...arguments);
    this.CONFIG = CONFIG;
  }
}

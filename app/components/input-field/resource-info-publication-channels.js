import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class InputFieldResourceInfoPublicationChannelsComponent extends Component {
  @action
  toggle(a,b) {
    console.log('in here')
    console.log(a)
    console.log(b.target.checked)
  }
}

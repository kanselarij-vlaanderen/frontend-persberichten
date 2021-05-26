import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ContactFormComponent extends Component {
  resource = {};
  newResource = {};

  @action
  onFormRender(existingResource) {
    if (existingResource) {
      this.resource = existingResource;
      // this.newResource = {
      //   ...existingResource,
      //   publicatiekanalen: existingResource.publicatiekanalen.map((channel) => {
      //     return {
      //       ...channel,
      //     };
      //   }),
      // };
    }
  }

  @action
  onInput(element, val) {
    let target = element.target ? element.target.id : element;
    let value = element.target ? element.target.value : val;
    this.args.onInput(target, value);
  }
}

import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ContactFormComponent extends Component {
  source = {};
  newSource = {};

  @action
  onFormRender(existingSource) {
    if (existingSource) {
      this.source = existingSource;
      // this.newSource = {
      //   ...existingSource,
      //   publicatiekanalen: existingSource.publicatiekanalen.map((channel) => {
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

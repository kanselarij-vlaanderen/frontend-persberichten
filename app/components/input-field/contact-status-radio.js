import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class InputFieldContactStatusRadioComponent extends Component {
  @service store;

  @tracked contactStatus;
  @tracked checked;

  @action
  async onRenderStatus(exsistingStatus) {
    if (exsistingStatus) this.checked = exsistingStatus;
    const contactStatus = await this.store.findAll('contactStatus');
    this.contactStatus = contactStatus;
  }
  @action
  onSelectStatus(parentCallback, selected) {
    this.checked = selected;
    parentCallback('contactStatus', selected);
  }
}

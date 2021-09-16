import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PressReleaseOrganizationModalComponent extends Component {
  @tracked selectedOrganizations = [];

  get isDisabled() {
    return this.selectedOrganizations.length === 0;
  }
  @action
  selectOrganizations(selected) {
    this.selectedOrganizations = selected;
  }

  @action
  coEdit() {
    this.args.onConfirm(this.selectedOrganizations);
  }
}

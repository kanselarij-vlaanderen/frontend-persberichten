import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class InputFieldOrganizationSelectComponent extends Component {
  @service store;

  @tracked organizations = [];
  @tracked selected;

  @action
  async onRenderOrganization(initialValue) {
    initialValue ? (this.selected = initialValue) : (this.selected = '');

    const organizations = await this.store.findAll('organization');
    let tempOrganizations = [];
    organizations.forEach((element) => {
      tempOrganizations.push(element.fullName);
    });
    this.organizations = tempOrganizations;
  }

  @action
  changeOrganization(parentCallback, selected) {
    parentCallback('organization', selected);
    this.selected = selected;
  }
}

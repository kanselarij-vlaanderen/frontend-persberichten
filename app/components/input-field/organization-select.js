import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class InputFieldOrganizationSelectComponent extends Component {
  @service store;
  @service currentSession;

  @tracked organizations = [];

  constructor() {
    super(...arguments);
    this.loadOrganizations.perform();
  }

  get label() {
    return this.args.label || 'Organizatie';
  }

  @task
  *loadOrganizations() {
    let organizations = yield this.store.query('organization', {
      'page[size]': 100,
      sort: 'short-name'
    });

    if (this.args.filterUserOrganization) {
      const userOrganization = this.currentSession.organization.uri;
      organizations = organizations.filter(org => org.uri != userOrganization);
    }

    this.organizations = organizations;
  }
}

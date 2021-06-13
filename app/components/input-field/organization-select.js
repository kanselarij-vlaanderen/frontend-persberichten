import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';

export default class InputFieldOrganizationSelectComponent extends Component {
  @service store;

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
    this.organizations = yield this.store.query('organization', {
      'page[size]': 100,
      sort: 'name'
    });
  }
}

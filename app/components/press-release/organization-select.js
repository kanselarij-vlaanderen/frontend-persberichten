import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { restartableTask } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PressReleaseOrganizationSelectComponent extends Component {
  @service store;
  @service currentSession;

  @tracked organizations = [];
  @tracked selected;

  constructor() {
    super(...arguments);
    this.loadOrganizations.perform();
  }

  @task
  *loadOrganizations(searchText) {
    const currentOrganization = this.currentSession.organization;
    const filter = {};

    if (searchText) {
      filter['short-name'] = searchText;
    }

    const organizations = yield this.store.query('organization', {
      'page[size]': 100,
      sort: 'short-name',
      filter
    });
    this.organizations = organizations.filter(organization => organization.uri !== currentOrganization.uri);
  }

  @restartableTask
  *debouncedSearch(searchText) {
      yield timeout(300);
      this.loadOrganizations.perform(searchText);
  }
  @action
  select(selected) {
    this.selected = selected;
    if (this.selected.length) {
      this.args.onChange([...selected, this.currentSession.organization]);
    } else {
      this.args.onChange([]);
    }
  }
}

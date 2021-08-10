import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { restartableTask } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class InputFieldGovernmentFieldSelectComponent extends Component {
  @service store;

  @tracked governmentFields = [];

  constructor() {
    super(...arguments);
    this.loadGovernmentFields.perform();
  }

  @task
  *loadGovernmentFields() {
    this.governmentFields = yield this.store.query('government-field', {
      'page[size]': 100,
      sort: 'pref-label'
    });
  }

  @restartableTask
  *restGovernmentFields(searchText) {
    if (!searchText) {
      yield this.loadGovernmentFields.perform();
    }
  }

  @restartableTask
  *debouncedSearch(searchText) {
      yield timeout(300);
      this.searchGovernmentFields.perform(searchText);
  }

  @restartableTask
  *searchGovernmentFields(searchText) {
    this.governmentFields = yield this.store.query('government-field', {
      'page[size]': 100,
      sort: 'pref-label',
      filter: {
        'pref-label': searchText
      }
    });
  }

  @action
  async setGovernmentFields(selectedOption) {
    this.args.pressRelease.governmentFields = selectedOption;
  }
}

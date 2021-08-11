import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { restartableTask } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';

export default class InputFieldGovernmentFieldSelectComponent extends Component {
  @service store;

  @tracked governmentFields = [];

  constructor() {
    super(...arguments);
    this.loadGovernmentFields.perform();
  }

  @task
  *loadGovernmentFields(searchText) {
    const filter = {};

    if (searchText) {
      filter['pref-label'] = searchText;
    }

    this.governmentFields = yield this.store.query('government-field', {
      'page[size]': 100,
      sort: 'pref-label',
      filter
    });
  }

  @restartableTask
  *debouncedSearch(searchText) {
      yield timeout(300);
      this.loadGovernmentFields.perform(searchText);
  }
}

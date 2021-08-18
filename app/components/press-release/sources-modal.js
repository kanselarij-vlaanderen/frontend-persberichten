import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { restartableTask } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import { action } from '@ember/object';

export default class PressReleaseSourcesModalComponent extends Component {
  @service store;

  @tracked sources = [];
  @tracked selectedSources = [];

  constructor() {
    super(...arguments);
    this.loadSources.perform();
  }

  @task
  *loadSources(searchText) {
    const filter = {}; //enkel actief

    if (searchText) {
      filter['full-name'] = searchText;
    }

    this.sources = yield this.store.query('contact', {
      'page[size]': 100,
      sort: 'full-name',
      filter
    });
  }

  @restartableTask
  *debouncedSearch(searchText) {
    yield timeout(300);
    this.loadSources.perform(searchText);
  }

  @action
  selectSources(selectedSources) {
    this.selectedSources = selectedSources;
  }
}

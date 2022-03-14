import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task, timeout, restartableTask } from 'ember-concurrency';
import { action } from '@ember/object';

export default class PressReleaseContactItemModalComponent extends Component {
  @service store;

  @tracked contactItems = [];
  @tracked selectedContactItems = [];

  constructor() {
    super(...arguments);
    this.loadContactItems.perform();
  }

  @task
  *loadContactItems(searchText) {
    const filter = {};

    if (searchText) {
      filter['full-name'] = searchText;
    }

    this.contactItems = yield this.store.query('contact-item', {
      'page[size]': 100,
      sort: 'full-name',
      filter
    });
  }

  @restartableTask
  *debouncedSearch(searchText) {
    yield timeout(300);
    this.loadContactItems.perform(searchText);
  }

  @action
  selectContactItems(selectedContactItems) {
    this.selectedContactItems = selectedContactItems;
  }
}

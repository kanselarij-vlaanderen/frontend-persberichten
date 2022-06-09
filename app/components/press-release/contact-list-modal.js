import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { restartableTask, timeout, task } from 'ember-concurrency';
import { action } from '@ember/object';

export default class PressReleaseContactListModalComponent extends Component {
  @service store;

  @tracked contactLists = [];
  @tracked selectedContactList = [];

  constructor() {
    super(...arguments);
    this.loadSources.perform();
  }

  @task
  *loadSources(searchText) {
    const filter = {};

    if (searchText) {
      filter['name'] = searchText;
    }

    this.contactLists = yield this.store.query('contact-list', {
      'page[size]': 100,
      sort: 'name',
      filter
    });
  }

  @restartableTask
  *debouncedSearch(searchText) {
    yield timeout(300);
    this.loadSources.perform(searchText);
  }

  @action
  selectContactList(selectedContactList) {
    this.selectedContactList = selectedContactList;
  }
}

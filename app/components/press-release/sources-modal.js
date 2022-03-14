import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { restartableTask, timeout, task } from 'ember-concurrency-decorators';
import { action } from '@ember/object';
import CONFIG from '../../config/constants';

export default class PressReleaseSourcesModalComponent extends Component {
  @service store;
  @service currentSession;

  @tracked sources = [];
  @tracked selectedSources = [];

  constructor() {
    super(...arguments);
    this.loadSources.perform();
  }

  @task
  *loadSources(searchText) {
    const filter = {
      'status': {
        ':uri:': CONFIG.CONTACT_STATUS.ACTIVE
      },
      'creator': {
        ':uri:': this.currentSession.organization.uri
      }
    };

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

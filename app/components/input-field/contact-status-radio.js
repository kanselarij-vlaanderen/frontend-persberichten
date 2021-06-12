import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';

export default class InputFieldContactStatusRadioComponent extends Component {
  @service store;

  @tracked statuses = [];

  constructor() {
    super(...arguments);
    this.loadStatuses.perform();
  }

  @task
  *loadStatuses() {
    this.statuses = yield this.store.query('contact-status', {
      'page[size]': 100,
      sort: 'label'
    });
  }
}

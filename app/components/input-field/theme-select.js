import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class InputFieldThemesSelectionComponent extends Component {
  @service store;

  @tracked themes = [];

  constructor() {
    super(...arguments);
    this.loadThemes.perform();
  }

  @task
  *loadThemes() {
    this.themes = yield this.store.query('theme', {
      'page[size]': 100,
      sort: 'label',
      filter: {
        'is-deprecated': false
      }
    });
  }
}

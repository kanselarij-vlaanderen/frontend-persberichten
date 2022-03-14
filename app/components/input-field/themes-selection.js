import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

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

  @action
  getSelectedThemes(theme) {
    const selectedThemes = this.args.selectedThemes.slice(0);
    const index = selectedThemes.indexOf(theme);
    if (index > -1) {
      selectedThemes.removeObject(theme);
    } else {
      selectedThemes.addObject(theme);
    }
    this.args.onChange(selectedThemes);
  }
}

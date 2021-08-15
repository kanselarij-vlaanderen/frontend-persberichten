import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import { action } from '@ember/object';

export default class PressReleaseSourcesModalComponent extends Component {
  @service store;

  @tracked sources = [];
  @tracked selectedSource;

  constructor() {
    super(...arguments);
    this.loadContacts.perform();
  }

  @task
  *loadContacts() {
    this.sources = yield this.store.findAll('contact');
  }

    @action
    onSelectContact(source) {
      this.selectedSource = source;
    }

    @action
    onAddContact() {
      const sources = this.args.sources.slice(0);
      const index = sources.indexOf(this.selectedSource);
      if (index < 0) {
        sources.addObject(this.selectedSource);
      }
      this.args.onChange(sources);
    }
}

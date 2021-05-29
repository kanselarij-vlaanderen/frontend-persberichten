import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class SourcesInactiveController extends Controller {
  @service router;
  @service store;

  // queryParams = ['sort'];

  @tracked sort = '';
  @tracked page = 0;
  @tracked size = 10;

  @tracked activeContacts;

  @action
  navigateToNewSource() {
    this.router.transitionTo('sources.new');
  }

  @action
  prevPage() {
    // TODO: setter instead of @tracked on qp's before updating to Ember 3.22+ (https://github.com/emberjs/ember.js/issues/18715)
    if (this.page > 0) {
       this.page -=1;
    }
  }

  @action
  nextPage() {
    // TODO: setter instead of @tracked on qp's before updating to Ember 3.22+ (https://github.com/emberjs/ember.js/issues/18715)
    this.page +=1;
  }

  @action
  setSizeOption(size) {
    // TODO: setters instead of @tracked on qp's before updating to Ember 3.22+ (https://github.com/emberjs/ember.js/issues/18715)
    this.size = size;
    this.page = 0;
  }
}

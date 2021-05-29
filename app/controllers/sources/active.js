import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class SourcesActiveController extends Controller {
  @service router;
  @service store;

  // queryParams = ['sort'];

  sort = '';
  page = 0;
  size = 10;

  @tracked activeContacts;
  @tracked queryParams = {
    filter: {
      'contact-status': 'inactief',
    },
  };

  @action
  navigateToNewSource() {
    this.router.transitionTo('sources.new');
  }

  @action
  async getFilteredContacts() {
    // console.log('getting all contacts');
    // const activeContacts = await this.store.query('contact', this.queryParams);
    // this.activeContacts = activeContacts;
    // activeContacts.forEach((a) => console.log(a));
  }
}

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SourcesActiveRoute extends Route {
  @service store;

  async model() {
    console.log('getting all contacts');
    const activeContacts = await this.store.query('contact', {
      filter: {
        'contact-status': 'actief',
      },
    });

    activeContacts.forEach((a) => console.log(a));
  }
}

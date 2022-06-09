import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import CONSTANTS from '../config/constants';

export default class MockLoginRoute extends Route {
  @service session;
  @service store;

  beforeModel() {
    this.session.prohibitAuthentication('index');
  }

  model() {
    return this.store.query('account', {
      include: 'user.group',
      filter: {
        provider: CONSTANTS.SERVICE_PROVIDERS.MOCK_LOGIN,
      },
      sort: 'user.family-name,user.first-name',
      page: {
        size: 100,
        number: 0,
      },
    });
  }
}

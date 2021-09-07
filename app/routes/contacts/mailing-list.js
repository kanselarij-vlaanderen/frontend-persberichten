import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class ContactsMailingListRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'contact-item';

  mergeQueryOptions(params) {
    const queryParams = {
      sort: params.sort,
      include: [
        'telephone',
        'mail-address'
      ].join(','),
      'filter': {
        'contact-list': {
          'id': params.mailing_list_id
        }
      }
    };

    return queryParams;
  }

  setupController(controller, model, transition) {
    super.setupController(...arguments);
    controller.contactList = this.store.findRecord('contact-list', transition.to.params.mailing_list_id);
    controller.selectedContact = null;
  }
}

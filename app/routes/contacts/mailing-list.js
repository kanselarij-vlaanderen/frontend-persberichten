import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';

// export default class ContactsMailingListRoute extends Route.extend(DataTableRouteMixin) {
export default class ContactsMailingListRoute extends Route {
  // modelName = 'contact-list';

  model(params) {
    return this.store.findRecord('contact-list', params.mailing_list_id);
  }
  // mergeQueryOptions(params) {
  //   const queryParams = {
  //     sort: params.sort,
  //     filter: {
  //       'id': params.mailing_list_id
  //     }
  //   };

  //   return queryParams;
  // }

  setupController(controller) {
    super.setupController(...arguments);
    controller.selectedContact = null;
  }
}

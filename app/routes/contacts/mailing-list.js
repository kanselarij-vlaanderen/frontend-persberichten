import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { action } from '@ember/object';

export default class ContactsMailingListRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'contact-item';

  mergeQueryOptions(params) {
    return {
      sort: params.sort,
      include: [
        'telephone',
        'mail-address'
      ].join(','),
      'filter': {
        'contact-list': {
          ':id:': params.mailing_list_id
        }
      }
    };
  }

  async afterModel(model, transition) {
    const mailingListId = transition.to.params.mailing_list_id;
    this.contactList = await this.store.findRecord('contact-list', mailingListId);
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.contactList = this.contactList;
    controller.selectedContact = null;
    controller.isEditEnabled = false;
  }

  @action
  reloadModel() {
    this.refresh();
  }
}

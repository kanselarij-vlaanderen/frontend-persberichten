import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { inject as service } from '@ember/service';

export default class ContactsOverviewMailingListsRoute extends Route.extend(DataTableRouteMixin) {
  @service store;

  modelName = 'contact-list';
}

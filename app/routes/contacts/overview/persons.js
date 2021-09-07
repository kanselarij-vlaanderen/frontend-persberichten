import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class ContactsOverviewPersonsRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'contact-item';
}

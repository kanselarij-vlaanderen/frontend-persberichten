import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ContactsOverviewPersonsRoute extends Route.extend(DataTableRouteMixin) {
  @service store;

  modelName = 'contact-item';

  @action
  reloadModel() {
    this.refresh();
  }
}

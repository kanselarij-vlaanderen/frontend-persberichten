import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class SourcesActiveRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'contact';

  mergeQueryOptions(params){
    const queryParams = {
      sort: params.sort,
      filter: {
        'contact-status': 'actief',
      },
    };

    return queryParams;
  }
}

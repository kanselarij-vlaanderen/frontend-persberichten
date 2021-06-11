import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import CONFIG from '../../../config/constants';

export default class SourcesOverviewActiveRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'contact';

  mergeQueryOptions(params){
    const queryParams = {
      sort: params.sort,
      filter: {
        'status': {
          ':uri:': CONFIG.CONTACT_STATUS.ACTIVE
        }
      },
    };

    return queryParams;
  }
}

import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import CONFIG from '../../../config/constants';

export default class SourcesOverviewInactiveRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'contact';

  mergeQueryOptions(params){
    const queryParams = {
      sort: params.sort,
      include: 'mail-address,organization',
      filter: {
        'status': {
          ':uri:': CONFIG.CONTACT_STATUS.INACTIVE
        }
      },
    };

    return queryParams;
  }
}

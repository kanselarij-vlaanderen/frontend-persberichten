import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import CONFIG from '../../../config/constants';
import { inject as service } from '@ember/service';

export default class SourcesOverviewActiveRoute extends Route.extend(DataTableRouteMixin) {
  @service currentSession;
  modelName = 'contact';

  mergeQueryOptions(params){
    const queryParams = {
      sort: params.sort,
      include: 'mail-address,organization',
      filter: {
        'status': {
          ':uri:': CONFIG.CONTACT_STATUS.ACTIVE
        },
        'creator': {
          ':uri:':  this.currentSession.organization.uri
        }
      },
    };

    return queryParams;
  }
}

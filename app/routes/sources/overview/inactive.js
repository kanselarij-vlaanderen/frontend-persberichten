import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import CONFIG from '../../../config/constants';
import { inject as service } from '@ember/service';

export default class SourcesOverviewInactiveRoute extends Route.extend(DataTableRouteMixin) {
  @service session;
  modelName = 'contact';

  async beforeModel() {
    this.creator = await this.session.currentSession.organization;
  }

  mergeQueryOptions(params){
    const queryParams = {
      sort: params.sort,
      include: 'mail-address,organization',
      filter: {
        'status': {
          ':uri:': CONFIG.CONTACT_STATUS.INACTIVE
        },
        'creator': {
          ':uri:': this.creator.uri
        }
      },
    };

    return queryParams;
  }
}

import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';


export default class PressReleasesOverviewPublishedRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'press-release';

  mergeQueryOptions(params) {
    const queryParams = {
      sort: params.sort,
      include: 'publication-event',
      filter: {
        ':has:publication-event': 'yes',
      },
    };

    queryParams['filter[publication-event][:has:started]'] = 'yes'

    return queryParams;
  }
}
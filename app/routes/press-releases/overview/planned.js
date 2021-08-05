import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class PressReleasesOverviewPlannedRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'press-release';

  mergeQueryOptions(params) {
    const queryParams = {
      sort: params.sort,
      include: 'publication-event',
      filter: {
        ':has:publication-event': 'yes'
        // 'publication-event][:lt:started': `${new Date()}`
      },
    };

    return queryParams;
  }
}
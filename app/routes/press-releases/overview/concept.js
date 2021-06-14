import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class PressReleasesOverviewConceptRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'press-release';

  mergeQueryOptions(params) {
    const queryParams = {
      sort: params.sort,
      include: 'publication-event',
      filter: {
        ':has-no:collaboration': 'yes',
        ':has-no:publication-event': 'yes'
      },
    };

    return queryParams;
  }
}

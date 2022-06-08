import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { inject as service } from '@ember/service';

export default class PressReleasesOverviewSharedRoute extends Route.extend(DataTableRouteMixin) {
  @service store;

  modelName = 'press-release';

  mergeQueryOptions(params) {
    const queryParams = {
      sort: params.sort,
      include: 'publication-event',
      filter: {
        ':has:collaboration': 'yes',
        ':has-no:publication-event': 'yes',
      },
    };

    return queryParams;
  }
}

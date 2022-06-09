import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';

export default class PressReleasesOverviewPlannedRoute extends Route.extend(DataTableRouteMixin) {
  @service store;

  modelName = 'press-release';

  queryParams = {
    search: {
      refreshModel: true,
    },
    themeId: {
      refreshModel: true,
    },
    organizationId: {
      refreshModel: true,
    },
    page: {
      refreshModel: true,
    },
    size: {
      refreshModel: true,
    },
    sort: {
      refreshModel: true,
    },
  };

  mergeQueryOptions(params) {
    this.params = params; // needed in afterModel-hook

    const queryParams = {
      sort: params.sort,
      include: 'publication-event',
      'filter[publication-event][:gt:planned-start-date]': new Date().toISOString(),
    };

    if (isPresent(params.search)) {
      queryParams['filter'] = params.search;
    }

    if (params.themeId) {
      queryParams['filter[themes][:id:]'] = params.themeId;
    }

    if (params.organizationId) {
      queryParams['filter[creator][:id:]'] = params.organizationId;
    }

    return queryParams;
  }

  async afterModel() {
    if (this.params.themeId) {
      this.theme = await this.store.findRecord('theme', this.params.themeId);
    } else {
      this.theme = null;
    }

    if (this.params.organizationId) {
      this.organization = await this.store.findRecord('organization', this.params.organizationId);
    } else {
      this.organization = null;
    }
}

  setupController(controller) {
    super.setupController(...arguments);
    // initialize selected options in power-select
    controller.theme = this.theme;
    controller.organization = this.organization;
  }
}

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PressReleasesOverviewPublishedController extends Controller {
  @tracked sort = '-publication-event.planned-start-date';
  @tracked page = 0;
  @tracked size = 25;
  @tracked search;
  @tracked theme;
  @tracked themeId;
  @tracked organization;
  @tracked organizationId;

  @action
  setThemeFilter(theme) {
    this.themeId = theme?.id;
  }

  @action
  setOrganizationFilter(organization) {
    this.organizationId = organization?.id;
  }

  @action
  prevPage() {
    if (this.page > 0) {
      this.page -= 1;
    }
  }

  @action
  nextPage() {
    this.page += 1;
  }

  @action
  setPageSize(size) {
    this.size = size;
    this.page = 0;
  }

  @action
  setSort(sort) {
    this.sort = sort;
  }
}

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PressReleasesOverviewSharedController extends Controller {
  @tracked sort = '-modified';
  @tracked page = 0;
  @tracked size = 25;

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

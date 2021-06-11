import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SourcesOverviewActiveController extends Controller {
  @tracked sort = 'full-name';
  @tracked page = 0;
  @tracked size = 10;

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
  setSizeOption(size) {
    this.size = size;
    this.page = 0;
  }
}

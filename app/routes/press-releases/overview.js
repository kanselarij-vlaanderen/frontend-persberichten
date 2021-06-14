import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class PressReleasesOverviewRoute extends Route {
  @action
  reloadModel() {
    this.refresh();
  }
}

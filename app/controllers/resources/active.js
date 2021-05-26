import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ResourcesActiveController extends Controller {
  @service router;

  @action
  navigateToNewResource() {
    this.router.transitionTo('resources.new');
  }
}

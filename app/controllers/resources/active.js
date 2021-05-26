import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SourcesActiveController extends Controller {
  @service router;

  @action
  navigateToNewSource() {
    this.router.transitionTo('sources.new');
  }
}

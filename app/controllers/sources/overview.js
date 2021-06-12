import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class SourcesOverviewController extends Controller {
  @action
  navigateToNewSource() {
    this.transitionToRoute('sources.new');
  }
}

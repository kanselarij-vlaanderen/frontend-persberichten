import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class SourcesNewController extends Controller {
  @tracked showConfirmationModal;

  get snapshot() {
    return this.model;
  }

  get source() {
    return this.snapshot.source;
  }

  @task
  *saveChanges() {
    yield this.snapshot.save();
    this.transitionToRoute('sources.overview');
  }

  @action
  navigateBack() {
    if (this.source.isNew) {
      this.showConfirmationModal = true;
    } else {
      this.transitionToRoute('sources.overview');
    }
  }

  @action
  confirmNavigationBack() {
    this.showConfirmationModal = false;
    this.transitionToRoute('sources.overview');
  }

  @action
  cancelNavigationBack() {
    this.showConfirmationModal = false;
  }

}

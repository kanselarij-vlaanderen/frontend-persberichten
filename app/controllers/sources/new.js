import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SourcesNewController extends Controller {
  @service router;

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
    this.router.transitionTo('sources.overview');
  }

  @action
  navigateBack() {
    if (this.source.isNew) {
      this.showConfirmationModal = true;
    } else {
      this.router.transitionTo('sources.overview');
    }
  }

  @action
  confirmNavigationBack() {
    this.showConfirmationModal = false;
    this.router.transitionTo('sources.overview');
  }

  @action
  cancelNavigationBack() {
    this.showConfirmationModal = false;
  }

}

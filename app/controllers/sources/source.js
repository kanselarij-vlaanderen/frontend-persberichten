import Controller from '@ember/controller';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class SourcesSourceController extends Controller {
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
  }

  @task
  *navigateBack() {
    const isDirty = yield this.snapshot.isDirty();
    if (isDirty) {
      this.showConfirmationModal = true;
    } else {
      this.transitionToRoute('sources.overview');
    }
  }

  @task
  *confirmNavigationBack() {
    yield this.snapshot.rollback();
    this.showConfirmationModal = false;
    this.transitionToRoute('sources.overview');
  }

  @action
  cancelNavigationBack() {
    this.showConfirmationModal = false;
  }
}

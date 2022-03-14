import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class SourcesSourceController extends Controller {
  @service router;
  @service store;

  @tracked showConfirmationModal;
  @tracked showDeleteSourceModal;

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
      this.router.transitionTo('sources.overview');
    }
  }

  @task
  *confirmNavigationBack() {
    yield this.snapshot.rollback();
    this.showConfirmationModal = false;
    this.router.transitionTo('sources.overview');
  }

  @action
  cancelNavigationBack() {
    this.showConfirmationModal = false;
  }

  @action
  openDeleteSourceModal() {
    this.showDeleteSourceModal = true;
  }

  @action
  closeDeleteSourceModal() {
    this.showDeleteSourceModal = false;
  }

  @task
  *confirmSourceDeletion() {
    yield Promise.all([
      this.snapshot.telephone.destroyRecord(),
      this.snapshot.mobilePhone.destroyRecord(),
      this.snapshot.mailAddress.destroyRecord()
    ]);
    yield this.snapshot.source.destroyRecord();

    this.closeDeleteSourceModal();
    this.router.transitionTo('sources.overview');
  }
}

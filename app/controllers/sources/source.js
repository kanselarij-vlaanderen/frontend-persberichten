import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
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

  @task
  *confirmSourceDeletion() {
    const telephone = this.snapshot.telephone;
    const mobilePhone = this.snapshot.mobilePhone;
    const mailAddress = this.snapshot.mailAddress;
    yield Promise.all([
      yield telephone.destroyRecord(),
      yield mobilePhone.destroyRecord(),
      yield mailAddress.destroyRecord()
    ]);

    yield this.snapshot.source.destroyRecord();

    this.closeDeleteSourceModal();
    this.transitionBack();
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

  transitionBack() {
    // If no route where you returned from go to the sources overview page
    if (history.length > 1) {
      history.back();
    } else {
      this.router.transitionTo('sources.overview');
    }
  }
}

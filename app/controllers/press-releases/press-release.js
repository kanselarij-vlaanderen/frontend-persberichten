import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';

export default class PressReleasesPressReleaseController extends Controller {
  @tracked showPublicationModal = false;
  @tracked showPublicationPlanningModal = false;
  @tracked showConfirmationModal = false;


  get snapshot() {
    return this.model;
  }

  get pressRelease() {
    return this.snapshot.pressRelease;
  }

  @task
  *savePressRelease() {
    yield this.snapshot.save();
  }

  @action
  saveChanges() {
    this.savePressRelease.perform();
  }

  @action
  async saveChangesAndNavigateBack() {
    await this.savePressRelease.perform();
    this.transitionToRoute('press-releases.overview');
  }

  @task
  *navigateBack() {
    const isDirty = yield this.snapshot.isDirty();
    if (isDirty) {
      this.showConfirmationModal = true;
    } else {
      this.transitionToRoute('press-releases.overview');
    }
  }

  @task
  *confirmNavigationBack() {
    yield this.snapshot.rollback();
    this.showConfirmationModal = false;
    this.transitionToRoute('press-releases.overview');
  }

  @action
  cancelNavigationBack() {
    this.showConfirmationModal = false;
  }

  @task
  *publish(publicationDate) {
    if (!(publicationDate instanceof Date)) {
      publicationDate = new Date();
    }

    let publicationEvent = yield this.snapshot.pressRelease.publicationEvent;
    if (!publicationEvent) {
      publicationEvent = this.store.createRecord('publication-event', {
        plannedStartDate: publicationDate,
        pressRelease: this.model
      });
    } else {
      publicationEvent.plannedStartDate = publicationDate;
    }
    yield publicationEvent.save();
    this.showPublicationModal = false;
    this.showPublicationPlanningModal = false;
  }

  @action
  openPublicationModal() {
    this.showPublicationModal = true;
  }

  @action
  closePublicationModal() {
    this.showPublicationModal = false;
  }

  @action
  openPublicationPlanningModal() {
    this.showPublicationPlanningModal = true;
  }

  @action
  closePublicationPlanningModal() {
    this.showPublicationPlanningModal = false;
  }
}

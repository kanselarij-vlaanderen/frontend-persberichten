import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';

export default class PressReleasesPressReleaseController extends Controller {

  @service router;

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
    this.transitionToRoute(this.from);
  }

  @task
  *navigateBack() {
    const isDirty = yield this.snapshot.isDirty();
    if (isDirty) {
      this.showConfirmationModal = true;
    } else {
      this.transitionToRoute(this.from);
    }
  }

  @task
  *confirmNavigationBack() {
    yield this.snapshot.rollback();
    this.showConfirmationModal = false;
    this.transitionToRoute(this.from);
  }

  @action
  cancelNavigationBack() {
    this.showConfirmationModal = false;
  }

  @task
  *publish(publicationDate, fromLaterDatePointer) {
    let publicationEvent = yield this.snapshot.pressRelease.publicationEvent;

    if (!publicationEvent) {
      if(fromLaterDatePointer) {
        publicationEvent = this.store.createRecord('publication-event', {
          plannedStartDate: publicationDate,
          pressRelease: this.snapshot.pressRelease
        });
      } else {
        publicationEvent = this.store.createRecord('publication-event', {
          started: publicationDate,
          pressRelease: this.snapshot.pressRelease
        });
      }
    } else {
      if(fromLaterDatePointer) {
        publicationEvent.plannedStartDate = publicationDate;
      } else {
        publicationEvent.started = publicationDate;
      }
    }

    yield publicationEvent.save();

    this.showPublicationModal = false;
    this.showPublicationPlanningModal = false;
  }

  @task
  *revokePressRelease() {
    let pressRelease = yield this.snapshot.pressRelease;
    let publicationEvent = yield this.snapshot.pressRelease.publicationEvent;
    yield publicationEvent.deleteRecord();
    pressRelease.publicationEvent = null;
    yield pressRelease.save();

    //deleteRecord to make sure it is deleted in DB, not sure if keeps excisting after pressRelease.publicationEvent = null;
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

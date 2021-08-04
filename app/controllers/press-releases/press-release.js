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
  *publish(publicationDate) {
    let withDate = (publicationDate instanceof Date)
    if (!withDate) {
      console.log("here")
      publicationDate = new Date();
    }

    let publicationEvent = yield this.snapshot.pressRelease.publicationEvent;
    if (!publicationEvent) {
      if(!withDate) {
        publicationEvent = this.store.createRecord('publication-event', {
          started: publicationDate,
          pressRelease: this.model
        });
      } else {
        publicationEvent = this.store.createRecord('publication-event', {
          plannedStartDate: publicationDate,
          pressRelease: this.model
        });
      }
    } else {
      if(!withDate) {
        publicationEvent.started = publicationDate;
      } else {
        publicationEvent.plannedStartDate = publicationDate;
      }
    }

    yield publicationEvent.save();
    // this.model.pressRelease.publicationEvent = publicationEvent;
    // yield this.model.save();
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

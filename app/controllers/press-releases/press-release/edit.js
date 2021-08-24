import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';

export default class PressReleasesPressReleaseEditController extends Controller {

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

  transitionBack() {
    // If no route where you returned from go to the concept page
    if (history.length > 1) {
      history.back();
    } else {
      this.router.transitionTo('press-releases.overview.concept');
    }
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
    this.transitionBack();
  }

  @task
  *navigateBack() {
    const isDirty = yield this.snapshot.isDirty();
    if (isDirty) {
      this.showConfirmationModal = true;
    } else {
      this.transitionBack();
    }
  }

  @task
  *confirmNavigationBack() {
    yield this.snapshot.rollback();
    this.showConfirmationModal = false;
    this.transitionBack();
  }

  @action
  cancelNavigationBack() {
    this.showConfirmationModal = false;
  }

  @task
  *publish(publicationDate) {
    if (yield this.snapshot.isDirty()) {
      yield this.savePressRelease.perform();
    }

    let publicationEvent = yield this.snapshot.pressRelease.publicationEvent;
    const publicationChannels = (yield this.pressRelease.publicationChannels).slice(0);


    if (!publicationEvent) {
      publicationEvent = this.store.createRecord('publication-event', {
        plannedStartDate: publicationDate,
        pressRelease: this.snapshot.pressRelease,
        publicationChannels: publicationChannels
      });
    } else {
      publicationEvent.plannedStartDate = publicationDate;
      publicationEvent.publicationChannels = publicationChannels;
    }

    yield publicationEvent.save();

    this.showPublicationModal = false;
    this.showPublicationPlanningModal = false;

  }

  @task
  *revokePressRelease() {
    const publicationEvent = yield this.snapshot.pressRelease.publicationEvent;
    yield publicationEvent.destroyRecord();
    yield publicationEvent.save();
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
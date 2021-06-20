import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';

export default class PressReleasesPressReleaseController extends Controller {
  @tracked showPublishDropdown = false;
  @tracked showPublicationModal = false;
  @tracked showPublicationPlanningModal = false;

  @task
  *publish(publicationDate) {
    if (!publicationDate) {
      publicationDate = new Date();
    }

    let publicationEvent = yield this.model.publicationEvent;
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
  openPublishDropdown() {
    this.showPublishDropdown = true;
  }

  @action
  openPublicationModal() {
    this.showPublicationModal = true;
    this.showPublishDropdown = false;
  }

  @action
  closePublicationModal() {
    this.showPublicationModal = false;
  }

  @action
  openPublicationPlanningModal() {
    this.showPublicationPlanningModal = true;
    this.showPublishDropdown = false;
  }

  @action
  closePublicationPlanningModal() {
    this.showPublicationPlanningModal = false;
  }
}

import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';
import { isBlank } from '@ember/utils';
import CONFIG from '../../../config/constants';

export default class PressReleasesPressReleaseEditController extends Controller {
  @service currentSession;
  @service router;
  @service store;
  @service toaster;

  @tracked showPublicationModal = false;
  @tracked showPublicationPlanningModal = false;
  @tracked showConfirmationModal = false;
  @tracked showDeletionModal = false;
  @tracked showOrganizationModal = false;

  get snapshot() {
    return this.model;
  }

  get pressRelease() {
    return this.snapshot.pressRelease;
  }

  get isPublishDisabled() {
    return isBlank(this.pressRelease.title)
      || isBlank(this.pressRelease.htmlContent)
      || !this.pressRelease.publicationChannels.length;
  }

  async transitionBack() {
    if (this.pressRelease) {
      const publicationEvent = await this.pressRelease.publicationEvent;
      if (publicationEvent) {
        if (publicationEvent.isPublished) {
          this.router.transitionTo('press-releases.overview.published');
        } else {
          this.router.transitionTo('press-releases.overview.planned');
        }
      } else {
        this.router.transitionTo('press-releases.overview.concept');
      }
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
    await this.transitionBack();
  }

  @task
  *navigateBack() {
    const isDirty = yield this.snapshot.isDirty();
    if (isDirty) {
      this.showConfirmationModal = true;
    } else {
      yield this.transitionBack();
    }
  }

  @task
  *confirmNavigationBack() {
    yield this.snapshot.rollback();
    this.showConfirmationModal = false;
    yield this.transitionBack();
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
    const contactLists = (yield this.pressRelease.contactLists).slice(0);
    const contactItems = (yield this.pressRelease.contactItems).slice(0);


    if (!publicationEvent) {
      publicationEvent = this.store.createRecord('publication-event', {
        plannedStartDate: publicationDate,
        pressRelease: this.snapshot.pressRelease,
        publicationChannels: publicationChannels,
        contactLists: contactLists,
        contactItems: contactItems
      });
    } else {
      publicationEvent.plannedStartDate = publicationDate;
      publicationEvent.publicationChannels = publicationChannels;
      publicationEvent.contactLists = contactLists;
      publicationEvent.contactItems = contactItems;
    }

    yield publicationEvent.save();

    if (publicationDate < new Date()) { // press-release is published immediately
      this.router.transitionTo('press-releases.press-release.published', this.snapshot.pressRelease.id);
    }

    this.showPublicationModal = false;
    this.showPublicationPlanningModal = false;

  }

  @task
  *revokePressRelease() {
    try {
      const publicationEvent = yield this.snapshot.pressRelease.publicationEvent;
      yield publicationEvent.destroyRecord();
      yield publicationEvent.save();
      this.toaster.success('Persbericht werd succesvol teruggetrokken.');
    } catch(err) {
      this.toaster.error('Er is iets misgegaan bij het terugtrekken van het persbericht.');
    }
  }

  @task
  *confirmDeletion() {
    const publicationEvent = yield this.snapshot.pressRelease.publicationEvent;
    if (publicationEvent) {
      yield publicationEvent.destroyRecord();
    }
    yield this.snapshot.pressRelease.destroyRecord();
    yield this.transitionBack();
    this.showDeletionModal = false;
  }

  @task
  *coEdit(organizations) {
    if (yield this.snapshot.isDirty()) {
      yield this.savePressRelease.perform();
    }

    // Create press release activity
    const creator = this.currentSession.organization;
    const user = this.currentSession.user;
    const { SHARE } = CONFIG.PRESS_RELEASE_ACTIVITY;
    const activity = this.store.createRecord('press-release-activity', {
      startDate: new Date(),
      type: SHARE,
      organization: creator,
      pressRelease: this.pressRelease,
      creator: user
    });
    yield activity.save();

    const collaborationActivity = this.store.createRecord('collaboration-activity', {
      startDate: new Date(),
      pressRelease: this.pressRelease,
      collaborators: organizations
    });
    yield collaborationActivity.save();
    const url = `/collaboration-activities/${collaborationActivity.id}/share`;
    const response = yield fetch(url, {
        method: 'POST',
      }
    );
    if (response.status === 204) {
      this.router.transitionTo('press-releases.press-release.shared.read', this.pressRelease);
    }
    this.showOrganizationModal = false;
  }

  @action
  openDeletionModal() {
    this.showDeletionModal = true;
  }

  @action
  cancelDeletion() {
    this.showDeletionModal = false;
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

  @action
  openOrganizationModal() {
    this.showOrganizationModal = true;
  }

  @action
  closeOrganizationModal() {
    this.showOrganizationModal = false;
  }
}

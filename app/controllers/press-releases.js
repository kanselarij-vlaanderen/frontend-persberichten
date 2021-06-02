import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class PressReleasesController extends Controller {
  @service store;
  @service router;
  @tracked pressReleaseModalOpen = false;
  @tracked title = '';


  @action
  openPressReleaseModal() {
    this.pressReleaseModalOpen = true;
  }

  @action
  closePressReleaseModal() {
    this.pressReleaseModalOpen = false;
  }

  @action
  createPressRelease() {
    const newPressRelease = this.store.createRecord('press-release');
    newPressRelease.title = this.title;
    newPressRelease.created = new Date();
    newPressRelease.modified = new Date();

    try {
      newPressRelease.save().then(() => {
      this.pressReleaseModalOpen = false;
    });
    } catch(err) {
      console.log(err);
    }
  }

  @action
  onInputTitle(title) {
    this.title = title.target.value;
  }
}

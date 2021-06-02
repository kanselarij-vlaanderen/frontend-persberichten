import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class PressReleasesEditController extends Controller {
  @service router;
  @service store;

  @tracked actionsDropdownOpen = false;
  @tracked publishDropdownOpen = false;
  @tracked publishModal = false;
  @tracked publishLaterModal = false;

  @tracked pressRelease;

  selectedThemes = ["Begroting en financieën", "Europese Instellingen"];
  themesAdded = [];
  themesDeleted = [];

  @action
  async navigateToPressReleases() {
    this.pressRelease.rollbackAttributes();
    this.themesAdded.forEach(a => this.pressRelease.theme.removeObject(a));
    this.themesDeleted.forEach(a => this.pressRelease.theme.pushObject(a));
    this.router.transitionTo('press-releases');
  }

  @action
  openActionDropdown() {
    this.actionsDropdownOpen = !this.actionsDropdownOpen;
  }

  @action
  openPublishDropdown() {
    this.publishDropdownOpen = !this.publishDropdownOpen;
  }

  @action
  async onEditRender() {
    this.pressRelease = await this.store.findRecord('press-release', this.model.id);

    // https://guides.emberjs.com/release/models/relationships/
    // Removing relationships
  }

  @action
  onInput(element) {
    this.pressRelease[element.target.id] = element.target.value;
    this.pressRelease.modified = new Date();
  }

  @action
  onSelectTheme(theme, checked) {
    if(checked) {
      this.pressRelease.theme.pushObject(theme);
      this.themes.push(theme);
    } else {
      this.pressRelease.theme.themesDeleted(theme);
      this.themesDeleted.push(theme);
    }
  }

  @action
  save() {
    try {
      console.log('saving press release');
      this.pressRelease.save().then(() => this.dropdownOpen = !this.dropdownOpen);
    } catch(err) {
      console.log(err);
    }
  }

  @action
  saveAndClose() {
    try {
      this.pressRelease
        .save()
        .then(() => {
          this.dropdownOpen = !this.dropdownOpen;
          this.router.transitionTo('press-releases');
        });
    } catch(err) {
      console.log(err);
    }
  }

  @action
  openPublishModal() {
    this.publishDropdownOpen = false;
    this.publishModal = true;
  }

  @action
  openPublishLaterModal() {
    this.publishDropdownOpen = false;
    this.publishLaterModal = true;
  }

  @action
  closePublishModal() {
    this.publishLaterModal = false;
    this.publishModal = false;
  }

  @action
  publish() {
    console.log('publishing now');
    // const event = this.store.createRecord('publication-event');
    // event.publishedStartDateTime = new Date();
    // event.publicationStartDateTime = new Date();
    // event.publicationEndDateTime = new Date();
    // event.save().then(a=>console.log(a));
    // add when be calls OK
  }

  @action
  publishLater() {
    console.log('publishing later');
    // const event = this.store.createRecord('publication-event');
    // event.publishedStartDateTime = new Date();
    // event.publicationStartDateTime = new Date();
    // event.publicationEndDateTime = new Date();
    // event.save().then(a=>console.log(a));
    // add when be calls OK
  }

  @action
  onChangeDate(a) {
    console.log(a);
  }
}

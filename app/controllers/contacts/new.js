import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ContactsNewController extends Controller {
  @tracked step = 0;
  @tracked isManualInput = true;


  get title() {
    return ['Basis informatie', 'Ontvangers', 'Contactgegevens'][this.step];
  }

  get progress() {
    return (this.step + 1) * 25;
  }

  @action
  setInputType() {
    this.isManualInput = !this.isManualInput;
  }

  @action
  async navigateBack() {
    await this.model.destroyRecord();
    this.step = 0;
    this.transitionToRoute('contacts.overview');
  }

  @action
  setInputValue(record, attribute, event) {
    record[attribute] = event.target.value;
  }

  @action
  nextStep() {
    this.step += 1;
  }

  @action
  previousStep() {
    this.step -= 1;
  }
}

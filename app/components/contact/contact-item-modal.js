import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ContactContactItemModalComponent extends Component {
  @tracked contact = {};

  constructor() {
    super(...arguments);
    if (this.args.selectedContact) {
      this.contact = this.args.selectedContact;
    }
  }

  get isAddDisabled() {
    return !this.contact.givenName &&
           !this.contact.familyName &&
           !this.contact.telephone &&
           !this.contact.mailAddress &&
           !this.contact.organizationName;
  }

  @action
  setInputValue(attribute, event) {
    this.contact[attribute] = event.target.value;
    this.contact = {...this.contact};
  }
}

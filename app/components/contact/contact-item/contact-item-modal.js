import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { isBlank } from '@ember/utils';

export default class ContactContactItemModalComponent extends Component {
  @service currentSession;
  @service store;

  @tracked contact;

  constructor() {
    super(...arguments);
    if (this.args.contact) {
      this.contact = this.args.contact;
    } else {
      const creator = this.currentSession.organization;
      const telephone = this.store.createRecord('telephone', {creator});
      const mailAddress = this.store.createRecord('mail-address', {creator});
      this.contact = this.store.createRecord('contact-item', {telephone, mailAddress});
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
  }

  @action
  async setRelationInputValue(attribute, event) {
    (await this.contact[attribute]).value = event.target.value;
  }

  @action
  setFullName() {
    const fullName = [this.contact.givenName, this.contact.familyName]
      .filter(n => !isBlank(n))
      .join(" ");
    this.contact.fullName = fullName;
  }
}

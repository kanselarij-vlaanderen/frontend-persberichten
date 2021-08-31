import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { isBlank } from '@ember/utils';

export default class ContactItemModalComponent extends Component {
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
    return isBlank(this.contact.givenName) &&
           isBlank(this.contact.familyName) &&
           isBlank(this.contact.telephone.get("value")) &&
           isBlank(this.contact.mailAddress.get("value")) &&
           isBlank(this.contact.organizationName);
  }

  @action
  setInputValue(attribute, event) {
    this.args.contact[attribute] = event.target.value;
  }

  @action
  async setRelationInputValue(attribute, event) {
    (await this.args.contact[attribute]).value = event.target.value;
  }

  @action
  setFullName() {
    const fullName = [this.args.contact.givenName, this.args.contact.familyName]
      .filter(n => !isBlank(n))
      .join(" ");
    this.args.contact.fullName = fullName;
  }
}

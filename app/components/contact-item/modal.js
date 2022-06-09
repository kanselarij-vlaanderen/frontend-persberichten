import Component from '@glimmer/component';
import { action } from '@ember/object';
import { isBlank } from '@ember/utils';

export default class ContactItemModalComponent extends Component {
  get isAddDisabled() {
    return isBlank(this.args.contact.givenName) &&
           isBlank(this.args.contact.familyName) &&
           isBlank(this.args.contact.telephone.get('value')) &&
           isBlank(this.args.contact.mailAddress.get('value')) &&
           isBlank(this.args.contact.organizationName);
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
  async setTelephoneValue(attribute, event) {
    let value = event.target.value;
    value = value ? value.replace(/\D/g, '') : null; // remove any non-digit
    (await this.args.contact[attribute]).value = value;
  }

  @action
  async cleanTelephoneValue(attribute) {
    const record = await this.args.contact[attribute];
    if (record.value) {
      record.value = record.value.replace(/\D/g, ''); // remove any non-digit
    }
  }

  @action
  async cleanEmailValue(attribute) {
    const record = await this.args.contact[attribute];
    if (record.value) {
      record.value = record.value.replace(/\s/g, ''); // remove any space
    }
  }

  @action
  setFullName() {
    const fullName = [this.args.contact.givenName, this.args.contact.familyName]
      .filter(n => !isBlank(n))
      .join(" ");
    this.args.contact.fullName = fullName;
  }

  @action
  saveContact(e) {
    e.preventDefault();
    if (this.args.isNewContact) {
      this.args.onAddContact();
    } else {
      this.args.onChangeContact();
    }
  }
}

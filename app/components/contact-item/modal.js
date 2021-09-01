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
  setFullName() {
    const fullName = [this.args.contact.givenName, this.args.contact.familyName]
      .filter(n => !isBlank(n))
      .join(" ");
    this.args.contact.fullName = fullName;
  }
}

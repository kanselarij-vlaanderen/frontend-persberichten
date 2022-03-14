import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { isBlank } from '@ember/utils';

export default class ContactFormComponent extends Component {
  @tracked selectedStatus;
  @tracked telephone;
  @tracked mobilePhone;
  @tracked mailAddress;

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  @task
  *loadData() {
    this.selectedStatus = yield this.args.source.status;
    this.telephone = yield this.args.source.telephone;
    this.mobilePhone = yield this.args.source.mobilePhone;
    this.mailAddress = yield this.args.source.mailAddress;
  }

  @action
  setInputValue(record, attribute, event) {
    record[attribute] = event.target.value;
  }

  @action
  setFullName() {
    const fullName = [this.args.source.givenName, this.args.source.familyName]
      .filter(n => !isBlank(n))
      .join(" ");
    this.args.source.fullName = fullName;
  }

  @action
  selectOrganization(organization) {
    this.args.source.organization = organization;
  }

  @action
  setContactStatus(status) {
    this.selectedStatus = status;
    this.args.source.status = status;
  }
}

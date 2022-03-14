import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CurrentSessionService extends Service {
  @service session;
  @service store;

  @tracked account;
  @tracked user;
  @tracked group;
  @tracked roles;
  @tracked organization;

  get isValidUser() {
    return this.session.isAuthenticated && this.organization != null;
  }

  async load() {
    const accountId = this.session.data.authenticated.relationships?.account?.data?.id;
    if (accountId) {
      this.account = await this.store.find('account', accountId);
      this.user = await this.account.user;

      const groupId = this.session.data.authenticated.relationships?.group?.data?.id;
      if (groupId) {
        this.group = await this.store.find('user-group', groupId);
        this.organization = await this.store.findRecordByUri('organization', this.group.uri);
      }

      this.roles = this.session.data.authenticated.data?.attributes?.roles || [];
    } else {
      this.reset();
    }
  }

  reset() {
    this.account = null;
    this.user = null;
    this.group = null;
    this.organization = null;
    this.roles = [];
  }
}

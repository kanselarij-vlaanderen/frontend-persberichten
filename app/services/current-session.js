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

  async load() {
    if (this.session.isAuthenticated) {
      const accountId = this.session.get('data.authenticated.relationships.account.data.id');
      this.account = await this.store.find('account', accountId);
      this.user = await this.account.user;


      const groupId = this.session.get('data.authenticated.relationships.group.data.id');
      if (groupId) {
        this.group = await this.store.find('user-group', groupId);
        this.organization = await this.store.findRecordByUri('organization', this.group.uri);
      }

      this.roles = this.session.get('data.authenticated.data.attributes.roles');
    }
  }
}

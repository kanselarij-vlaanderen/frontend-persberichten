import Route from '@ember/routing/route';
import SourceSnapshot from '../../utils/source-snapshot';
import CONFIG from '../../config/constants';
import { inject as service } from '@ember/service';

export default class SourcesNewRoute extends Route {
  @service currentSession;
  @service store;

  async model() {
    const creator = this.currentSession.organization;

    const status = await this.store.findRecordByUri('contact-status', CONFIG.CONTACT_STATUS.ACTIVE);
    const telephone = this.store.createRecord('telephone', { creator });
    const mobilePhone = this.store.createRecord('mobile-phone', { creator });
    const mailAddress = this.store.createRecord('mail-address', { creator });
    const source = this.store.createRecord('contact', {
      status,
      telephone,
      mobilePhone,
      mailAddress,
      creator
    });

    const snapshot = new SourceSnapshot(source);
    await snapshot.commit();
    return snapshot;
  }
}

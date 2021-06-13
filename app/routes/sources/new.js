import Route from '@ember/routing/route';
import SourceSnapshot from '../../utils/source-snapshot';
import CONFIG from '../../config/constants';

export default class SourcesNewRoute extends Route {
  async model() {
    const status = await this.store.findRecordByUri('contact-status', CONFIG.CONTACT_STATUS.ACTIVE);
    const telephone = this.store.createRecord('telephone', {});
    const mobilePhone = this.store.createRecord('mobile-phone', {});
    const mailAddress = this.store.createRecord('mail-address', {});
    const source = this.store.createRecord('contact', {
      status,
      telephone,
      mobilePhone,
      mailAddress
    });

    const snapshot = new SourceSnapshot(source);
    await snapshot.commit();
    return snapshot;
  }
}

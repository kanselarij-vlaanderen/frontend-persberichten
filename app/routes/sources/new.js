import Route from '@ember/routing/route';
import CONFIG from '../../config/constants';

export default class SourcesNewRoute extends Route {
  async model() {
    const status = await this.store.findRecordByUri('contact-status', CONFIG.CONTACT_STATUS.ACTIVE);
    const telephone = this.store.createRecord('telephone', {});
    const mobilePhone = this.store.createRecord('mobile-phone', {});
    const mailAddress = this.store.createRecord('mail-address', {});
    const contact = this.store.createRecord('contact', {
      status,
      telephone,
      mobilePhone,
      mailAddress
    });

    return contact;
  }
}

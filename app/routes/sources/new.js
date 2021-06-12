import Route from '@ember/routing/route';
import { action } from '@ember/object';
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

  @action
  willTransition(transition) {
    const model = this.modelFor('sources.new');
    if (model.isNew &&
        !confirm('De bron is nog niet opgeslagen. Bent u zeker dat u de pagina wil verlaten?')) {
      transition.abort();
    } else {
      return true;
    }
  }
}

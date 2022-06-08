import Route from '@ember/routing/route';
import SourceSnapshot from '../../utils/source-snapshot';
import { inject as service } from '@ember/service';

export default class SourcesSourceRoute extends Route {
  @service store;

  async model(params) {
    const source = await this.store.findRecord('contact', params.source_id, {
      include: [
        'status',
        'telephone',
        'mobile-phone',
        'mail-address',
        'organization'
      ].join(',')
    });

    const snapshot = new SourceSnapshot(source);
    await snapshot.commit();
    return snapshot;
  }
}

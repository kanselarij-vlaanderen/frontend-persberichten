import Route from '@ember/routing/route';

export default class SourcesSourceRoute extends Route {
  model(params) {
    return this.store.findRecord('contact', params.source_id, {
      include: [
        'status',
        'telephone',
        'mobile-phone',
        'mail-address',
        'organization'
      ].join(',')
    });
  }
}

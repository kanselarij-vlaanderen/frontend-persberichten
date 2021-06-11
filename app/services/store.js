import Store from '@ember-data/store';

export default class ExtendedStoreService extends Store {
  /*
   * Executes regular "query"-method. Queries for only one result and returns that if any.
   */
  async queryOne(modelName, query, options) {
    if (!(query['page[size]'] || (query.page && query.page.size))) {
      query['page[size]'] = 1;
    }
    const results = await this.query(modelName, query, options);
    if (results.length) {
      return results.firstObject;
    }
    return null;
  }

  findRecordByUri(modelName, uri) {
    const cachedRecord = this.peekAll(modelName).findBy('uri', uri);
    if (cachedRecord) {
      return cachedRecord;
    } else {
      return this.queryOne(modelName, {
        'filter[:uri:]': uri,
      });
    }
  }
}

import Model, { attr, belongsTo } from '@ember-data/model';

export default class AccountModel extends Model {
  @attr() provider;

  @belongsTo('user') user;

  get gebruiker() {
    return this.user; // alias required for ember-mock-login addon
  }
}

import Model, { attr, belongsTo } from '@ember-data/model';

export default class UserModel extends Model {
  @attr() firstName;
  @attr() familyName;

  @belongsTo('account') account;
  @belongsTo('user-group') group;

  get fullName() {
    return [this.firstName, this.familyName].filter(s => s != null).join(' ');
  }
}

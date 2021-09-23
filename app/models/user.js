import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class UserModel extends Model {
  @attr() firstName;
  @attr() familyName;

  @belongsTo('account') account;
  @belongsTo('user-group') group;
  @belongsTo('token-claim') tokenClaim;
  @hasMany('press-release-activity') pressReleaseActivities;

  get fullName() {
    return [this.firstName, this.familyName].filter(s => s != null).join(' ');
  }
}

import Model, { attr, hasMany } from '@ember-data/model';

export default class UserGroupModel extends Model {
  @attr() name;

  @hasMany('user') users;
}

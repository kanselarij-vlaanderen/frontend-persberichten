import Model, { attr, hasMany } from '@ember-data/model';

export default class UserGroupModel extends Model {
  @attr('string') name;
  @attr('string') uri;

  @hasMany('user') users;
}

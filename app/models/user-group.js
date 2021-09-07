import Model, { attr, hasMany } from '@ember-data/model';

export default class UserGroupModel extends Model {
  @attr('string') uri;
  @attr('string') name;
  @attr('string') identifier;

  @hasMany('user') users;
}

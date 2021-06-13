import Model, { attr, hasMany } from '@ember-data/model';

export default class ContactStatusModel extends Model {
  @attr() uri;
  @attr() label;

  @hasMany('contact') contacts;
}

import Model, { attr, hasMany } from '@ember-data/model';

export default class ContactListModel extends Model {
  @attr() name;

  @hasMany('contact-item') contactItems;
}

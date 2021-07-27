import Model, { attr, belongsTo } from '@ember-data/model';

export default class ContactItemModel extends Model {
  @attr() fullName;
  @attr() givenName;
  @attr() familyName;
  @attr() organizationName;

  @belongsTo('contact-list') contactList;
}

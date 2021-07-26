import Model, { attr, belongsTo } from '@ember-data/model';

export default class ContactItemModel extends Model {
  @attr() fn;
  @attr() givenName;
  @attr() familyName;
  @attr() organizationName;

  @belongsTo('contact-list') contactList;
}

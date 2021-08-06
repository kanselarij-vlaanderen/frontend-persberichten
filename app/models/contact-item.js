import Model, { attr, belongsTo } from '@ember-data/model';

export default class ContactItemModel extends Model {
  @attr('string') fullName;
  @attr('string') givenName;
  @attr('string') familyName;
  @attr('string') organizationName;

  @belongsTo('contact-list') contactList;

  @belongsTo('telephone') telephone;
  @belongsTo('mail-address') mailAddress;
}

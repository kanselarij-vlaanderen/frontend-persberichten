import Model, { attr /*, belongsTo*/ } from '@ember-data/model';

export default class ContactModel extends Model {
  @attr('string') fullName;
  @attr('string') givenName;
  @attr('string') familyName;
  @attr('string') role;
  @attr('string') contactStatus;
  @attr('date') created;
  @attr('date') modified;
  // @attr "mobile-phone"
}

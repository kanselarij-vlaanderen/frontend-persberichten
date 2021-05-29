import Model, { attr /*, belongsTo*/ } from '@ember-data/model';

export default class ContactModel extends Model {
  @attr() fullName;
  @attr() givenName;
  @attr() familyName;
  @attr() role;
  @attr() contactStatus;
  //to not lose date don't put date type in attr => with hours, minutes and seconds
  @attr() created;
  @attr() modified;
  // @attr "mobile-phone"
}

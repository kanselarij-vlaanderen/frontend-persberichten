import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ContactModel extends Model {
  @attr() uri;
  @attr() fullName;
  @attr() givenName;
  @attr() familyName;
  @attr() role;
  @attr('datetime') created;
  @attr('datetime') modified;

  @belongsTo('contact-status') status;
  @belongsTo('mobile-phone') mobilePhone;
  @belongsTo('telephone') telephone;
  @belongsTo('mail-address') mailAddress;
  @belongsTo('organization') organization;
  @belongsTo('organization') creator;

  @hasMany('press-release') pressReleases;
}

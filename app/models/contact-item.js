import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ContactItemModel extends Model {
  @attr('string') fullName;
  @attr('string') givenName;
  @attr('string') familyName;
  @attr('string') organizationName;
  @attr('datetime') created;
  @attr('datetime') modified;

  @belongsTo('contact-list') contactList;
  @belongsTo('telephone') telephone;
  @belongsTo('mail-address') mailAddress;

  @hasMany('press-release') pressReleases;
  @hasMany('publication-event') publicationEvents;
}

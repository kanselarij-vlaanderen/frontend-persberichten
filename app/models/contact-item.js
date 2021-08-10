import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ContactItemModel extends Model {
  @attr('string') fullName;
  @attr('string') givenName;
  @attr('string') familyName;
  @attr('string') organizationName;

  @belongsTo('contact-list') contactLists;
  @belongsTo('telephone') telephone;
  @belongsTo('mail-address') mailAddress;

  @hasMany('press-release') pressReleases;
  @hasMany('publication-event') publicationEvents;
}

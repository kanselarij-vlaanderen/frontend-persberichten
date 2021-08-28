import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ContactItemModel extends Model {
  @attr('string') givenName;
  @attr('string') familyName;
  @attr('string') organizationName;

  @belongsTo('contact-list') contactList;
  @belongsTo('telephone') telephone;
  @belongsTo('mail-address') mailAddress;

  @hasMany('press-release') pressReleases;
  @hasMany('publication-event') publicationEvents;

  get fullName() {
    return [this.givenName, this.familyName].filter(s => s != null).join(' ');
  }
}

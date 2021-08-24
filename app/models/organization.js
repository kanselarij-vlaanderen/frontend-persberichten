import Model, { attr, hasMany } from '@ember-data/model';

export default class OrganizationModel extends Model {
  @attr('string') uri;
  @attr('string') name;
  @attr('string') identifier;

  @hasMany('contact') contacts;
  @hasMany('contact') sources;
  @hasMany('mobile-phone') mobilePhones;
  @hasMany('telephone') telephones;
  @hasMany('email-address') emailAddresses;
  @hasMany('press-release') pressReleases;
  @hasMany('collaboration-activity', { inverse: 'collaborators' }) collaborations;
  @hasMany('collaboration-activity', { inverse: 'editor' }) editorCollaborations;
}

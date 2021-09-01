import Model, { attr, hasMany } from '@ember-data/model';

export default class OrganizationModel extends Model {
  @attr('string') uri;
  @attr('string') name;
  @attr('string') identifier;

  @hasMany('contact', { inverse: 'organization' }) members;
  @hasMany('contact', { inverse: 'creator' }) contacts;
  @hasMany('mobile-phone') mobilePhones;
  @hasMany('telephone') telephones;
  @hasMany('mail-address') mailAddresses;
  @hasMany('press-release') pressReleases;
  @hasMany('collaboration-activity', { inverse: 'collaborators' }) collaborations;
  @hasMany('collaboration-activity', { inverse: 'editor' }) editorCollaborations;
  @hasMany('approval-activity', { inverse: 'collaborator' }) approvalActivities;
  @hasMany('press-release-activity') pressReleaseActivities;
}

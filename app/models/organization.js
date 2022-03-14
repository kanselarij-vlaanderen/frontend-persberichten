import Model, { attr, hasMany } from '@ember-data/model';

export default class OrganizationModel extends Model {
  @attr('string') uri;
  @attr('string') name;
  @attr('string') shortName;
  @attr('string') identifier;

  @hasMany('contact', { inverse: 'organization' }) members;
  @hasMany('contact', { inverse: 'creator' }) contacts;
  @hasMany('mobile-phone') mobilePhones;
  @hasMany('telephone') telephones;
  @hasMany('mail-address') mailAddresses;
  @hasMany('press-release') pressReleases;
  @hasMany('collaboration-activity') collaborations;
  @hasMany('approval-activity') approvalActivities;
  @hasMany('press-release-activity') pressReleaseActivities;

  get searchLabel() {
    const name = this.shortName || this.name || '';
    if (this.identifier) {
      return `${name} (${this.identifier})`;
    } else {
      return name;
    }
  }
}

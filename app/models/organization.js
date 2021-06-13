import Model, { attr, hasMany } from '@ember-data/model';

export default class OrganizationModel extends Model {
  @attr('string') uri;
  @attr('string') name;
  @attr('string') identifier;

  @hasMany('contact') contacts;
  @hasMany('press-release') pressReleases;
}

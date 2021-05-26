import Model, { attr } from '@ember-data/model';

export default class OrganizationModel extends Model {
  @attr('string') fullName;
  @attr('string') identifier;
  @attr('string') uri;
}

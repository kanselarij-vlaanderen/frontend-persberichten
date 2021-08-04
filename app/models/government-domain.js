import Model, { attr, hasMany } from '@ember-data/model';

export default class GovernmentDomainModel extends Model {
  @attr('string') prefLabel;
  @hasMany('government-field') governmentFields;
}

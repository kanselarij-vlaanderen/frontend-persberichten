import Model, { attr, belongsTo } from '@ember-data/model';

export default class GovernmentDomainModel extends Model {
  @attr('string') prefLabel;
  @belongsTo('government-field') governmentField;
}

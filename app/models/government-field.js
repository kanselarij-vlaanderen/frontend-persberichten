import Model, { attr, belongsTo } from '@ember-data/model';

export default class GovernmentFieldModel extends Model {
  @attr('string') prefLabel;
  @belongsTo('government-domain') domain;
}
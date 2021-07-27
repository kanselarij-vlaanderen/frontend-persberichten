import Model, { attr, hasOne } from '@ember-data/model';

export default class GovernmentFieldModel extends Model {
  @attr('string') prefLabel;
  @hasOne('government-domain') governmentDomain;
}

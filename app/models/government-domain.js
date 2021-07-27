import Model, { attr } from '@ember-data/model';

export default class GovernmentDomainModel extends Model {
  @attr('string') prefLabel;
}

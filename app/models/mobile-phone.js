import Model, { attr, belongsTo } from '@ember-data/model';

export default class MobilePhoneModel extends Model {
  @attr('phone') value;
  @attr() publicationChannel;

  @belongsTo('contact') contact;
}

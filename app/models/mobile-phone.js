import Model, { attr, belongsTo } from '@ember-data/model';

export default class MobilePhoneModel extends Model {
  @attr('phone') value;
  @attr('uri-set') publicationChannels;

  @belongsTo('contact') contact;
}

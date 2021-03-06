import Model, { attr, belongsTo } from '@ember-data/model';

export default class TelephoneModel extends Model {
  @attr('phone') value;
  @attr('uri-set') publicationChannels;

  @belongsTo('organization') creator;
  @belongsTo('contact') contact;
  @belongsTo('contact-item') contactItem;
}

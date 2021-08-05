import Model, { attr, belongsTo } from '@ember-data/model';

export default class MailAddressModel extends Model {
  @attr('email') value;
  @attr('uri-set') publicationChannels;

  @belongsTo('contact') contact;
  @belongsTo('contact-item') contactItem;
}

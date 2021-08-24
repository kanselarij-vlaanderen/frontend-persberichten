import Model, { attr, belongsTo } from '@ember-data/model';

export default class MailAddressModel extends Model {
  @attr('email') value;
  @attr('uri-set') publicationChannels;

  @belongsTo('organization') creator;
  @belongsTo('contact') contact;
  @belongsTo('contact-item') contactItem;
}

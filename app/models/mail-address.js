import Model, { attr, belongsTo } from '@ember-data/model';

export default class MailAddressModel extends Model {
  @attr('email') value;
  @attr() publicationChannel;

  @belongsTo('contact') contact;
}

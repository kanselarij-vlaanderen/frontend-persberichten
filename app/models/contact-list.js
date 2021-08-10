import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class ContactListModel extends Model {
  @attr('string') name;

  @belongsTo('press-release') pressRelease;

  @hasMany('publication-event') publicationEvents;
  @hasMany('contact-item') contactItems;
}

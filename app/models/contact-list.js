import Model, { attr, hasMany } from '@ember-data/model';

export default class ContactListModel extends Model {
  @attr('string') name;
  @attr('datetime') created;
  @attr('datetime') modified;

  @hasMany('press-release') pressReleases;
  @hasMany('publication-event') publicationEvents;
  @hasMany('contact-item') contactItems;
}

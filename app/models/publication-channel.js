import Model, { attr, hasMany } from '@ember-data/model';

export default class PublicationChannelModel extends Model {
  @attr('string') uri;
  @attr('string') name;

  @hasMany('publication-event') publicationEvents;
  @hasMany('press-release') pressReleases;
}

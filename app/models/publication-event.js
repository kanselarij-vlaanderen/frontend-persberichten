import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class PublicationEventModel extends Model {
  @attr('datetime') plannedStartDate;
  @attr('datetime') started;
  @attr('datetime') ended;

  @belongsTo('press-release') pressRelease;

  @hasMany('publication-channel') publicationChannels;
}

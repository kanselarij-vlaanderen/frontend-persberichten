import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class PressReleaseModel extends Model {
  @attr('string') title;
  @attr('string') htmlContent;
  @attr('string') abstract;
  @attr('string-set') keywords;
  @attr('datetime') created;
  @attr('datetime') modified;

  @belongsTo('organization') creator;
  @belongsTo('publication-event') publicationEvent;
  @belongsTo('collaboration-activity') collaboration;

  @hasMany('theme') themes;
  @hasMany('contact') sources;
  @hasMany('file') attachments;
  @hasMany('publication-channel') publicationChannels;
  @hasMany('government-field') governmentFields;
}

import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class PressReleaseModel extends Model {
  @attr('string') title;
  @attr('string') htmlContent;
  @attr('string') abstract;
  @attr('string-set') keyword;
  @attr('datetime') created;
  @attr('datetime') modified;

  @belongsTo('organization') creator;
  @belongsTo('publication-event') publicationEvent;

  @hasMany('theme') themes;
  @hasMany('contact') sources;
  @hasMany('file') attachments;
}

import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class CollaborationActivityModel extends Model {
  @attr('datetime') startDate;

  @belongsTo('press-release') pressRelease;

  @hasMany('approval-activity') approvalActivities;
  @hasMany('organization') collaborators;
}

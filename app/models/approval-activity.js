import Model, { attr, belongsTo } from '@ember-data/model';

export default class ApprovalActivityModel extends Model {
  @attr('datetime') startDate;

  @belongsTo('collaboration-activity') collaborationActivity;
  @belongsTo('organization') collaborator;
}

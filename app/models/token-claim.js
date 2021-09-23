import Model, { attr, belongsTo } from '@ember-data/model';

export default class TokenClaimModel extends Model {
  @attr('datetime') created;

  @belongsTo('collaboration-activity') collaborationActivity;
  @belongsTo('user') user;
}

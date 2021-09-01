import Model, { attr, belongsTo } from '@ember-data/model';

export default class TokenClaimModel extends Model {
  @attr('created') created;

  @belongsTo('collaboration-activity') collaborationActivity;
  @belongsTo('user') user;
}

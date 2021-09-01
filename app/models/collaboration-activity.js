import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class CollaborationActivityModel extends Model {
  @attr('datetime') startDate;

  @belongsTo('organization', { inverse: 'editorCollaborations' }) editor;
  @belongsTo('press-release') pressRelease;

  @hasMany('organization', { inverse: 'collaborations' }) collaborators;
  @hasMany('token-claim') tokenClaims;
}

import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import CONFIG from '../config/constants';

const ACTIVITY_TYPES = CONFIG.PRESS_RELEASE_ACTIVITY;

export default class PressReleaseActivity extends Model {
  @attr('datetime') startDate;
  @attr('string') type;

  @belongsTo('organization', { inverse: 'pressReleaseActivities' }) organization;
  @hasMany('organization', { inverse: 'participations' }) participants;
  @belongsTo('press-release') pressRelease;

  // Note: users are stored per organization graph (except mock-users),
  // hence this relation is not available for users of other organizations
  // and should therefore probably not be used in the frontend
  // @belongsTo('user') creator;

  get isCreationActivity() {
    return this.type == ACTIVITY_TYPES.CREATE;
  }

  get isEditActivity() {
    return this.type == ACTIVITY_TYPES.EDIT;
  }

  get isApprovalActivity() {
    return this.type == ACTIVITY_TYPES.APPROVE;
  }

  get isSharingActivity() {
    return this.type == ACTIVITY_TYPES.SHARE;
  }

  get isUnsharingActivity() {
    return this.type == ACTIVITY_TYPES.UNSHARE;
  }
}

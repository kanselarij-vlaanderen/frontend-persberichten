import Model, { attr, belongsTo } from '@ember-data/model';
import CONFIG from '../config/constants';

const ACTIVITY_TYPES = CONFIG.PRESS_RELEASE_ACTIVITY;

export default class PressReleaseActivity extends Model {
  @attr('datetime') startDate;
  @attr('string') type;

  @belongsTo('organization') organization;
  @belongsTo('press-release') pressRelease;
  @belongsTo('user') creator;

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

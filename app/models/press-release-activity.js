import Model, { attr, belongsTo } from '@ember-data/model';

export default class PressReleaseActivity extends Model {
  @attr('datetime') startDate;
  @attr('string') type;

  @belongsTo('organization') organization;
  @belongsTo('press-release') pressRelease;
  @belongsTo('user') creator;
}

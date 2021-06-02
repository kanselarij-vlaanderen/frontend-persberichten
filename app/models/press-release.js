import Model, { attr, hasMany } from '@ember-data/model';

export default class PressReleaseModel extends Model {
  @attr('string') title;
  @attr('string') htmlContent;
  @attr('string') abstract;
  @attr() created;
  @attr() modiffied;

  @hasMany('theme') theme;
}

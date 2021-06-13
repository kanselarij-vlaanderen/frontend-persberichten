import Model, { attr, hasMany } from '@ember-data/model';

export default class ThemeModel extends Model {
  @attr('string') uri;
  @attr('string') label;

  @hasMany('press-release') pressReleases;
}

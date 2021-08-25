import Model, { attr, hasMany } from '@ember-data/model';

export default class ThemeModel extends Model {
  @attr('string') uri;
  @attr('string') label;
  @attr('boolean') isDeprecated;

  @hasMany('press-release') pressReleases;
}

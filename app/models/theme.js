import Model, { attr } from '@ember-data/model';

export default class ThemeModel extends Model {
  @attr label;
  @attr uuid;
  @attr uri;
}

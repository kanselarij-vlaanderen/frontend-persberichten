import Model, { attr } from '@ember-data/model';

export default class ContactStatusModel extends Model {
  @attr("string") label;
}

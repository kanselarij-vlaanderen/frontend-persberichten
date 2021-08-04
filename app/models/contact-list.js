import Model, { attr, hasMany } from "@ember-data/model";

export default class ContactListModel extends Model {
  @attr("string") name;

  @hasMany("contact-item") contactItems;
}

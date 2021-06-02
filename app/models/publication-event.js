import Model, { attr } from '@ember-data/model';

export default class PublicationEventModel extends Model {
  @attr() publishedStartDateTime;
  @attr() publicationStartDateTime;
  @attr() publicationEndDateTime;
}

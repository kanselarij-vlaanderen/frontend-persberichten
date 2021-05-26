import Model, { attr } from '@ember-data/model';

export default class PublicationChannelModel extends Model {
  @attr('string') publicationChannelName;
}

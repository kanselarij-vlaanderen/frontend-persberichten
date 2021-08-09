import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { isPresent } from '@ember/utils';

export default class PublicationEventModel extends Model {
  @attr('datetime') plannedStartDate;
  @attr('datetime') started;
  @attr('datetime') ended;

  @belongsTo('press-release') pressRelease;

  @hasMany('publication-channel') publicationChannels;

  get isPublished() {
    return isPresent(this.plannedStartDate) && this.plannedStartDate < new Date();
  }

  get isPlanned() {
    return isPresent(this.plannedStartDate) && this.plannedStartDate > new Date();
  }
}

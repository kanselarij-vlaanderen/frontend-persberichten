import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class InputFieldPressReleasePublicationChannelsComponent extends Component {
  @service store;

  @tracked publicationChannels = [];
  @tracked mediums = [];

  constructor() {
    super(...arguments);
    this.loadPublicationChannels.perform();
  }

  @task
  *loadPublicationChannels() {
    this.publicationChannels = yield this.store.query('publication-channel', {
      'page[size]': 100,
      // sort: 'name'
    });
    this.publicationChannels = this.publicationChannels.filter(publicationChannel => publicationChannel.uri !== "http://themis.vlaanderen.be/id/publicatiekanaal/c184f026-feaa-4899-ba06-fd3a03df599c");
    this.publicationChannels.forEach(a=>console.log(a));
  }
  @action
  togglePublicationChannel(channel, medium) {

    console.log(channel);
    console.log(medium);
    // if (!medium.publicationChannels) {
    //   medium.publicationChannels = [];
    // }
    // const index = medium.publicationChannels.indexOf(channel.uri);
    // if (index > -1) {
    //   medium.publicationChannels.splice(index, 1); // remove publication-channel
    // } else {
    //   medium.publicationChannels.pushObject(channel.uri);
    // }
  }
}

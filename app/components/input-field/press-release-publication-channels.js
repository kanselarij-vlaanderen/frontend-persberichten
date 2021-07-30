import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import constants from '../../config/constants';

export default class InputFieldPressReleasePublicationChannelsComponent extends Component {
  @service store;

  @tracked publicationChannels = [];
  @tracked pressReleasePublicationChannels = [];
  constructor() {
    super(...arguments);
    this.loadPublicationChannels.perform();
    this.loadData.perform();
  }

  @task
  *loadData() {
    this.pressReleasePublicationChannels = yield this.args.pressRelease.publicationChannels;
  }

  @task
  *loadPublicationChannels() {
    this.publicationChannels = yield this.store.query('publication-channel', {
      'page[size]': 100,
      // sort: 'name'
    });

    this.publicationChannels = this.publicationChannels.filter(publicationChannel => {
      return publicationChannel.uri !== constants.PUBLICATION_CHANNEL_URI;
    });
  }
  @action
  async togglePublicationChannel(channel) {
    const index = this.pressReleasePublicationChannels.indexOf(channel);
    if (index > -1) {
      this.pressReleasePublicationChannels.removeObject(channel); // remove publication-channel
    } else {
      this.pressReleasePublicationChannels.addObject(channel);
    }
  }
}

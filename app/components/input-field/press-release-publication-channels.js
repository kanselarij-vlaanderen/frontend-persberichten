import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import CONFIG from '../../config/constants';

export default class InputFieldPressReleasePublicationChannelsComponent extends Component {
  @service store;

  @tracked publicationChannels = [];
  @tracked selectedPublicationChannels = [];
  
  constructor() {
    super(...arguments);
    this.loadPublicationChannels.perform();
    this.loadSelectedPublicationChannels.perform();
  }

  @task
  *loadSelectedPublicationChannels() {
    this.selectedPublicationChannels = yield this.args.pressRelease.publicationChannels;
  }

  @task
  *loadPublicationChannels() {
    let publicationChannels = yield this.store.query('publication-channel', {
      'page[size]': 100,
      sort: 'name'
    });

    this.publicationChannels = publicationChannels.filter(publicationChannel => {
      return publicationChannel.uri !== CONFIG.MAILING_LIST.PUBLICATION_CHANNEL;
    });
  }

  @action
  togglePublicationChannel(channel) {
    const index = this.selectedPublicationChannels.indexOf(channel);
    if (index > -1) {
      this.selectedPublicationChannels.removeObject(channel);
    } else {
      this.selectedPublicationChannels.addObject(channel);
    }
  }
}

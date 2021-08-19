import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import CONFIG from '../../config/constants';

export default class InputFieldPressReleasePublicationChannelsComponent extends Component {
  @service store;

  @tracked publicationChannels = [];
  @tracked subscribersFlandersBe;
  @tracked disableFlandersBeChannel;

  constructor() {
    super(...arguments);
    this.loadPublicationChannelsAndInit.perform();
  }

  @task
  *loadPublicationChannelsAndInit() {
    let publicationChannels = yield this.store.query('publication-channel', {
      'page[size]': 100,
      sort: 'name'
    });

    this.publicationChannels = publicationChannels.filter(publicationChannel => {
      return publicationChannel.uri !== CONFIG.PUBLICATION_CHANNEL.MAILING_LIST;
    });
    this.subscribersFlandersBe = this.publicationChannels.find(channel => channel.uri === CONFIG.PUBLICATION_CHANNEL.SUBSCRIBERS_FLANDERS_BE);
    this.disableFlandersBeChannel = this.setDisableFlandersBeChannel(this.args.publicationChannels);
  }

  setDisableFlandersBeChannel(selectedChannels) {
    if (selectedChannels.length > 1 && selectedChannels.includes(this.subscribersFlandersBe)) {
      return true;
    }
    return false;
  }

  @action
  getSelectedPublicationChannels(publicationChannel) {
    const selectedPublicationChannels = this.args.publicationChannels.slice(0);
    const index = selectedPublicationChannels.indexOf(publicationChannel);
    if (index > -1) {
      selectedPublicationChannels.removeObject(publicationChannel);
    } else {
      selectedPublicationChannels.addObject(publicationChannel);
    }
    if (selectedPublicationChannels.length && !selectedPublicationChannels.includes(this.subscribersFlandersBe)) {
      selectedPublicationChannels.addObject(this.subscribersFlandersBe)
    }
    this.disableFlandersBeChannel = this.setDisableFlandersBeChannel(selectedPublicationChannels);
    this.args.onChange(selectedPublicationChannels);
  }
}

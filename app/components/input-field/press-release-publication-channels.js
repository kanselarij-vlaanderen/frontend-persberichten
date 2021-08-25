import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import CONFIG from '../../config/constants';

export default class InputFieldPressReleasePublicationChannelsComponent extends Component {
  @service store;

  @tracked publicationChannels = [];
  @tracked websiteFlandersBe;

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
    this.websiteFlandersBe = this.publicationChannels.find(channel => channel.uri === CONFIG.PUBLICATION_CHANNEL.WEBSITE_FLANDERS_BE);
  }

  @action
  updateSelectedPublicationChannels(publicationChannel) {
    const selectedPublicationChannels = this.args.publicationChannels.slice(0);
    const index = selectedPublicationChannels.indexOf(publicationChannel);
    if (index > -1) {
      selectedPublicationChannels.removeObject(publicationChannel);
    } else {
      selectedPublicationChannels.addObject(publicationChannel);
    }

    // if any publication-channel is selected, website Flanders publication-channel must be automatically added
    if (selectedPublicationChannels.length && !selectedPublicationChannels.includes(this.websiteFlandersBe)) {
      selectedPublicationChannels.addObject(this.websiteFlandersBe);
    }
    this.args.onChange(selectedPublicationChannels);
  }

  get isDisabledWebsiteFlandersBeChannel() {
    const selectedPublicationChannels = this.args.publicationChannels;

    // checks if websiteFlandersBe AND any other channel is selected, to be able to disable checkbox
    return (selectedPublicationChannels.length > 1 && selectedPublicationChannels.includes(this.websiteFlandersBe));
  }
}

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
  @tracked subscribersFlandersBe;
  @tracked belga;

  constructor() {
    super(...arguments);
    this.loadPublicationChannelsAndInit.perform();
  }

  @task
  *loadPublicationChannelsAndInit() {
    const publicationChannels = yield this.store.query('publication-channel', {
      'page[size]': 100,
      sort: 'name'
    });

    const { BELGA, SUBSCRIBERS_FLANDERS_BE, WEBSITE_FLANDERS_BE, MAILING_LIST } = CONFIG.PUBLICATION_CHANNEL;
    this.belga = publicationChannels.find(channel => channel.uri === BELGA);
    this.subscribersFlandersBe = publicationChannels.find(channel => channel.uri === SUBSCRIBERS_FLANDERS_BE);
    this.websiteFlandersBe = this.publicationChannels.find(channel => channel.uri === WEBSITE_FLANDERS_BE);

    this.publicationChannels = publicationChannels.filter(channel => channel.uri !== MAILING_LIST);
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
    if ((selectedPublicationChannels.includes(this.belga) || selectedPublicationChannels.includes(this.subscribersFlandersBe))
        && !selectedPublicationChannels.includes(this.websiteFlandersBe)) {
      selectedPublicationChannels.addObject(this.websiteFlandersBe);
    }
    this.args.onChange(selectedPublicationChannels);
  }

  get isDisabledWebsiteFlandersBeChannel() {
    const selectedPublicationChannels = this.args.publicationChannels;

    // checks if websiteFlandersBe AND any other channel is selected, to be able to disable checkbox
    return (selectedPublicationChannels.length > 1
            && selectedPublicationChannels.includes(this.websiteFlandersBe)
            && (selectedPublicationChannels.includes(this.belga) || selectedPublicationChannels.includes(this.subscribersFlandersBe)));
  }
}

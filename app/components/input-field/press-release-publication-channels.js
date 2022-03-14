import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
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
    this.websiteFlandersBe = publicationChannels.find(channel => channel.uri === WEBSITE_FLANDERS_BE);

    this.publicationChannels = publicationChannels.filter(channel => channel.uri !== MAILING_LIST);
  }

  @action
  updateSelectedPublicationChannels(publicationChannel) {
    const selection = this.args.publicationChannels.slice(0);
    const index = selection.indexOf(publicationChannel);
    if (index > -1) {
      selection.removeObject(publicationChannel);
    } else {
      selection.addObject(publicationChannel);
    }

    // if Belga or Subscribers Flanders is selected, Website Flanders must be automatically added
    if ((selection.includes(this.belga) || selection.includes(this.subscribersFlandersBe))
        && !selection.includes(this.websiteFlandersBe)) {
      selection.addObject(this.websiteFlandersBe);
    }

    this.args.onChange(selection);
  }

  // Checks whether one of Belga or Subscribers Flanders is selected together with Website Flanders.
  // In that case Website Flanders publication channel might not be deselected.
  get isDisabledWebsiteFlandersBeChannel() {
    const selection = this.args.publicationChannels;
    return (selection.includes(this.belga) || selection.includes(this.subscribersFlandersBe))
      && selection.includes(this.websiteFlandersBe);
  }
}

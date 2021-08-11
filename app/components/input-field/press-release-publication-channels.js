import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import CONFIG from '../../config/constants';

export default class InputFieldPressReleasePublicationChannelsComponent extends Component {
  @service store;

  @tracked publicationChannels = [];

  constructor() {
    super(...arguments);
    this.loadPublicationChannels.perform();
  }

  @task
  *loadPublicationChannels() {
    let publicationChannels = yield this.store.query('publication-channel', {
      'page[size]': 100,
      sort: 'name'
    });

    this.publicationChannels = publicationChannels.filter(publicationChannel => {
      return publicationChannel.uri !== CONFIG.PUBLICATION_CHANNEL.MAILING_LIST;
    });
  }

  @action
  getSelectedPublicationChannels(publicationChannel) {
    const selectedPublicationChannels = this.args.publicationChannels;
    const index = selectedPublicationChannels.indexOf(publicationChannel);
    if (index > -1) {
      selectedPublicationChannels.removeObject(publicationChannel);
    } else {
      selectedPublicationChannels.addObject(publicationChannel);
    }
    this.args.onChange(selectedPublicationChannels);
  }
}

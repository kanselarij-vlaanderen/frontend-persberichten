import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class InputFieldSourceInfoPublicationChannelsComponent extends Component {
  @service store;

  @tracked publicationChannels = [];
  @tracked mediums = [];

  constructor() {
    super(...arguments);
    this.loadPublicationChannels.perform();
    console.log(this.args.telephone);
    this.mediums = [
      { label: 'telefoonnummer', value: this.args.telephone },
      { label: 'mobiel nummer', value: this.args.mobilePhone },
      { label: 'e-mailadres', value: this.args.mailAddress }
    ];
  }

  @task
  *loadPublicationChannels() {
    this.publicationChannels = yield this.store.query('publication-channel', {
      'page[size]': 100,
      sort: 'name'
    });
  }

  @action
  togglePublicationChannel(channel, medium) {
    if (!medium.publicationChannels) {
      medium.publicationChannels = [];
    }
    const index = medium.publicationChannels.indexOf(channel.uri);
    if (index > -1) {
      medium.publicationChannels.splice(index, 1); // remove publication-channel
    } else {
      medium.publicationChannels.pushObject(channel.uri);
    }
  }
}

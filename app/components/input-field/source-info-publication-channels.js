import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class InputFieldSourceInfoPublicationChannelsComponent extends Component {
  @service store;

  @tracked _publicationChannels = [];
  // [
  //   {name:'Belga', telefoon: false, mobiel: false, email: true},
  //   {name:'Vlaanderen.be', telefoon: false, mobiel: false, email: true},
  //   {name:'Abbonnees Vlaanderen.be', telefoon: false, mobiel: false, email: true},
  //   {name:'Eigen verzendlijsten', telefoon: false, mobiel: false, email: true}
  // ]

  @tracked publicationChannelsCopy = this._publicationChannels.map(
    (channel) => {
      return { ...channel };
    }
  );

  @action
  changePublicationChannels(channelProperty, index, parentCallback) {
    this.publicationChannelsCopy[index][channelProperty] = !this
      .publicationChannelsCopy[index][channelProperty];
    parentCallback('publicatiekanalen', this.publicationChannelsCopy);
  }

  @action
  async onPublicationChannelsRender(existingSourceChannel) {
    //existingSourceChannel if exsists takes this object, otherwise loads from backend

    if (existingSourceChannel) {
      this._publicationChannels = existingSourceChannel;
    } else {
      let newPublicationChannels = [];
      const publicationChannels = await this.store.findAll(
        'publication-channel'
      );
      publicationChannels.forEach((resp) =>
        newPublicationChannels.push({
          name: resp.publicationChannelName,
          telefoon: false,
          mobiel: false,
          email: false,
        })
      );
      newPublicationChannels.sort((a, b) => (a.name > b.name ? 1 : -1));
      this._publicationChannels = newPublicationChannels;
    }
  }

  get publicationChannels() {
    return this._publicationChannels;
  }
}

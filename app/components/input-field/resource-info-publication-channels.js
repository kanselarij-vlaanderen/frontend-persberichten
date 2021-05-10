import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class InputFieldResourceInfoPublicationChannelsComponent extends Component {
  @tracked publicationChannels = [
    {name:'Belga', telefoon: false, mobiel: false, email: true},
    {name:'Vlaanderen.be', telefoon: false, mobiel: false, email: true},
    {name:'Abbonnees Vlaanderen.be', telefoon: false, mobiel: false, email: true},
    {name:'Eigen verzendlijsten', telefoon: false, mobiel: false, email: true}
  ]

  publicationChannelsCopy = this.publicationChannels.map(channel => {return {...channel}});

  @action
  changePublicationChannels(channelProperty, index, parentCallback) {
    this.publicationChannelsCopy[index][channelProperty] = !this.publicationChannelsCopy[index][channelProperty];
    parentCallback(this.publicationChannelsCopy);
  }
}

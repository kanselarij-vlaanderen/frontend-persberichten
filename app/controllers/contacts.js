import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class ContactsController extends Controller {
  @tracked publicationChannels = [
    {name:'belga', telefoon: false, mobiel: false, email: true},
    {name:'Vlaanderen.be', telefoon: false, mobiel: false, email: true},
    {name:'Abonees Vlaanderen.be', telefoon: false, mobiel: false, email: true},
    {name:'eigen verzendlijsten', telefoon: false, mobiel: false, email: true}
  ]
}

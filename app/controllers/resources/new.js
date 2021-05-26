import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ResourcesNewController extends Controller {
  @service router;
  @service store;

  // newResource = {
  //   "contact-status": 'actief',
  //   "given-name": "Edo",
  //   "family-name": "Tsatourov",
  //   role: 'woordvoerder',
  //   organization: 'kabinet Edo',
  //   telephone: "0325465421",
  //   "mobile-phone": "0413215464",
  //   "mail-address": "edo@gov.be",
  //   publicatiekanalen: [
  //       {name:'Belga', telefoon: false, mobiel: false, email: true},
  //       {name:'Vlaanderen.be', telefoon: false, mobiel: false, email: true},
  //       {name:'Abbonnees Vlaanderen.be', telefoon: false, mobiel: false, email: true},
  //       {name:'Eigen verzendlijsten', telefoon: false, mobiel: false, email: true}
  //     ]
  // };

  @action
  navigateToResource() {
    this.router.transitionTo('resources.active');
  }

  @action
  onPublicationChannelChange(publicationChannels) {
    // update resource object with publicationChannels here
    console.log(publicationChannels);
  }

  @action
  async createResource() {
    // first create nested rels
    // const phone = await this.store.createRecord('mobile-phone', {
    //   number: '0404432132144',
    // });
    const contact = await this.store.createRecord('contact', {
      givenName: 'Edo',
      familyName: 'Tsatourov',
      role: 'admin',
      contactStatus: 'actief',
      created: new Date(),
      modified: new Date(),
    });

    console.log(contact);
    try {
      const resp = await contact.save();
      console.log('from resp');
      console.log(resp);
    } catch (err) {
      console.log(err);
    }

    let contacts = await this.store.findAll('contact');
    contacts.forEach((a) => console.log(a));
    console.log('creating resource');
  }
}

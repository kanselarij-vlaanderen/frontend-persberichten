import Controller from '@ember/controller';
import {action} from '@ember/object';
export default class ContactsController extends Controller {

  @action
  onPublicationChannelChange(publicationChannels) {
    console.log("here")
    console.log(publicationChannels)
  }
}

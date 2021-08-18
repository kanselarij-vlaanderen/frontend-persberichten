import ApplicationSerializer from './application';

export default class PublicationEventSerializer extends ApplicationSerializer {
  shouldSerializeHasMany(snapshot, key/*, relationshipType*/) {
    debugger
    if (key == 'publicationChannels') {

      return true;
    }
    else
      return super.shouldSerializeHasMany(...arguments);
  }
}

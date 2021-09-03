import ApplicationSerializer from './application';

export default class PressReleaseSerializer extends ApplicationSerializer {
  shouldSerializeHasMany(snapshot, key/*, relationshipType*/) {
    if (key == 'publicationChannels'
     || key == 'sources'
     || key == 'attachments'
     || key == 'contactLists')
      return true;
    else
      return super.shouldSerializeHasMany(...arguments);
  }
}

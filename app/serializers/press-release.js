import ApplicationSerializer from './application';

export default class PressReleaseSerializer extends ApplicationSerializer {  shouldSerializeHasMany(snapshot, key/*, relationshipType*/) {
  if (key == 'publicationChannels')
    return true;
  else
    return super.shouldSerializeHasMany(...arguments);
}
}

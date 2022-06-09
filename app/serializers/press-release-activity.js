import ApplicationSerializer from './application';

export default class PressReleaseActivitySerializer extends ApplicationSerializer {
  shouldSerializeHasMany(snapshot, key/*, relationshipType*/) {
    if (key == 'participants') {
      return true;
    }
    else
      return super.shouldSerializeHasMany(...arguments);
  }
}

import ApplicationSerializer from './application';

export default class ContactListSerializer extends ApplicationSerializer {
  shouldSerializeHasMany(snapshot, key/*, relationshipType*/) {
    if (key == 'contactItems')
      return true;
    else
      return super.shouldSerializeHasMany(...arguments);
  }
}

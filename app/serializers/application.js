import JSONAPISerializer from '@ember-data/serializer/json-api';
import DS from 'ember-data';
import DataTableSerializerMixin from 'ember-data-table/mixins/serializer';

export class ApplicationSerializer extends JSONAPISerializer {
  serialize() {
    const payload = super.serialize(...arguments);
    if (payload && payload.data && payload.data.attributes) {
      delete payload.data.attributes.uri;
    }
    return payload;
  }
}

export default DS.JSONAPISerializer.extend(DataTableSerializerMixin, {

});

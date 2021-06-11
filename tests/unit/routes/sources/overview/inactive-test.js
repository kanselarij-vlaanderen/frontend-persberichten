import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | sources/overview/inactive', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:sources/overview/inactive');
    assert.ok(route);
  });
});

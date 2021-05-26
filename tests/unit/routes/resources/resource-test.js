import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | resources/resource', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:resources/resource');
    assert.ok(route);
  });
});

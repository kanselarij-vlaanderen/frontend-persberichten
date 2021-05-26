import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | resources/active', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:resources/active');
    assert.ok(route);
  });
});

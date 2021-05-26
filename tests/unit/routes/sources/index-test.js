import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | sources/index', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:sources/index');
    assert.ok(route);
  });
});

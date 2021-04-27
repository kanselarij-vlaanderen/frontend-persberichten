import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | press-releases/index', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:press-releases/index');
    assert.ok(route);
  });
});

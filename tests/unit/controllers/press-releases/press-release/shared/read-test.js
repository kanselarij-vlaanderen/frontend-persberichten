import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | press-releases/press-release/shared/read', function(hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:press-releases/press-release/shared/read');
    assert.ok(controller);
  });
});

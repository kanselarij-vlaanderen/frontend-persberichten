import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | press-releases/overview/planned', function(hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:press-releases/overview/planned');
    assert.ok(controller);
  });
});

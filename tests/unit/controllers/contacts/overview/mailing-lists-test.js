import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | contacts/overview/mailing-lists', function(hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:contacts/overview/mailing-lists');
    assert.ok(controller);
  });
});
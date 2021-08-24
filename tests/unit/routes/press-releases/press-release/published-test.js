import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | press-releases/press-release/published', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:press-releases/press-release/published');
    assert.ok(route);
  });
});

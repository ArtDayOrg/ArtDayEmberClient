import {
  lastItem
}
from '../../../helpers/last-item';
import {
  module, test
}
from 'qunit';

module('Unit | Helper | last item');

// Replace this with your real tests.
test('it works', function(assert) {
  assert.expect(2);
  var result = lastItem(41, 42);
  assert.ok(result);
  result = lastItem(0, 12);
  assert.notOk(result);
});
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
    var input = [41, 42];
    var result = lastItem(input);
    assert.ok(result);

    var input2 = [0, 12];
    result = lastItem(input2);
    assert.notOk(result);
});
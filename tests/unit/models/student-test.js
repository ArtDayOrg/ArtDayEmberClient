import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('student', {
  // Specify the other units that are required for this test.
  needs: ['model:preference', 'model:enrollment']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});

import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('preference', {
  // Specify the other units that are required for this test.
  needs: ['model:session-id', 'model:student-id']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});

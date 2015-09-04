import { moduleForModel, test } from 'ember-qunit';

moduleForModel('enrollment', 'Unit | Model | enrollment', {
  // Specify the other units that are required for this test.
  needs: ['model:student', 'model:session']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});

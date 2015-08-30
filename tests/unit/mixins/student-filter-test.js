import Ember from 'ember';
import StudentFilterMixin from '../../../mixins/student-filter';
import { module, test } from 'qunit';

module('Unit | Mixin | student filter');

// Replace this with your real tests.
test('it works', function(assert) {
  var StudentFilterObject = Ember.Object.extend(StudentFilterMixin);
  var subject = StudentFilterObject.create();
  assert.ok(subject);
});

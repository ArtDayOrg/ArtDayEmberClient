import Ember from 'ember';
import StudentScheduleMixin from '../../../mixins/student-schedule';
import { module, test } from 'qunit';

module('Unit | Mixin | student schedule');

// Replace this with your real tests.
test('it works', function(assert) {
  var StudentScheduleObject = Ember.Object.extend(StudentScheduleMixin);
  var subject = StudentScheduleObject.create();
  assert.ok(subject);
});

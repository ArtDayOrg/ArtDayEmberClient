import Ember from 'ember';
import AdminControllerHooksMixin from '../../../mixins/admin-controller-hooks';
import { module, test } from 'qunit';

module('Unit | Mixin | admin controller hooks');

// Replace this with your real tests.
test('it works', function(assert) {
  var AdminControllerHooksObject = Ember.Object.extend(AdminControllerHooksMixin);
  var subject = AdminControllerHooksObject.create();
  assert.ok(subject);
});

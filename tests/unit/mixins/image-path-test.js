import Ember from 'ember';
import ImagePathMixin from '../../../mixins/image-path';
import { module, test } from 'qunit';

module('Unit | Mixin | image path');

// Replace this with your real tests.
test('it works', function(assert) {
  var ImagePathObject = Ember.Object.extend(ImagePathMixin);
  var subject = ImagePathObject.create();
  assert.ok(subject);
});

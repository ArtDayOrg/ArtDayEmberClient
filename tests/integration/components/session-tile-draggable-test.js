import {
  moduleForComponent, test
}
from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('session-tile-draggable', 'Integration | Component | session tile draggable', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs `{{session-tile-draggable}}`);

  assert.equal(this.$().text().trim(), '');
});
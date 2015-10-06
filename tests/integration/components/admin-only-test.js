import {
  moduleForComponent, test
}
from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('admin-only', 'Integration | Component | admin only', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs `{{admin-only}}`);

  assert.equal(this.$().text().trim(), 'You are not an authorized admin!  Please login.');

  // Template block usage:
  this.render(hbs `
    {{#admin-only isAdmin=isAdmin}}
      template block text
    {{/admin-only}}
  `);

  this.set('isAdmin', true);

  assert.equal(this.$().text().trim(), 'template block text');
});
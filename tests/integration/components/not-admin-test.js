import {
  moduleForComponent, test
}
from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('not-admin', 'Integration | Component | not admin', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs `{{not-admin}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs `
    {{#not-admin}}
      template block text
    {{/not-admin}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
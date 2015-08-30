import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('available-sessions-mosaic', 'Integration | Component | available sessions mosaic', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{available-sessions-mosaic}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#available-sessions-mosaic}}
      template block text
    {{/available-sessions-mosaic}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('locked-pref-tile', 'Integration | Component | locked pref tile', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{locked-pref-tile}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#locked-pref-tile}}
      template block text
    {{/locked-pref-tile}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

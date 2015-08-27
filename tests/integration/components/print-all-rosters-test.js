import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('print-all-rosters', 'Integration | Component | print all rosters', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{print-all-rosters}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#print-all-rosters}}
      template block text
    {{/print-all-rosters}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

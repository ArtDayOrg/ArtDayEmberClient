import {
    moduleForComponent, test
}
from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('admin-instructions', 'Integration | Component | admin instructions', {
    integration: true
});

test('it renders', function(assert) {
    assert.expect(1);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs `{{admin-instructions}}`);

    assert.ok(this.$().text().trim().startsWith('Manage your activity day in 4 simple steps'), 'Admin instructions diplayed');
});
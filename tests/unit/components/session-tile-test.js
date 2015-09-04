import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('session-tile', 'Integration | Component | session tile', {
});

test('session tile displays correctly', function(assert) {
  assert.expect(2);

  var component = this.subject();

  var item = {
    sessionName: 'test session name',
    id: 1
  };

  Ember.run(function() {
    component.set('item', item);
  });

  assert.equal(this.$().find('#session-tile-name').text().trim(), 'test session name', 'name displays correctly');
  assert.equal(this.$().find('#session-tile-img').attr('src'), 'assets/images/1.png', 'image url produced correctly');
});

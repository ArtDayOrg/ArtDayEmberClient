import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('session-tile', 'Integration | Component | session tile', {
  integration: true
});

test('session-tile renders, handles action and responds to changes', function(assert) {

  assert.expect(8);

  var sessionName1 = 'session name 1';
  var sessionName2 = 'session name 2';
  var description1 = 'description 1';
  var description2 = 'description 2';
  
  var item = {
    sessionName: sessionName1,
    id: 1,
    description: description1
  };
  
  var otherItem = {
    sessionName: sessionName2,
    id: 2,
    description: description2
  };
  this.set('item', item);

  this.render(hbs`{{session-tile item=item changeDescription='outer action'}}`);

  assert.equal(this.$().find('#name').text().trim(), sessionName1, 'session name renders');
  assert.equal(this.$().find('#imageUrl').attr('src'), 'assets/images/1.png', 'image path ok');
  
  this.on('outer action', function (description, sessionName) {
    assert.equal(description, description1, 'session-tile action sends description');
    assert.equal(sessionName, sessionName1, 'session-tile action sends session name');
  });
  
  $('.session-tile').click();

  this.set('item', otherItem);

  assert.equal(this.$().find('#name').text().trim(), sessionName2, 'session name responds to changes');
  assert.equal(this.$().find('#imageUrl').attr('src'), 'assets/images/2.png', 'image path responds to changes');
  
  this.on('outer action', function (description, sessionName) {
    assert.equal(description, description2, 'session-tile action changes description');
    assert.equal(sessionName, sessionName2, 'session-tile action changes session name');
  });

  $('.session-tile').click();

});

import {
  moduleForComponent, test
}
from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('session-tile', 'Integration | Component | session tile', {
  integration: true
});


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

test('before/after displays ok', function(assert) {

  assert.expect(4);


  this.set('item', item);
  this.render(hbs `{{session-tile item=item}}`);

  assert.equal(this.$().find('#name').text().trim(), sessionName1, 'session name ok');
  assert.equal(this.$().find('.image').attr('src'), 'http://artday.blob.core.windows.net/images/1.png', 'image path ok');

  this.set('item', otherItem);

  assert.equal(this.$().find('#name').text().trim(), sessionName2, 'session name updates');
  assert.equal(this.$().find('.image').attr('src'), 'http://artday.blob.core.windows.net/images/2.png', 'image path updates');

});


test('before/after renders action ok', function(assert) {

  assert.expect(4);

  this.set('item', item);

  this.render(hbs `{{session-tile item=item changeDescription="outer action"}}`);

  this.on('outer action', function(description, sessionName) {
    assert.equal(description, description1, 'session-tile action sends description');
    assert.equal(sessionName, sessionName1, 'session-tile action sends session name');
  });

  $('.session-tile').click();

  this.set('item', otherItem);

  this.on('outer action', function(description, sessionName) {
    assert.equal(description, description2, 'session-tile action changes description');
    assert.equal(sessionName, sessionName2, 'session-tile action changes session name');
  });

  $('.session-tile').click();
});
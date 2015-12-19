import {
  moduleForComponent, test
}
from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pref-tile', 'Integration | Component | pref tile', {
  integration: true
});



var item = {
  session: {
    sessionName: 'name 1',
    id: 1,
    description: 'description 1'
  },
  rank: 1,
  student: {
    firstName: 'first 1',
    lastName: 'last 1',
    grade: 6
  }
};

var otherItem = {
  session: {
    sessionName: 'name 2',
    id: 2,
    description: 'description 2'
  },
  rank: 2,
  student: {
    firstName: 'first 2',
    lastName: 'last 2',
    grade: 7
  }
};

test('renders as session ok', function(assert) {
  assert.expect(4);

  this.set('item', item);
  this.set('index', 0);

  this.render(hbs `{{pref-tile item=item index=index}}`);
  // <img class="image" draggable="false" align="middle" src="http://artday.blob.core.windows.net/images/1.png">
  assert.equal(this.$().find('#name1').text().trim(), 'name 1', 'session name ok');
  assert.equal(this.$().find('.image').attr('src'), 'http://artday.blob.core.windows.net/images/1.png', 'image path ok');

  this.set('item', otherItem);
  this.set('index', 5);

  assert.equal(this.$().find('#name6').text().trim(), 'name 2', 'session name updates');
  assert.equal(this.$().find('.image').attr('src'), 'http://artday.blob.core.windows.net/images/2.png', 'image path updates');
});

//test drag and drop in student-preferences-row

test('renders as null ok', function(assert) {

  assert.expect(4);

  this.set('item', null);
  this.set('index', 3);

  this.render(hbs `{{pref-tile item=item index=index}}`);

  assert.equal(this.$().find('#rank4').text().trim(), '4', 'null renders as pref drop target with rank');

  this.set('index', 5);
  assert.equal(this.$().find('#rank6').text().trim(), '6', 'rank updates');

  this.set('item', item);

  assert.equal(this.$().find('#name6').text().trim(), 'name 1', 'session name ok after update from null');
  assert.equal(this.$().find('.image').attr('src'), 'http://artday.blob.core.windows.net/images/1.png', 'image path ok after update from null');
});
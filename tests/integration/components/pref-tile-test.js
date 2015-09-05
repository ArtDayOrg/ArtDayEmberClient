import { moduleForComponent, test } from 'ember-qunit';
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
  this.set('index', 1);

  this.render(hbs`{{pref-tile item=item index=index}}`);

  assert.equal(this.$().find('#name').text().trim(), 'name 1', 'session name renders');
  assert.equal(this.$().find('#imageUrl').attr('src'), 'assets/images/1.png', 'image path ok');

  this.set('item', otherItem);
  this.set('index', 5);

  assert.equal(this.$().find('#name').text().trim(), 'name 2', 'session name renders');
  assert.equal(this.$().find('#imageUrl').attr('src'), 'assets/images/2.png', 'image path ok');
});

//test drag and drop in student-preferences-row

test('renders as null ok', function(assert) {
  
  assert.expect(2);

  this.set('item', null);
  this.set('index', 3);

  this.render(hbs`{{pref-tile item=item index=index}}`);

  assert.equal(this.$().find('#rank').text().trim(), '4', 'null renders as pref drop target with rank');

  this.set('index', 5);
  assert.equal(this.$().find('#rank').text().trim(), '6', 'rank responds to change');

});

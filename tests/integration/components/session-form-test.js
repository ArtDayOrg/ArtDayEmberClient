// session-form tests

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('session-form', 'Integration | Component | session form', {
  integration: true
});

test('fields show up in form when model populated', function(assert) {

  assert.expect(6);

  var model = {
    sessionName: 'session name test',
    capacity: 55,
    instructorName: 'instructor name test',
    location: 'location test',
    description: 'description test',
    instructions: 'instruction test'
  }
    
  this.set('model', model);

  this.render(hbs`{{session-form item=model}}`);

  assert.equal(this.$().find('#session-name-input').val(), model.sessionName, 'session name populated');
  assert.equal(this.$().find('#capacity-input').val(), model.capacity, 'capacity populated');
  assert.equal(this.$().find('#instructor-input').val(), model.instructorName, 'instructor name populated');
  assert.equal(this.$().find('#location-input').val(), model.location, 'location populated');
  assert.equal(this.$().find('#description-input').val(), model.description, 'description populated');
  assert.equal(this.$().find('#instructions-input').val(), model.instructions, 'instructions populated');

});


test('fields do not show up in form when model empty', function(assert) {
  assert.expect(6);

  var model = {
  }
  
  this.set('model', model);

  this.render(hbs`{{session-form item=model}}`);

  assert.equal(this.$().find('#session-name-input').val(), '', 'session name empty');
  assert.equal(this.$().find('#capacity-input').val(), '', 'capacity empty');
  assert.equal(this.$().find('#instructor-input').val(), '', 'instructor name empty');
  assert.equal(this.$().find('#location-input').val(), '', 'location empty');
  assert.equal(this.$().find('#description-input').val(), '', 'description empty');
  assert.equal(this.$().find('#instructions-input').val(), '', 'instructions empty');
});
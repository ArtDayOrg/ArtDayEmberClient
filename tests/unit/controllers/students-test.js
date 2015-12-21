import {
  moduleFor
}
from 'ember-qunit';
import test from '../../ember-sinon-qunit/test';
import Ember from 'ember';

moduleFor('controller:students', {
  needs: ['model:student', 'model:preference', 'model:enrollment']
});

test('verify processKeyUp sets search filter', function(assert) {
  var controller = this.subject();
  assert.expect(1);

  controller.send('processKeyUp', 'someValue');
  var searchString = controller.get('searchFilter');
  assert.ok(searchString === 'someValue', 'search string check');
});

test('verify unlock method unlocks student', function(assert) {
  var controller = this.subject();
  assert.expect(2);

  var student = null;

  Ember.run(function() {
    student = controller.store.createRecord('student', {
      firstName: 'Joe',
      lastName: 'Forsmann',
      grade: 6,
      locked: true,
      save: function() {
        return true;
      }
    });
  });

  assert.ok(student.get('locked') === true, 'student starts out locked.');

  // might need to mock student.save()  
  Ember.run(function() {
    controller.send('unlock', student);
  });

  assert.ok(student.get('locked') === false, 'student is unlocked after calling unlock');
});

test('verify isEnrolled returns true when enrollments exist', function(assert) {
  assert.expect(1);
  var controller = this.subject();
  controller.set('enrollment', [1, 2, 3]);
  assert.ok(controller.get('isEnrolled') === true, 'isEnrolled returns correct value');
});

test('verify isEnrolled returns false when enrollments do not exist', function(assert) {
  assert.expect(1);
  var controller = this.subject();
  controller.set('enrollment', []);
  assert.ok(controller.get('isEnrolled') === false, 'isEnrolled returns correct value');
});

test('verify filteredStudents filters students.', function(assert) {
  assert.expect(1);
  var controller = this.subject();
  controller.set('searchFilter', 'jose');
  controller.set('students', [Ember.Object.create({
      firstName: 'JOSEPH',
      lastName: 'FORSMANN',
      grade: 6
    }),
    Ember.Object.create({
      firstName: 'BOB',
      lastName: 'SMITH',
      grade: 6
    })
  ]);

  var result = controller.get('filteredStudents');

  assert.ok(result.length === 1, 'verify students were filtered');
});

test('verify filteredStudents works with 2-character name.', function(assert) {
  assert.expect(1);
  var controller = this.subject();
  controller.set('searchFilter', 'jo');
  controller.set('students', [Ember.Object.create({
      firstName: 'JO',
      lastName: 'FORSMANN',
      grade: 6
    }),
    Ember.Object.create({
      firstName: 'BOB',
      lastName: 'SMITH',
      grade: 6
    })
  ]);

  var result = controller.get('filteredStudents');

  assert.ok(result.length === 1, 'verify students were filtered');
});

test('verify filteredStudents filters all students with 2-character searchFilter', function(assert) {
  assert.expect(1);
  var controller = this.subject();
  controller.set('searchFilter', 'jo');
  controller.set('students', [Ember.Object.create({
      firstName: 'JOSEPH',
      lastName: 'FORSMANN',
      grade: 6
    }),
    Ember.Object.create({
      firstName: 'BOB',
      lastName: 'SMITH',
      grade: 6
    })
  ]);

  var result = controller.get('filteredStudents');

  assert.ok(result.length === 0, 'verify students were filtered');
});
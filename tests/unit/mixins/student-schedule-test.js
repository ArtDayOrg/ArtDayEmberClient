import StudentScheduleMixin from '../../../mixins/student-schedule';
import Ember from 'ember';
import {
    module
}
from 'qunit';
import test from '../../ember-sinon-qunit/test';

module('Unit | Mixin | student schedule');

test('verify schedule property returns the correct schedule array', function(assert) {
    var StudentScheduleObject = Ember.Object.extend(StudentScheduleMixin);
    var subject = StudentScheduleObject.create();
    var enrollmentsArray = [];
    var session1 = Ember.Object.create({
        sessionName: 'Jump Rope',
        instructorName: 'Bob',
        capacity: 20,
        description: 'Jump rope for 90 minutes.',
        location: 'Room 50',
        instructions: 'Bring a rope.'
    });

    var session2 = Ember.Object.create({
        sessionName: 'Ember Basics',
        instructorName: 'Brian',
        capacity: 120,
        description: 'Learn ember class.',
        location: 'Room 51',
        instructions: 'Bring a rope.'
    });

    var session3 = Ember.Object.create({
        sessionName: 'Drum Line',
        instructorName: 'Lucy',
        capacity: 20,
        description: 'Bang on drums.',
        location: 'Room 52',
        instructions: 'Bring a drum'
    });

    var student1 = Ember.Object.create({
        firstName: 'John',
        lastName: 'Smith',
        grade: 6,
        locked: true
    });

    var enr1 = Ember.Object.create({
        period: 1,
        session: session1,
        student: student1
    });

    var enr2 = Ember.Object.create({
        period: 2,
        session: session2,
        student: student1
    });

    var enr3 = Ember.Object.create({
        period: 3,
        session: session3,
        student: student1
    });

    enrollmentsArray.push(enr1);
    enrollmentsArray.push(enr2);
    enrollmentsArray.push(enr3);

    var itemObject = Ember.Object.create({
        enrollments: enrollmentsArray
    });
    subject.set('item', itemObject);

    var schedule = subject.get('schedule');
    assert.ok(schedule.length === 5, 'Schedule is correct length');

    assert.equal(schedule[0][2], 'Jump Rope', 'First class name is correct');
    assert.equal(schedule[0][3], 'Room 50', 'First class location is correct');
    assert.equal(schedule[1][2], 'Ember Basics', 'Second class name is correct');
    assert.equal(schedule[1][3], 'Room 51', 'Second class location is correct');
    assert.equal(schedule[4][2], 'Drum Line', 'Third class name is correct');
    assert.equal(schedule[4][3], 'Room 52', 'Third class location is correct');

});
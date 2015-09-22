import Ember from 'ember';
import StudentSchedule from 'art-day/mixins/student-schedule';

export default Ember.Component.extend(StudentSchedule, {
  classNames: ['printable'],

  studentHasInstructions: function () {
    var enrollments = this.get('student.enrollments');
    var instructionCount = 0;
    enrollments.forEach(function (e){
      var instructions = e.get('session.instructions');
      if (instructions) {
        if (instructions.length) {
          instructionCount += 1;
        }
      }
    });
    return instructionCount > 0;
  }.property('student.enrollments', 'student.enrollments.@each.session.instructions')
});

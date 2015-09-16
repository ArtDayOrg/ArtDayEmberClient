import Ember from 'ember';

export default Ember.Route.extend({
model: function() {
  return Ember.RSVP.hash({
      students: this.store.findAll('student'),
      enrollment: this.store.findAll('enrollment'),
      sessions: this.store.findAll('session')
    });
  },

setupController: function(controller, models) {
  var students = models.students;
  var enrollment = models.enrollment;
  var sessions = models.sessions;

  controller.set('students', students);
  controller.set('enrollment', enrollment);
  controller.set('sessions', sessions);
}
});

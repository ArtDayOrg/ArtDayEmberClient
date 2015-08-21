import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
  		return Ember.RSVP.hash({
          preferences: this.store.peekAll('preference'),
    			students: this.store.peekAll('student'),
    			sessions: this.store.peekAll('session'),
          enrollment: this.store.peekAll('enrollment')
  		});
  	},

  	setupController: function(controller, models) {
    	var preferences = models.preferences;
    	var students = models.students;
    	var sessions = models.sessions;
      var enrollment = models.enrollment

    	controller.set('preferences', preferences);
    	controller.set('students', students);
    	controller.set('sessions', sessions);
      controller.set('enrollment', enrollment);
    }
});

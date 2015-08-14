import Ember from 'ember';

export default Ember.Route.extend({
    model: function() {
  		return Ember.RSVP.hash({
          preferences: this.store.findAll('preference'),
    			students: this.store.findAll('student'),
    			sessions: this.store.findAll('session')
  		});
  	},

  	setupController: function(controller, models) {
    	var preferences = models.preferences;
    	var students = models.students;
    	var sessions = models.sessions;

    	controller.set('preferences', preferences);
    	controller.set('students', students);
    	controller.set('sessions', sessions);
  	}
});
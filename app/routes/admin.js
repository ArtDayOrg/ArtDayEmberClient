import Ember from 'ember';

export default Ember.Route.extend({
    model: function() {
	    var store = this.store;
		return Ember.RSVP.hash({
  			students: store.findAll('student'),
  			preferences: store.findAll('preference'),
  			sessions: store.findAll('session')
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
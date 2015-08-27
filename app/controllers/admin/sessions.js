import Ember from 'ember';

export default Ember.Controller.extend({

	adminController: Ember.inject.controller('admin'),
	admin: Ember.computed.reads('adminController'),

	sessionsPrint: function () {
		
		var sessions = this.get('admin.sessions');
		console.log(sessions);

		var sessionsPrint = [];

		sessions.forEach(function (s) {
			var rosters = [];
        	var i;
        	var enrollment = s.get('enrollments');
	        var numberOfPeriods = enrollment.sortBy('period').reverse().objectAt(0).get('period');
    	    for (i = 1; i <= numberOfPeriods; i++) {
        	    var periodRoster = enrollment.filterBy('period', i);
            	var sortedPeriodRoster = periodRoster.sortBy('student.lastname');
            	rosters.push(sortedPeriodRoster);
        	}
			var sessionPrint = {
				sessionName: s.get('sessionName'),
				sessionInstructor: s.get('instructorName'),
				sessionLocation: s.get('location'),
				sessionRosters: rosters
			}
			sessionsPrint.push(sessionPrint);
		});

		console.log(sessionsPrint);

		return sessionsPrint;

	}.property('admin.enrollment.length'),

	actions: {
		printRosters: function () {
			console.log('printing all rosters');
		}
	}

});

import Ember from 'ember';

export default Ember.Controller.extend({

	//need isEnrolled property
	adminController: Ember.inject.controller('admin'),
	admin: Ember.computed.reads('adminController'),

	sessionsMetrics: function () {

		var sessionsMetrics = [];
		var sessions = this.get('sessions');

		sessions.forEach(function (s) {	
			var sessionMetrics = {
				name: s.get('sessionName'),
				enrolled: s.get('enrollments.length'),
				preferred: s.get('preferences.length')
			};
			sessionsMetrics.push(sessionMetrics);
		})

		//if enrollments are set, sort by difference between enrollment and preference 
		//otherwise sort by numebr of students who preferred the course
		if (this.get('admin.isEnrolled')) {
			sessionsMetrics.sort(function (a, b) {
				return b.preferred/b.enrolled - a.preferred/a.enrolled;
			});
		} else {
			sessionsMetrics.sort(function (a, b) {
				return b.preferred - a.preferred;
			});
		}
		return sessionsMetrics;

	}.property('sessions.length', 'sessions')
});

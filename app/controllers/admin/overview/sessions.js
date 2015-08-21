import Ember from 'ember';

export default Ember.Controller.extend({

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

		sessionsMetrics.sort(function (a, b) {
			return b.preferred/b.enrolled - a.preferred/a.enrolled;
		});

		return sessionsMetrics;

	}.property('sessions.length', 'sessions')
});

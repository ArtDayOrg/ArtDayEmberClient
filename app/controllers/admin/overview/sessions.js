import Ember from 'ember';
import AdminControllerHooks from 'art-day/mixins/admin-controller-hooks';

export default Ember.Controller.extend(AdminControllerHooks, {

	sessionsMetrics: function () {

		var sessionsMetrics = [];
		var sessions = this.get('admin.sessions');
		sessions.forEach(function (s) {	
			var sessionMetrics = {
				name: s.get('sessionName'),
				enrolled: s.get('enrollments.length'),
				preferred: s.get('preferences.length')
			};
			sessionsMetrics.push(sessionMetrics);
		});
		//if enrollments are set, sort by difference between enrollment and preference 
		if (this.get('admin.isEnrolled')) {
			sessionsMetrics.sort(function (a, b) {
				return b.preferred/b.enrolled - a.preferred/a.enrolled;
			});
		//otherwise sort by numebr of students who preferred the course
		} else {
			sessionsMetrics.sort(function (a, b) {
				return b.preferred - a.preferred;
			});
		}
		return sessionsMetrics;
	}.property('admin.sessions.length', 'admin.sessions', 'admin.enrollment.length')
});

import Ember from 'ember';
import AdminControllerHooks from 'art-day/mixins/admin-controller-hooks';

export default Ember.Controller.extend(AdminControllerHooks, {

	metricsByGrade: function() {

		function compileMetricsForGrade(studentsForGrade) {
			studentsForGrade.forEach(function(s) {
				compileMetricsForStudent(s);
			});
		}

		function countPrefs(p) {
			if (enrollmentStrings.contains(p.get('session.sessionName'))) {
				prefsGot += 1;
				grade.prefs[p.get('rank')] += 1;
			}
		}

		function pushSessionNameToEnrollmentStrings(e) {
			enrollmentStrings.push(e.get('session.sessionName'));
		}

		function compileMetricsForStudent(s) {
			prefsGot = 0;
			if (s.get('preferences.length') !== 0) {
				var prefs = s.get('preferences');
				var enrollment = s.get('enrollments');
				enrollmentStrings = [];
				enrollment.forEach(function(e) {
					pushSessionNameToEnrollmentStrings(e);
				});
				prefs.forEach(function(p) {
					countPrefs(p);
				});
				grade.got[prefsGot] += 1;
				grade.setPrefs += 1;
			}
		}

		//given an array of objects with identical keys and int values
		//if only propName is provided, returns the sum of the values of that key.
		//if otherPropName is present, returns the sum of the values of propName.otherPropName
		Array.prototype.sumProp = function(propName, otherPropName) {
			var total = 0;
			var i, len;

			for (i = 0, len = this.length; i < len; i++) {
				if (otherPropName) {
					total += this[i][propName][otherPropName];
				} else {
					total += this[i][propName];
				}
			}
			return total;
		};

		var enrollmentStrings;
		var prefsGot;
		var students = this.get('admin.students');
		var minGrade = 6;
		var maxGrade = 12;
		var grades = [];
		var i;

		students.sortBy('grade');

		for (i = minGrade; i <= maxGrade; i += 1) {
			var studentsForGrade = students.filterBy('grade', i);
			var grade = {
				grade: i.toString(),
				studentCount: studentsForGrade.get('length'),
				got: {
					'1': 0,
					'2': 0,
					'3': 0,
					'0': 0
				},
				prefs: {
					'1': 0,
					'2': 0,
					'3': 0,
					'4': 0,
					'5': 0,
					'6': 0
				},
				setPrefs: 0,
				gotPercent: {
					'1': 0,
					'2': 0,
					'3': 0,
					'0': 0
				},
				setPrefsPercent: 0,
				prefsPercent: {
					'1': 0,
					'2': 0,
					'3': 0,
					'4': 0,
					'5': 0,
					'6': 0
				}
			};
			compileMetricsForGrade(studentsForGrade);
			grades.push(grade);
		}

		var overview = {
			grade: 'Overview',
			studentCount: grades.sumProp('studentCount'),
			got: {
				'1': grades.sumProp('got', '1'),
				'2': grades.sumProp('got', '2'),
				'3': grades.sumProp('got', '3'),
				'0': grades.sumProp('got', '0')
			},
			prefs: {
				'1': grades.sumProp('prefs', '1'),
				'2': grades.sumProp('prefs', '2'),
				'3': grades.sumProp('prefs', '3'),
				'4': grades.sumProp('prefs', '4'),
				'5': grades.sumProp('prefs', '5'),
				'6': grades.sumProp('prefs', '6')
			},
			setPrefs: grades.sumProp('setPrefs'),
			gotPercent: {
				'1': 0,
				'2': 0,
				'3': 0,
				'0': 0
			},
			setPrefsPercent: 0,
			prefsPercent: {
				'1': 0,
				'2': 0,
				'3': 0,
				'4': 0,
				'5': 0,
				'6': 0
			}
		};

		grades.push(overview);

		//calculate percentages
		grades.forEach(function(grade) {
			Ember.$.each(grade.gotPercent, function(index) {
				//guard against divide by zero
				if (grade.setPrefs !== 0) {
					grade.gotPercent[index] = (grade.got[index] / grade.setPrefs * 100).toFixed(0);
				} else {
					grade.gotPercent[index] = '-';
				}
			});
			Ember.$.each(grade.prefsPercent, function(index) {
				if (grade.setPrefs !== 0) {
					grade.prefsPercent[index] = (grade.prefs[index] / grade.setPrefs * 100).toFixed(0);
				} else {
					grade.prefsPercent[index] = '-';
				}
			});
			if (grade.studentCount !== 0) {
				grade.setPrefsPercent = (grade.setPrefs / grade.studentCount * 100).toFixed(0);
			} else {
				grade.setPrefsPercent = '-';
			}
		});

		//display overview first, higher grades next
		grades.reverse();

		return grades;

	}.property('admin.enrollment.length', 'admin.students', 'admin.students.@each.preferences', 'admin.students.@each.enrollments', 'admin.enrollment', 'admin.preferences', 'admin.sessions')
});
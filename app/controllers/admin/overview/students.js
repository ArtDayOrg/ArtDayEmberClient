import Ember from 'ember';
import AdminControllerHooks  from 'art-day/mixins/admin-controller-hooks';

export default Ember.Controller.extend(AdminControllerHooks, {
	
	metricsByGrade: function() {

		var enrollmentStrings;
		var prefsGot;

		var countPrefs = function (p) {
			if (enrollmentStrings.contains(p.get('session.sessionName'))) {
				prefsGot += 1;
				grade.prefs[p.get('rank')] += 1;
			}
		};

		var pushSessionNameToEnrollmentStrings = function (e) {
			enrollmentStrings.push(e.get('session.sessionName'));
		};

		var compileMetricsForStudent = function (s) {
			prefsGot = 0;
			if (s.get('preferences.length') !== 0) {
				var prefs = s.get('preferences');
				var enrollment = s.get('enrollments');
				enrollmentStrings = [];
				enrollment.forEach(function (e) {
					pushSessionNameToEnrollmentStrings(e);
				});
				prefs.forEach(function (p) {
					countPrefs(p);
				});
				grade.got[prefsGot] += 1;
				grade.setPrefs += 1;
			}
		};

		var students = this.get('admin.students');
		students.sortBy('grade');
		
		var minGrade = students.get('firstObject.grade');
		var maxGrade = students.get('lastObject.grade');
		var grades = [];

		for (var i = minGrade; i <= maxGrade; i++) {
			var studentsForGrade = students.filterBy('grade', i);
			var grade = {
				grade: i.toString(),
				studentCount: studentsForGrade.get('length'),
				got: {
					"1": 0,
					"2": 0,
					"3": 0,
					"0": 0
				},
				prefs: {
					"1": 0,
					"2": 0,
					"3": 0,
					"4": 0,
					"5": 0, 
					"6": 0
				},
				setPrefs: 0,
				gotPercent: {
					"1": 0,
					"2": 0,
					"3": 0,
					"0": 0
				},
				setPrefsPercent: 0,
				prefsPercent: {
					"1": 0,
					"2": 0, 
					"3": 0, 
					"4": 0,
					"5": 0,
					"6": 0
				}
			};
			studentsForGrade.forEach(function (s) {
				compileMetricsForStudent(s);
			});
			grades.push(grade);
		}

		Array.prototype.sumProp = function (prop, otherProp) {
			var total = 0;
			for (var i = 0, _len = this.length; i < _len; i++) {
				if (otherProp) {
					total += this[i][prop][otherProp];
				} else {
					total += this[i][prop];
				}
			}
			return total;
		};

		var overview = {
			grade: "Overview",
			studentCount: grades.sumProp("studentCount"),
			got: {
				"1": grades.sumProp("got", "1"),
				"2": grades.sumProp("got", "2"),
				"3": grades.sumProp("got", "3"),
				"0": grades.sumProp("got", "0")
			},
			prefs: {
				"1": grades.sumProp("prefs", "1"),
				"2": grades.sumProp("prefs", "2"),
				"3": grades.sumProp("prefs", "3"),
				"4": grades.sumProp("prefs", "4"),
				"5": grades.sumProp("prefs", "5"), 
				"6": grades.sumProp("prefs", "6")
			},
			setPrefs: grades.sumProp("setPrefs"),
			gotPercent: {
				"1": 0,
				"2": 0,
				"3": 0,
				"0": 0
			},
			setPrefsPercent: 0,
			prefsPercent: {
				"1": 0,
				"2": 0, 
				"3": 0, 
				"4": 0,
				"5": 0,
				"6": 0
			}
		};

		grades.push(overview);
		
		grades.forEach(function (grade) {
			Ember.$.each(grade.gotPercent, function(index) {
				grade.gotPercent[index] = (grade.got[index]/grade.setPrefs * 100).toFixed(0);
			});
			Ember.$.each(grade.prefsPercent, function(index) {
				grade.prefsPercent[index] = (grade.prefs[index] / grade.setPrefs * 100).toFixed(0);
			});
			grade.setPrefsPercent = (grade.setPrefs/grade.studentCount * 100).toFixed(0);
		});

		grades.reverse();
		return grades;

	}.property('admin.enrollment.length', 'admin.students.@each.preferences'),

	metricsOverview: function() {
		return this.get('admin.students.length');
	}.property('admin.students.length')
});

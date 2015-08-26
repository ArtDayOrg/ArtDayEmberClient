import Ember from 'ember';

export default Ember.Controller.extend({
	
	//need isEnrolled property
	adminController: Ember.inject.controller('admin'),
	admin: Ember.computed.reads('adminController'),

	metricsByGrade: function() {

		var grades = [];
		var minGrade;
		var maxGrade;

		var students = this.get('students');
		students.sortBy('grade');
		minGrade = students.get('firstObject.grade');
		maxGrade = students.get('lastObject.grade');

		for (var i = minGrade; i<=maxGrade; i++) {
			var studentsForGrade = students.filterBy('grade', i)
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
			}
			studentsForGrade.forEach(function (s) {
				var prefsGot = 0;
				if (s.get('preferences.length') !== 0) {
					var prefs = s.get('preferences');
					var enrollment = s.get('enrollments');
					var enrollmentStrings = [];
					enrollment.forEach(function (e) {
						enrollmentStrings.push(e.get('session.sessionName'));
					});
					prefs.forEach(function (p) {
						if (enrollmentStrings.contains(p.get('session.sessionName'))) {
							prefsGot += 1;
							grade.prefs[p.get('rank')] += 1;
						}
					});
					grade.got[prefsGot] += 1;
					grade.setPrefs += 1;
				}
			});
			grades.push(grade);
		}

		Array.prototype.sumProp = function (prop, otherProp) {
			var total = 0;
			for (var i = 0, _len = this.length; i < _len; i++) {
				if (otherProp) {
					total += this[i][prop][otherProp];
				} else {
					total += this[i][prop]
				}
			}
			return total;
		}

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
		}

		console.log(overview);
		grades.push(overview);
		grades.forEach(function (grade) {
			Ember.$.each(grade.gotPercent, function(index, value) {
				grade.gotPercent[index] = (grade.got[index]/grade.setPrefs * 100).toFixed(0);
			});
			Ember.$.each(grade.prefsPercent, function(index, value) {
				grade.prefsPercent[index] = (grade.prefs[index] / grade.setPrefs * 100).toFixed(0);
			});
			grade.setPrefsPercent = (grade.setPrefs/grade.studentCount * 100).toFixed(0);
		});

		grades.reverse();
		console.log(grades);
		return grades;

	}.property('enrollment.length', 'students.@each.preferences'),

	metricsOverview: function() {
		return this.get('students.length');
	}.property('students.length')
});

/*global FB, $ */
import Ember from 'ember';
import enrollmentMesh from '../utils/enrollment-mesh';

export default Ember.Controller.extend({

    //currentPath
    appController: Ember.inject.controller('application'),
    app: Ember.computed.reads('appController'),

    //facebook login
    isAdmin: false,
    adminName: null,
    userImageUrl: null,

    //enrollment
    enrollmentBegan: false,
    enrollmentSucceeded: false,
    enrollmentFailed: false,

    isEnrolled: function() {
        return (this.get('enrollment.length') > 0);
    }.property('enrollment.length'),

    hasSetPrefs: function() {
        var count = 0;
        var students = this.get('students');
        students.forEach(function(s) {
            if (s.get('preferences.length') > 0) {
                count += 1;
            }
        });
        return count;
    }.property('students.@each.preferences'),

    totalCapacity: function() {
        var count = 0;
        var sessions = this.get('sessions');
        sessions.forEach(function(s) {
            var value = parseInt(count);
            count = value + parseInt(s.get('capacity'));
        });
        return count;
    }.property('sessions.@each.capacity', 'sessions.length'),

    enrollmentAvailable: function() {
        if (this.get('totalCapacity') >= this.get('students.length')) {
            return true;
        }
        return false;
    }.property('totalCapacity', 'students.length'),

    atAdminIndex: function() {
        if (this.get('app.currentPath') === 'admin.index') {
            return true;
        } else {
            return false;
        }
    }.property('app.currentPath'),

    actions: {

        login: function() {

            $('#loginError').hide();
            var self = this;

            FB.login(function(response) {
                if (response.status === 'connected') {

                    var adminList = ['forsmann@frontier.com', 'brian.spencer.king@gmail.com'];

                    FB.api('/me?fields=name,email,picture', function(response) {

                        if ($.inArray(response.email, adminList) !== -1) {
                            self.set('isAdmin', true);
                            self.set('adminName', response.name);
                            self.set('userImageUrl', response.picture.data.url);
                            self.transitionToRoute('admin');
                        } else {

                            // user is logged in, but NOT an admin.
                            self.set('isAdmin', false); // should already be false.
                            $('#loginError').show();
                            FB.logout();
                        }
                    });
                }
            }, {
                scope: 'public_profile,email'
            });
        },

        logout: function() {
            var self = this;
            FB.logout(function() {
                self.set('isAdmin', false);
            });
        },

        enroll: function() {
            var outerSelf = this;
            this.set('enrollmentBegan', true);
            enrollmentMesh(outerSelf);
        },

        // the following tests the enrollments for stability 
        // (instability === there exist 2 students who 
        // would change sessions for a single period)
        //
        // beware!!!
        //
        // testing the enrollments for stability works, 
        // but it is comically unoptimized (it takes about 90 seconds to test 1320 enrollments)
        // not intended to use in production, only during development 
        // to ensure the mesh is still producing stable enrollments after changes.
        //
        // optimization is left as an exercise to the reader.
        //
        // test: function() {
        //     //test at array of enrollments (for a single period) fon instability
        //     function testEnrollments() {

        //         console.log('----testing enrollments for instability----');
        //         var testingStartTime = Date.now();
        //         var unstable = 0;

        //         var enrollment = outerSelf.get('enrollment');
        //         var loop = enrollment.sortBy('period').reverse().objectAt(0).get('period') + 1;
        //         while (--loop) {
        //             var periodEnrollment = enrollment.filterBy('period', loop);
        //             testEnrollment(periodEnrollment);
        //         }

        //         function testEnrollment(enrollment) {

        //             var currentPeriod = enrollment.objectAt(0).get('period');
        //             var unhappyEnrollments = [];
        //             var noPreferences = [];

        //             enrollment.forEach(function (e) {
        //                 var student = e.get('student');
        //                 var prefs = student.get('preferences.content');
        //                 if (prefs.length > 0) {
        //                     var topPref = null;
        //                     prefs.forEach(function (pref) {
        //                         if (!topPref || (pref.get('rank') < topPref.get('rank'))) {
        //                             topPref = pref;
        //                         }
        //                     });
        //                     if (e.get('session.sessionName') !== topPref.get('session.sessionName')) {
        //                         unhappyEnrollments.push(e);
        //                     }
        //                 } else {
        //                     noPreferences.push(e);
        //                 }
        //             });

        //             console.log('did not get first choice: ' + unhappyEnrollments.length);
        //             console.log('did not set preferences: ' + noPreferences.length);

        //             unhappyEnrollments.forEach(function (e) {

        //                 var unhappyStudent = e.get('student.content');
        //                 var jealousArray = [];
        //                 var notJealousArray = [];
        //                 var unhappyStudentPrefs = unhappyStudent.get('preferences.content');
        //                 var jealousRank = unhappyStudentPrefs.length + 1;
        //                 var unhappySessionName = e.get('session.sessionName');
        //                 unhappyStudentPrefs.forEach(function (p) {
        //                     if (p.get('session.sessionName') === unhappySessionName) {
        //                         jealousRank = p.get('rank');
        //                     }
        //                 });

        //                 var unhappyStudentsEnrollments = e.get('student.enrollments');
        //                 unhappyStudentsEnrollments.forEach(function (otherE) {
        //                     if (otherE.get('period') !== currentPeriod) {
        //                         notJealousArray.push(otherE.get('session.sessionName'));
        //                     }
        //                 });

        //                 unhappyStudentPrefs.forEach(function (p) {
        //                     var prefName = p.get('session.sessionName');
        //                     if (p.get('rank') < jealousRank && !notJealousArray.contains(prefName)) {
        //                         jealousArray.push(prefName);
        //                     }
        //                 });
        //                 // console.log('- - - - -')
        //                 // console.log(unhappyStudent.get('firstName') + ' grade: ' + unhappyStudent.get('grade'));
        //                 // console.log('enrolled: ' + e.emberSession.get('sessionName'));
        //                 // console.log('prefers:')
        //                 // unhappyStudentPrefs.sortBy('rank').forEach(function (p) {
        //                 //     console.log('\t' + p.get('session.sessionName') + ' rank ' + p.get('rank'));
        //                 // })
        //                 // console.log('jealous of all above rank ' + jealousRank + ' specifically:')
        //                 // console.log(jealousArray);

        //                 // check to make sure no student that set preferences is jealous of any student who did not set preferences.
        //                 // noPreferences.forEach(function (e) {
        //                 //     var uninterestedStudentsSessionName = e.emberSession.get('sessionName');
        //                 //     jealousArray.forEach(function (n) {
        //                 //         if (n === uninterestedStudentsSessionName) {
        //                 //             console.log(e.emberStudent.get('firstName'), unhappyStudent.get('firstName'));
        //                 //          }
        //                 //     });
        //                 // });

        //                 unhappyEnrollments.forEach(function (f) {
        //                     var otherUnhappyStudent = f.get('student');
        //                     var otherJealousArray = [];
        //                     var otherNotJealousArray = [];
        //                     var otherUnhappyStudentPrefs = otherUnhappyStudent.get('preferences.content');
        //                     var otherJealousRank = otherUnhappyStudentPrefs.length + 1;
        //                     var otherUnhappySessionName = f.get('session.sessionName');

        //                     var otherUnhappyStudentsEnrollments = f.get('student.enrollments');
        //                     otherUnhappyStudentsEnrollments.forEach(function (otherE) {
        //                         if (otherE.get('period') !== currentPeriod) {
        //                             otherNotJealousArray.push(otherE.get('session.sessionName'));
        //                         }
        //                     });
        //                     otherUnhappyStudentPrefs.forEach(function (p) {
        //                         if (p.get('session.sessionName') === otherUnhappySessionName) {
        //                             otherJealousRank = p.get('rank');
        //                         }
        //                     });
        //                     otherUnhappyStudentPrefs.forEach(function (p) {
        //                         if (p.get('rank') < otherJealousRank && !otherNotJealousArray.contains(p.get('session.sessionName'))) {
        //                             otherJealousArray.push(p.get('session.sessionName'));
        //                         }
        //                     });

        //                     var unhappyStudentDesiresSwitch = (jealousArray.indexOf(otherUnhappySessionName) > -1);
        //                     var otherUnhappyStudentDesiresSwitch = (otherJealousArray.indexOf(unhappySessionName) > -1);

        //                     if (unhappyStudentDesiresSwitch && otherUnhappyStudentDesiresSwitch) {

        //                         unstable++;
        //                         console.error('Instability detected');
        //                         console.groupCollapsed();
        //                         console.log(unhappyStudent.get('firstName') + ' has ' + unhappySessionName + ' and is jealous of ');
        //                         console.log(jealousArray);
        //                         var unhappyStudentsCompletePrefs = unhappyStudent.get('preferences');
        //                         unhappyStudentsCompletePrefs.forEach(function (p) {
        //                             console.log('\t' + p.get('session.sessionName') + ' rank ' + p.get('rank'));
        //                         });
        //                         var unhappyStudentsCompleteEnrollments = unhappyStudent.get('enrollments');
        //                         unhappyStudentsCompleteEnrollments.forEach(function (enroll) {
        //                             console.log('\t\t' + enroll.get('session.sessionName') + ' period ' + enroll.get('period'));
        //                         });
        //                         console.log(otherUnhappyStudent.get('firstName') + ' has ' + otherUnhappySessionName + ' and is jealous of ');
        //                         console.log(otherJealousArray);
        //                         var otherUnhappyStudentsCompletePrefs = otherUnhappyStudent.get('preferences');
        //                         otherUnhappyStudentsCompletePrefs.forEach(function (p) {
        //                             console.log('\t' + p.get('session.sessionName') + ' rank ' + p.get('rank'));
        //                         });
        //                         var otherUnhappyStudentsCompleteEnrollments = otherUnhappyStudent.get('enrollments');
        //                         otherUnhappyStudentsCompleteEnrollments.forEach(function (enroll) {
        //                             console.log('\t\t' + enroll.get('session.sessionName') + ' period ' + enroll.get('period'));
        //                         });
        //                         console.groupEnd();
        //                     } else {
        //                         console.log('no instability!');
        //                     }
        //                 });
        //             });
        //         }
        //         console.error('unstable: ' + unstable);
        //         console.log('testing took ' + (Date.now() - testingStartTime) + ' milliseconds');
        //     }
        //     console.log('testing...');
        //     var outerSelf = this;
        //     testEnrollments();
        // }
    }
});
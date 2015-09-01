/*global FB, $ */

import Ember from 'ember';

export default Ember.Controller.extend({
    
    init: function() {
        // FB.logout();
    },

    isAdmin: false,
        
    adminName: null,
    
    userImageUrl: null,

    enrollmentBegan: false,

    enrollmentSucceeded: false,

    enrollmentFailed: false,
    
    isEnrolled: function () {
        return (this.get('enrollment.length') > 0);
    }.property('model.enrollment.length'),
    
    hasSetPrefs: function () {
        var count = 0;
        var students = this.get('students');
        students.forEach(function (s) {
            if (s.get('preferences.length') > 0) {
                count += 1;
            }
        });
        return count;
    }.property('model.students.@each.preferences'),

    totalCapacity: function () {
        var count = 0;
        var sessions = this.get('sessions');
        sessions.forEach(function (s) {
            var value = parseInt(count);
            count = value + parseInt(s.get('capacity'));
        });
        return count;
    }.property('sessions.@each.capacity', 'sessions.length'),

    enrollmentAvailable: function () {
        if (this.get('totalCapacity') >= this.get('students.length')) {
            return true;
        }
        return false;
    }.property('totalCapacity', 'students.length'),

    actions: {

        login: function() {
            //??? should be Ember.$ ???
            $('#loginError').hide();
            var self = this;
        
            FB.login(function(response) {
                if (response.status === 'connected') {
        
                    var adminList = ['forsmann@frontier.com', 'brian.spencer.king@gmail.com'];

                    FB.api('/me?fields=name,email,picture', function(response){
        
                        if ($.inArray(response.email, adminList) !== -1) {
                            self.set('isAdmin', true);
                            self.set('adminName', response.name);
                            self.set('userImageUrl', response.picture.data.url);
                            self.transitionToRoute('admin');
                        } else {
        
                            // user is logged in, but NOT an admin.
                            self.set('isAdmin', false);  // should already be false.
                            $('#loginError').show();
                            FB.logout();
                        }
                    });
                }
            }, {scope: 'public_profile,email'});
        },
        
        logout: function() {
            var self = this;
            FB.logout(function(){
                self.set('isAdmin', false);
            });
        },

        enroll: function() {
        
            function Enrollment(emberSession, emberStudent, period) {
                this.emberSession = emberSession;
                this.emberStudent = emberStudent;
                this.period = period;
            }

            //best performance at shuffling array from http://jsperf.com/array-shuffle-comparator/5
            Array.prototype.shuffle1 = function () {
                var l = this.length + 1;
                while (l--) {
                    var r = ~~(Math.random() * l), o = this[r];
                    this[r] = this[0];
                    this[0] = o;
                }
                return this;
            };

            //exclusive diff
            //from http://stackoverflow.com/questions/1187518/javascript-array-difference
            //returns an array with all elements of the first array that are not in the second array
            //e.g. [1,2,3].diff([3,4,5]) --> [1,2];
            Array.prototype.diff = function(a) {
                
                //does not work on IE 8?
                return this.filter(function(i) {return a.indexOf(i) < 0;});
            };

            function loadStudents(outerSelf) {

                function Student(emberStudent) {
                    this.emberStudent = emberStudent;
                    this.grade = emberStudent.get('grade');
                    this.preferences = emberStudent.get('preferences').sortBy('rank').reverse();
                    this.priority = this.preferences.length > 0 ? this.grade : 0;
                    this.bumpCount = 0;
                    this.proposedEnrollment = null;
                    this.deniedEnrollments = [];
                    this.enrolled = [];
                }

                var students = [];
                var studentsFromModel = outerSelf.get('students');
                studentsFromModel.forEach(function (s) {
                    var newStudent = new Student(s);
                    students.push(newStudent);
                });

                return students;
            }

            function resetStudents(students) {
                students.forEach(function (s) {
                    s.deniedEnrollments.splice(0, s.deniedEnrollments.length);
                    s.priority = s.preferences.length > 0 ? s.grade + (s.bumpCount * 3) : 0;
                    s.bumpCount = 0;
                    s.enrolled.push(s.proposedEnrollment);
                    s.proposedEnrollment = null;
                    s.enrolled.forEach(function (e) {
                        s.deniedEnrollments.push(e);
                    });
                });
            }

            function loadSessions(outerSelf) {
                function Session(emberSession) {
                    this.emberSession = emberSession;
                    this.sessionName = emberSession.get('sessionName');
                    this.capacity = emberSession.get('capacity');
                    this.proposedEnrollments = [];
                } 
                var sessions = [];
                var sessionsFromModel = outerSelf.get('sessions');
                sessionsFromModel.forEach(function (s) {
                    var newSession = new Session(s);
                    sessions.push(newSession);
                });
                return sessions;
            }

            function resetSessions(sessions) {
                sessions.forEach(function (s) {
                    s.proposedEnrollments.splice(0, s.proposedEnrollments.length);
                });
            }

            function enrollmentsToDB(enrollments, outerSelf) {
                var needed = 0;
                var i;

                for (i = 0; i < enrollments.length; i++) {
                    needed += enrollments[i].length;
                }


                var body = [];

                allEnrollments.forEach(function (enrollmentArray) {
                    enrollmentArray.forEach(function (enrollment) {

                        var enrollmentJSON = {
                            "studentId": enrollment.emberStudent.get('id'),
                            "sessionId": enrollment.emberSession.get('id'),
                            "period": enrollment.period
                        };
                        body.push(enrollmentJSON);

                        // var newEnrollment = outerSelf.store.createRecord('enrollment', {
                        //     student: enrollment.emberStudent,
                        //     session: enrollment.emberSession,
                        //     period: index+1
                        // });
                        // newEnrollment.save().then(function () {
                        //     successes += 1;
                        //     console.log('success '+ successes);
                        //     if (successes === needed) {
                        //         outerSelf.set('enrollmentSucceeded', true);
                        //     }
                        // }, function (reason) {
                        //     console.log('failure: ' + reason);
                        //     outerSelf.set('enrollmentFailed', true);
                        // });
                    });
                });
                Ember.$.ajax({
                    method: 'POST',
                    url: 'http://artday.azurewebsites.net/api/enrollments/Add',
                    data: JSON.stringify(body)
                }).done(function(msg) {
                    outerSelf.set('enrollmentSucceeded', true);
                });
            }

            function mesh(sessions, students, period) {

                //iterates through sessions that have proposed enrollments and returns an array of enrollments for that period
                function createEnrollments(sessions) {
                    var enrollments = [];
                    for (var i = 0; i<sessions.length; i++) {
                        var s = sessions.objectAt(i);
                        for (var j = 0; j < s.proposedEnrollments.length; j++) {
                            var enrollment = new Enrollment(s.emberSession, s.proposedEnrollments[j].emberStudent, period);
                            enrollments.push(enrollment);
                        }
                    }
                    return enrollments;
                }

                // required by our version of Gale-Shapely Algorithm
                // returns the next unenrolled student if there is one or null
                function freeStudent(students, sessions) {
                    var student;
                    for (var i = 0; i < students.length; i++) {
                        student = students.objectAt(i);

                        // handle a special case that was (rarely) causing errors
                        // if a student has no proposed enrollment and has been denied from every session, then that student would be orphaned.
                        // for example where a student without preferences is assigned the two least popular sessions during the first two runs through
                        // and then is processed late in the last run through, when only the 2 sessions they are already assigned to are available.
                        // to handle this special case, we set their denied enrollments to be only those sessions they are enrolled in, 
                        // then give them priority over all other students without preferences and try again.  
                        // this ensures no students are orphaned and that no orphan bumps a student who did set their preferences
                        if (student.proposedEnrollment === null && student.deniedEnrollments.length === sessions.length) {
                            student.deniedEnrollments = [];
                            student.enrolled.forEach(function (e) {
                                student.deniedEnrollments.push(e);
                            });
                            student.priority += 1;
                            return student;
                        }

                        // return the next unenrolled student
                        if (student.proposedEnrollment === null) {
                            return student;
                        }
                    }
                    return null;
                }

                //required by our version of Gale-Shapley
                //returns the best session for a student if their is one
                //a random eligable session in the event of a tie
                //and null if the sessions are all full
                function bestSessionForStudent(student, sessions) {

                    function prefNotInDenied(pref, denied) {
                        var prefName = pref.get('session.sessionName');
                        for (var i = 0; i < denied.length; i++) {
                            var deniedName = denied[i].sessionName;
                            if (prefName === deniedName) {
                                return false;
                            }
                        }
                        return true;
                    }

                    function sessionNameFilter(s) {
                         return student.preferences.objectAt(i).get('session.sessionName') === s.sessionName;
                    }

                    function availableSessions(sessions, prefs, student) {
                        var notPreferredSessions = [];
                        for (var i = 0; i < sessions.length; i++) {
                            var s = sessions[i];
                            for (var j = 0; j < prefs.length; j++) {
                                var p = prefs[j];
                                if (p.get('sessionName') === s.sessionName) {
                                    break;
                                }
                            }
                            notPreferredSessions.push(s);
                        }
                        var available = notPreferredSessions.diff(student.deniedEnrollments);
                        return available;
                    }

                    var bestSession = null;
                    var prefs = student.preferences;

                    //go through preferences and grab the first session they are both eligable and prefer
                    for (var i = 0; i<prefs.length; i++) {
                        if (prefNotInDenied(prefs[i], nextStudent.deniedEnrollments)) {
                            bestSession = sessions.filter(sessionNameFilter)[0];
                        }
                    }

                    //if there is no such session, or if they did not set their preferences, they get a random session chosen from all available sessions
                    if (!bestSession) {
                        var available = availableSessions(sessions, prefs, student);
                        bestSession = available[Math.floor(Math.random() * available.length)];
                    }

                    return bestSession;
                }

                // Gail-Shapley Algorithm starts here, adopted from Algorithm Design Kleinberg and Tardos
                // because we process students preferences and not the sessions preferences, we are sure
                // students cannot cheat by lying about their preferences: http://www.columbia.edu/~js1353/pubs/tst-ipco99.pdf
                // pgs 432-438 (assume students correspond to men in the discussion in the paper)

                // while there is a student nextStudent who is free and hasn't attempted enrollment in every class                
                while (true) {
                    
                    //choose such a student(nextStudent)
                    var nextStudent = freeStudent(students, sessions);
                    var nextStudentsSession;
                    if (nextStudent) {
                
                        //let nextStudentsSession be the highest-ranked session in nextStudents preference list to whom nextStudent has not attempted enrollment
                        nextStudentsSession = bestSessionForStudent(nextStudent, sessions);

                    } else {
                
                        //if there are no more students, then the algorithm is complete
                        break;
                    }

                    //if there is such a session and there is space in that session
                    if (nextStudentsSession && nextStudentsSession.proposedEnrollments.length < nextStudentsSession.capacity) {
                    
                        //that student proposes to enroll in that session
                        nextStudentsSession.proposedEnrollments.push(nextStudent);
                        nextStudent.proposedEnrollment = nextStudentsSession;
                        nextStudent.deniedEnrollments.push(nextStudentsSession);
                    
                    //otherwise, there is such a session but the session is currently full
                    } else if (nextStudentsSession) {
                        
                        //if that session prefers the next student to it's least desired student 
                        //(index 0 of the sorted array)
                        nextStudentsSession.proposedEnrollments.sort(function (a, b) {
                            return a.priority - b.priority;
                        });
                        if (nextStudent.priority > nextStudentsSession.proposedEnrollments[0].priority) {

                            //the least desired student is bumped and the next student gets the enrollment
                            var bumpedStudent = nextStudentsSession.proposedEnrollments[0];
                            bumpedStudent.proposedEnrollment = null;
                            bumpedStudent.bumpCount += 1;
                            nextStudent.proposedEnrollment = nextStudentsSession;
                            nextStudent.deniedEnrollments.push(nextStudentsSession);
                            nextStudentsSession.proposedEnrollments.shift();
                            nextStudentsSession.proposedEnrollments.push(nextStudent);
                        
                        //else the session prefers its lowest enrolled member to nextStudent
                        } else {

                            //the next student is denied enrollment
                            nextStudent.bumpCount += 1;
                            nextStudent.deniedEnrollments.push(nextStudentsSession);
                        }

                    //else the total capacity is less than the total number of students.
                    //(our app should never enter because we check capacity vs. number of students before giving them the option to enroll)
                    //if we wanted to allow less capacity than students, leaving the least preferred to be unenrolled, 
                    //then we would not break here, but we don't allow that.
                    } else {
                        console.warn('not enough total session capacity for every student');
                        break;
                    }
                }

                //return an array of enrollments for the period
                return createEnrollments(sessions); 
            }

            this.set('enrollmentBegan', true);

            //context for accessing model inside loading functions
            var outerSelf = this;

            //shuffle students so mesh has no hidden biases
            var students = loadStudents(outerSelf).shuffle1();
            var sessions = loadSessions(outerSelf);

            var allEnrollments = [];

            //3,2,1
            var loop = 4;
            while (--loop) {
                var enrollments = mesh(sessions, students, loop);
                allEnrollments.push(enrollments);
                //if we are going to loop again, reset students and sessions
                if (loop === 1) {
                    break;
                }
                resetStudents(students);
                resetSessions(sessions);
            }

            enrollmentsToDB(allEnrollments, outerSelf);
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

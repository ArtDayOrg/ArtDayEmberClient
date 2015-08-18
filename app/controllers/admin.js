import Ember from 'ember';

export default Ember.Controller.extend({
    isAdmin: false,
    meshIsAvailable: true,
    checkLoginStatus: function() {
        FB.getLoginStatus(function(response) {
          if (response.status === 'connected') {
            
            // the user is logged in and has authenticated your
            // app, and response.authResponse supplies
            // the user's ID, a valid access token, a signed
            // request, and the time the access token 
            // and signed request each expire
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;

            // for now, just return true, and allow the user to see admin stuff.
            // Before release, we'll do some authorization here to ensure that
            // not all users can see the admin page.
            return true;
          } else if (response.status === 'not_authorized') {
            return true;
          } else {
            return false;
          }
        }, function(error) {
            console.log(error);
        });
    }.property(),
    enrollIsAvailable: true,
    actions: {
        login: function() {
            var self = this;
            FB.login(function(response) {
                if (response.status === 'connected') {
                    self.set('isAdmin', true);
                    FB.api('/me', function(response){
                        console.log(JSON.stringify(response));
                    });
                    FB.api('/me/permissions', function(response){
                        console.log(JSON.stringify(response));
                    });
                }
            }, {scope: 'public_profile,email'});
        },
        logout: function() {
            var self = this;
            FB.logout(function(response){
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
                    
                    s.priority = s.preferences.length > 0 ? s.grade + s.bumpCount * 3 : 0;
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

            function mesh(sessions, students, period) {

                //helper
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

                //required by our version of Gale-Shapely
                //returns the next unenrolled student if there is one or null
                function freeStudent(students, sessions) {
                    var student;
                    for (var i = 0; i < students.length; i++) {
                        student = students.objectAt(i);
                        if (student.proposedEnrollment === null && student.deniedEnrollments.length !== sessions.length) {
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

                    for (var i = 0; i<prefs.length; i++) {
                        if (prefNotInDenied(prefs[i], nextStudent.deniedEnrollments)) {
                            bestSession = sessions.filter(sessionNameFilter)[0];
                        }
                    }

                    if (!bestSession) {
                        var available = availableSessions(sessions, prefs, student);
                        bestSession = available[Math.floor(Math.random() * available.length)];
                    }

                    return bestSession;
                }

                //Gail-Shapley Algorithm starts here, adopted from Algorithm Design Kleinberg and Tardos
                //because we process students preferences and not the sessions preferences, we are sure
                //students cannot cheat by lying about their preferences: http://www.columbia.edu/~js1353/pubs/tst-ipco99.pdf
                //pgs 432-438 (students correspond to men in the discussion in the paper)
                //while there is a student nextStudent who is free and hasn't attempted enrollment in every class                
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
                        
                        //if that session prefers the next student to it's least desired student (index 0 of the sorted array)
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
                        
                        //the session prefers its lowest enrolled member to nextStudent
                        } else {

                            //the next student is denied enrollment
                            nextStudent.bumpCount += 1;
                            nextStudent.deniedEnrollments.push(nextStudentsSession);
                        }

                    //(User should never enter because we check capacity vs. number of students before giving them the option to enroll)
                    //the total capacity is less than the total number of students.
                    //if we wanted to allow less capacity than students, leaving the least preferred to be unenrolled, 
                    //then we would not break here, but we don't allow that.
                    } else {
                        console.log('not enough total session capacity for every student');
                        break;
                    }
                }

                return createEnrollments(sessions); 
            }

            var startDate = Date.now();

            //context for accessing model inside loading functions
            var outerSelf = this;

            //shuffle students so mesh has no hidden biases
            var students = loadStudents(outerSelf).shuffle1();
            var sessions = loadSessions(outerSelf);

            var allEnrollments = [];

            var loop = 3;
            while (loop--) {
                var enrollments = mesh(sessions, students, loop+1);
                allEnrollments.push(enrollments);
                resetStudents(students);
                resetSessions(sessions);
            }

            console.log(allEnrollments);
            console.log('total time: ' + (Date.now() - startDate) + ' milliseconds');
            
            function enrollmentsToDB(enrollments, outerSelf) {
                
                allEnrollments.forEach(function (enrollmentArray, index) {
                    enrollmentArray.forEach(function (enrollment) {
                        var newEnrollment = outerSelf.store.createRecord('enrollment', {
                            student: enrollment.emberStudent,
                            session: enrollment.emberSession,
                            period: index+1
                        });
                        newEnrollment.save().then(function () {
                            console.log(newEnrollment.get('student.firstname') + ' enrolls in ' + newEnrollment.get('session.sessionName') + ' during period ' + newEnrollment.get('period'));
                        }, function (reason) {
                            console.log('failure: ' + reason);
                        });
                    });
                });
            }

            enrollmentsToDB(allEnrollments, outerSelf);
        },

        test: function() {
            //test at array of enrollments (for a single period) fon instability
            function testEnrollments() {

                console.log('----testing enrollments for instability----');
                var testingStartTime = Date.now();
                var unstable = 0;

                var enrollment = outerSelf.get('enrollment');
                var loop = enrollment.sortBy('period').reverse().objectAt(0).get('period') + 1;
                while (--loop) {
                    var periodEnrollment = enrollment.filterBy('period', loop);
                    testEnrollment(periodEnrollment);
                }

                function testEnrollment(enrollment) {

                    var currentPeriod = enrollment.objectAt(0).get('period');
                    var unhappyEnrollments = [];
                    var noPreferences = [];

                    enrollment.forEach(function (e) {
                        var student = e.get('student');
                        var prefs = student.get('preferences.content');
                        if (prefs.length > 0) {
                            var topPref = null;
                            prefs.forEach(function (pref) {
                                if (!topPref || (pref.get('rank') < topPref.get('rank'))) {
                                    topPref = pref;
                                }
                            });
                            if (e.get('session.sessionName') !== topPref.get('session.sessionName')) {
                                unhappyEnrollments.push(e);
                            }
                        } else {
                            noPreferences.push(e);
                        }
                    });

                    console.log('did not get first choice: ' + unhappyEnrollments.length);
                    console.log('did not set preferences: ' + noPreferences.length);

                    unhappyEnrollments.forEach(function (e) {
                        
                        var unhappyStudent = e.get('student.content');
                        var jealousArray = [];
                        var notJealousArray = [];
                        var unhappyStudentPrefs = unhappyStudent.get('preferences.content');
                        var jealousRank = unhappyStudentPrefs.length + 1;
                        var unhappySessionName = e.get('session.sessionName');
                        unhappyStudentPrefs.forEach(function (p) {
                            if (p.get('session.sessionName') === unhappySessionName) {
                                jealousRank = p.get('rank');
                            }
                        });

                        var unhappyStudentsEnrollments = e.get('student.enrollments');
                        unhappyStudentsEnrollments.forEach(function (otherE) {
                            if (otherE.get('period') !== currentPeriod) {
                                notJealousArray.push(otherE.get('session.sessionName'));
                            };
                        })

                        unhappyStudentPrefs.forEach(function (p) {
                            var prefName = p.get('session.sessionName');
                            if (p.get('rank') < jealousRank && !notJealousArray.contains(prefName)) {
                                jealousArray.push(prefName);
                            }
                        });
                        // console.log('- - - - -')
                        // console.log(unhappyStudent.get('firstname') + ' grade: ' + unhappyStudent.get('grade'));
                        // console.log('enrolled: ' + e.emberSession.get('sessionName'));
                        // console.log('prefers:')
                        // unhappyStudentPrefs.sortBy('rank').forEach(function (p) {
                        //     console.log('\t' + p.get('session.sessionName') + ' rank ' + p.get('rank'));
                        // })
                        // console.log('jealous of all above rank ' + jealousRank + ' specifically:')
                        // console.log(jealousArray);

                        // noPreferences.forEach(function (e) {
                        //     var uninterestedStudentsSessionName = e.emberSession.get('sessionName');
                        //     jealousArray.forEach(function (n) {
                        //         if (n === uninterestedStudentsSessionName) {
                        //             console.log(e.emberStudent.get('firstname'), unhappyStudent.get('firstname'));
                        //          }
                        //     });
                        // });

                        unhappyEnrollments.forEach(function (f) {
                            var otherUnhappyStudent = f.get('student');
                            var otherJealousArray = [];
                            var otherNotJealousArray = [];
                            var otherUnhappyStudentPrefs = otherUnhappyStudent.get('preferences.content');
                            var otherJealousRank = otherUnhappyStudentPrefs.length + 1;
                            var otherUnhappySessionName = f.get('session.sessionName');

                            var otherUnhappyStudentsEnrollments = f.get('student.enrollments');
                            otherUnhappyStudentsEnrollments.forEach(function (otherE) {
                                if (otherE.get('period') !== currentPeriod) {
                                    otherNotJealousArray.push(otherE.get('session.sessionName'));
                                };
                            })
                            otherUnhappyStudentPrefs.forEach(function (p) {
                                if (p.get('session.sessionName') === otherUnhappySessionName) {
                                    otherJealousRank = p.get('rank');
                                }
                            });
                            otherUnhappyStudentPrefs.forEach(function (p) {
                                if (p.get('rank') < otherJealousRank && !otherNotJealousArray.contains(p.get('session.sessionName'))) {
                                    otherJealousArray.push(p.get('session.sessionName'));
                                }
                            });

                            var unhappyStudentDesiresSwitch = (jealousArray.indexOf(otherUnhappySessionName) > -1);
                            var otherUnhappyStudentDesiresSwitch = (otherJealousArray.indexOf(unhappySessionName) > -1);

                            if (unhappyStudentDesiresSwitch && otherUnhappyStudentDesiresSwitch) {

                                unstable++;

                                console.log('unstable :(')
                                console.log(unhappyStudent.get('firstname') + ' has ' + unhappySessionName + ' and is jealous of ')
                                console.log(jealousArray);
                                var unhappyStudentsCompletePrefs = unhappyStudent.get('preferences');
                                unhappyStudentsCompletePrefs.forEach(function (p) {
                                    console.log('\t' + p.get('session.sessionName') + ' rank ' + p.get('rank'));
                                })
                                var unhappyStudentsCompleteEnrollments = unhappyStudent.get('enrollments');
                                unhappyStudentsCompleteEnrollments.forEach(function (enroll) {
                                    console.log('\t\t' + enroll.get('session.sessionName') + ' period ' + enroll.get('period'));
                                })
                                console.log(otherUnhappyStudent.get('firstname') + ' has ' + otherUnhappySessionName + ' and is jealous of ')
                                console.log(otherJealousArray);
                                var otherUnhappyStudentsCompletePrefs = otherUnhappyStudent.get('preferences');
                                otherUnhappyStudentsCompletePrefs.forEach(function (p) {
                                    console.log('\t' + p.get('session.sessionName') + ' rank ' + p.get('rank'));
                                })
                                var otherUnhappyStudentsCompleteEnrollments = otherUnhappyStudent.get('enrollments');
                                otherUnhappyStudentsCompleteEnrollments.forEach(function (enroll) {
                                    console.log('\t\t' + enroll.get('session.sessionName') + ' period ' + enroll.get('period'));
                                })




                            } else {
                                console.log('no instability!');
                            }
                        });
                    });
                }

                console.log('unstable: ' + unstable);
                console.log('testing took ' + (Date.now() - testingStartTime) + ' milliseconds');
            }

            console.log('testing...')
            var outerSelf = this;
            testEnrollments(outerSelf);

        }

    }
});

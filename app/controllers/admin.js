import Ember from 'ember';

export default Ember.Controller.extend({

    isAdmin: true,

    meshIsAvailable: true,

    actions: {

        //facebook auth
        login: function() {
            Ember.$("#message").hide();
            if (Ember.$('#pw').val() === 'password') {
                this.set('isAdmin', true);                
            } else {
                Ember.$("#message").show();
            }
        },

        //mesh
        mesh: function() {

            var outerSelf = this;

            //best performance at shuffling array from http://jsperf.com/array-shuffle-comparator/5
            Array.prototype.shuffle1 = function () {
                var l = this.length + 1;
                while (l--) {
                    var r = ~~(Math.random() * l), o = this[r];
                    this[r] = this[0];
                    this[0] = o;
                }
                return this;
            }

            //from http://stackoverflow.com/questions/1187518/javascript-array-difference
            //does not work on IE 8
            Array.prototype.diff = function(a) {
                return this.filter(function(i) {return a.indexOf(i) < 0;});
            };

            function loadStudents() {
                
                function Student(emberStudent) {

                    this.emberStudent = emberStudent;
                    this.firstname = emberStudent.get('firstname');
                    this.lastname = emberStudent.get('lastname');
                    this.grade = emberStudent.get('grade');
                    this.preferences = emberStudent.get('preferences').sortBy('rank');
                    this.bumpedGrade = this.preferences.length > 0 ? this.grade : 0;
                    this.bumpCount = 0;
                    this.proposedEnrollment = null;
                    this.deniedEnrollments = [];            
                
                }

                var students = [];
                var studentsFromModel = outerSelf.get('students');
                studentsFromModel.forEach(function (s) {
                    var newStudent = new Student(s);
                    students.push(newStudent);
                });

                return students;
            }

            function loadSessions() {
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

            function Enrollment(emberSession, emberStudent, period) {
                this.emberSession = emberSession;
                this.emberStudent = emberStudent;
                this.period = period;
            }


            var students = loadStudents().shuffle1();
            var sessions = loadSessions();




            function enroll(sessions, students, period) {

                function freeStudent(students, sessions) {

                    for (var i = 0; i < students.length; i++) {
                        var student = students.objectAt(i)
                        if (student.proposedEnrollment === null && student.deniedEnrollments.length !== sessions.length) {
                            return student;
                        }
                    }
                    return null;
                }

                //TO-DO:
                function stillEnrolling() {
                    return true;
                }

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
                            notPreferredSessions.push(s)
                        }

                        var availableSessions = notPreferredSessions.diff(student.deniedEnrollments)

                        return availableSessions;


                    }

                    var bestSession = null;
                    var prefs = student.preferences;
                    if (prefs.length === 0) {
                        bestSession = sessions[Math.floor(Math.random() * sessions.length)]
                    } else {
                        for (var i = 0; i<prefs.length; i++) {
                            if (prefNotInDenied(prefs[i], nextStudent.deniedEnrollments)) {
                                bestSession = sessions.filter(sessionNameFilter)[0];
                            }
                        }
                    }
                    if (!bestSession) {
                        var availableSessions = availableSessions(sessions, prefs, student);
                        return availableSessions[Math.floor(Math.random() * availableSessions.length)];
                    }
                    return bestSession;
                }

                //while there is a student nextStudent who is free and hasn't attempted enrollment in every class
                var counter = 0;
                while (stillEnrolling()) {
                    
                    counter++;
                    if (counter === 80000) { break; }

                    //choose such a student(nextStudent)
                    var nextStudent = freeStudent(students, sessions);
                    var nextStudentsSession;
                    
                    if (nextStudent) {
                        //let nextStudentsSession be the highest-ranked session in nextStudents preference list to whom nextStudent has not attempted enrollment
                        nextStudentsSession = bestSessionForStudent(nextStudent, sessions);
                    } else {
                        console.log('no nextStudent :(')
                        console.log('cycles: ' + counter)
                        break;
                    }

                    if (counter % 1000 === 0) { console.log('looping' + counter); }

                    //if there is such a session and there is space in that session
                    if (nextStudentsSession && nextStudentsSession.proposedEnrollments.length < nextStudentsSession.capacity) {
                    
                        //that student attempts to enroll in that session
                        nextStudentsSession.proposedEnrollments.push(nextStudent);
                        nextStudent.proposedEnrollment = nextStudentsSession;
                        nextStudent.deniedEnrollments.push(nextStudentsSession);
                    
                    //else the session is currently full
                    } else if (nextStudentsSession) {
                        
                        //if that session prefers the next student
                        nextStudentsSession.proposedEnrollments.sort(function (a, b) {
                            return a.bumpedGrade - b.bumpedGrade;
                        });
                        if (nextStudent.bumpedGrade > nextStudentsSession.proposedEnrollments[0].bumpedGrade) {

                            var bumpedStudent = nextStudentsSession.proposedEnrollments[0];
                            bumpedStudent.proposedEnrollment = null;
                            bumpedStudent.bumpCount += 1;
                            nextStudent.proposedEnrollment = nextStudentsSession;
                            nextStudent.deniedEnrollments.push(nextStudentsSession);
                            nextStudentsSession.proposedEnrollments.shift();
                            nextStudentsSession.proposedEnrollments.push(nextStudent);
                        
                        //the session prefers its lowest enrolled member to nextStudent
                        } else {
                            nextStudent.deniedEnrollments.push(nextStudentsSession);
                        }

                    } else {
                        console.log('no nextStudentsSession :(')
                        break;
                    }


                }

                var enrollments = [];


                var totalCap = 0;
                for (var i = 0; i < sessions.length; i++) {
                    totalCap+=sessions.objectAt(i).capacity;
                }
                console.log(students.length + ' / ' + totalCap)

                for (var i = 0; i<sessions.length; i++) {
                    var s = sessions.objectAt(i);
                    for (var j = 0; j < s.proposedEnrollments.length; j++) {
                        var enrollment = new Enrollment(s.emberSession, s.proposedEnrollments[j].emberStudent, period);
                        enrollments.push(enrollment);
                    }
                }

                console.log(enrollments.length);
                console.log(enrollments);

            }

            var enrollments = enroll(sessions, students, 1);
            //console.log(enrollments);
        }
    }
});
        
            

            


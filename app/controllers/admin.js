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

                // TO-DO: check capacity of all sessions >= studentsFromModel.length 
                // (DO THIS ON MAIN ADMIN PAGE BIG WARNING)
            var outerSelf = this;
            function loadStudents() {
                
                function Student(emberStudent) {

                    
                    this.emberStudent = emberStudent;
                    this.firstname = emberStudent.get('firstname');
                    this.lastname = emberStudent.get('lastname');
                    this.grade = emberStudent.get('grade');
                    
                    //TO-DO: sorted rather than nulled array
                    this.preferences = emberStudent.get('preferences').sortBy('rank');
                    this.bumpedGrade = this.grade;
                    this.bumpcount = 0;
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
                    this.proposedEnrollments = new Array(this.capacity);
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


            var students = loadStudents();
            var sessions = loadSessions();




            function enroll(sessions, students) {


                

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

                function bestSessionForStudent (nextStudent) {

                    var bestSession = null;
                    for (var i = 0; i<nextStudent.preferences.count; i++) {
                        if (nextStudent.deniedEnrollments.contains(nextStudent.preferences[i])) {
                            bestSession=nextStudent.preferences[i];
                            break;
                        }
                    }
                    return bestSession;
                }

                //while there is a student nextStudent who is free and hasn't attempted enrollment in every class
                //choose such a student(nextStudent)

                var counter = 0;
                while (stillEnrolling()) {
                    
                    counter++;

                    var nextStudent = freeStudent(students, sessions);
                    console.log(nextStudent)
                    var nextStudentsSession;
                    if (nextStudent) {
                        //let nextStudentsSession be the highest-ranked session in nextStudents preference list to whom nextStudent has not attempted enrollment
                        nextStudentsSession = bestSessionForStudent(nextStudent);
                    } else {
                        console.log('no nextStudent :(')
                        console.log('cycles: ' + counter)
                        break;
                    }

                    // console.log(nextStudent + '-' + nextStudentsSession);
                    //if there is such a session and there is space in that session
                    if (nextStudentsSession && nextStudentsSession.proposedEnrollments < nextStudentsSession.capacity) {
                        //that student attempts to enroll in that session
                        nextStudentsSession.proposedEnrollments.push(nextStudent);
                        nextStudent.proposedEnrollment = nextStudentsSession;
                        nextStudent.deniedEnrollments.push(nextStudentsSession);
                    //else the session is currently full
                    } else if (nextStudentsSession) {
                        //if that session prefers it's lowest bumpedGrade to nextStudent's bumpedGrade nextStudent remains unenrolled
                        nextStudentsSession.proposedEnrollments.sort(function (a, b) {
                            return a.bumpedGrade - b.bumpedGrade
                        });
                        // console.log('arraysort ' + nextStudentsSession.proposedEnrollments.objectAt(0));







    //         var datingManRank = hisWoman.preferences.count
    //         var fianceRank = hisWoman.preferences.count
    //         for (rank, man) in enumerate(hisWoman.preferences) {
    //             if man == datingMan {
    //                 datingManRank = rank
    //             } else if man == hisWoman.engaged! {
    //                 fianceRank = rank
    //             }
    //         }
            
    //         datingMan.proposed.insert(hisWoman)

    //         //if w prefers m to m' they become engaged, m' becomes free
    //         if datingManRank < fianceRank {
    //             hisWoman.engaged?.engaged = nil
    //             datingMan.engaged = hisWoman
    //             hisWoman.engaged = datingMan
    //         }
    //     }


                    } else {
                        console.log('no nextStudentsSession :(')
                        break;
                    }
                }
            }

            var enrollments = enroll(sessions, students);
            console.log('enrollments: ' + ' - ' + enrollments);
        }
    }
});
        
            

            


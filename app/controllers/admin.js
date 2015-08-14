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
            
            function loadStudents() {
                
                function Student(emberStudent) {

                    function rankSortedPrefsArray(preferences) {
                        var array = preferences.sorted('rank');
                        console.log(array);
                        for (var pref in array) {
                            console.log(pref);
                        }
                        return array;
                    }
                    
                    this.emberStudent = emberStudent
                    this.firstname = emberStudent.get('firstname');
                    this.lastname = emberStudent.get('lastname');
                    this.grade = emberStudent.get('grade');
                    
                    //TO-DO: sorted rather than nulled array
                    this.preferences = rankSortedPrefsArray(preferences);
                    this.bumpedGrade = grade;
                    this.bumpcount = 0;
                    this.enrollment = null;
                    this.oldEnrollments = [];            
                }

                var students = [];
                var studentsFromModel = this.get('students');
                studentsFromModel.forEach(function (s) {
                    var newStudent = new Student(s, s.get('firstname'), s.get('lastname'), s.get('preferences'), s.get('grade'));
                    students.push(newStudent);
                });

                return students
            }

            function loadSessions() {
                function Session(emberSession) {
                    this.emberSession = emberSession;
                    this.sessionName = emberSession.get('sessionName');
                    this.capacity = emberSession.get('capacity');
                    this.proposedEnrollments = new Array(capacity);
                } 

                var sessions = [];
                var sessionsFromModel = this.get('sessions');
                sessionsFromModel.forEach(function (s) {
                    var newSession = new Session(s, s.get('sessionName'), s.get('capacity'))
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

            console.log(students);
            console.log(sessions);


            function enroll(sessions, students) {

                function freeStudent(students, sessions) {
                    for (var student in students) {
                        if (student.enrollment === null && student.oldEnrollments.length !== sessions.length) {
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
                        if (nextStudent.oldEnrollments.contains(nextStudent.preferences[i])) {
                            bestSession=nextStudent.preferences[i];
                            break;
                        }
                    }
                    return bestSession;
                }

                //while there is a man m who is free and hasn't proposed to every woman
                //choose such a man m (datingMan)
                while (stillEnrolling()) {
                    var nextStudent = freeStudent(students, sessions);
                    if (nextStudent) {
                        //let w (hisWoman) be the highest-ranked Woman in m's preference list to whom m has not proposed
                        var nextStudentsSession = bestSessionForStudent(nextStudent);
                    }
                    //if w is free
                    if (nextStudentsSession.proposedEnrollments < nextStudentsSession.capacity) {
                        //m and w become engaged
                        nextStudentsSession.proposedEnrollments.push(nextStudent);
                        nextStudent.enrollment = nextStudentsSession;
                        nextStudent.oldEnrollments.push(nextStudentsSession);
                    }
                }
            }
        }
    }
});
        
    //     if (hisWoman.engaged == nil) {
            

            
    //     //else w is currently engaged to m' (fiance)
    //     } else {
            
    //         //if w prefers m' (datingMan) to m (fiance) then m remains free
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

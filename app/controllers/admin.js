import Ember from 'ember';

export default Ember.Controller.extend({
    isAdmin: false,

    meshErrorCode: 0,

    meshIsAvailable: true,

    actions: {
        login: function () {
            Ember.$("#message").hide();
            if (Ember.$('#pw').val() === 'password') {
                this.set('isAdmin', true);                
            } else {
                Ember.$("#message").show();
            }
        },


        mesh: function () {

            var studentsFromModel;

            //TODO: check capacity of all sessions >= studentsFromModel.length

            function Student(embers, firstname, lastname, preferences, grade) {

                function sessionOrNullPrefArray(preferences) {
                    var array = [];
                    for (var i = 0; i<6;i++) {
                        var candidate = preferences.filterBy('rank', i+1);
                        if (candidate.length === 1) {
                            array.push(candidate.objectAt(0));
                        } else {
                            array.push(null);
                        }
                    }
                    return array;
                }
                this.embers = embers
                this.firstname = firstname;
                this.lastname = lastname;
                this.grade = grade;
                

                this.preferences = sessionOrNullPrefArray(preferences);
                
                this.bumpcount = 0;
                
                this.enrollments = [];
            }

            function Session(embers, sessionName, capacity) {
                this.embers = embers;
                this.sessionName = sessionName;
                this.capacity = capacity;
                this.proposedEnrollments = new Array(capacity);
                this.sessionEnrollments = [];
            }

            var students = [];
            studentsFromModel = this.get('students');
            studentsFromModel.forEach(function (s) {
                var newStudent = new Student(s, s.get('firstname'), s.get('lastname'), s.get('preferences'), s.get('grade'));
                students.push(newStudent);
            });

            var sessions = [];
            var sessionsFromModel = this.get('sessions');
            sessionsFromModel.forEach(function (s) {
                console.log(s);
                var newSession = new Session(s, s.get('sessionName'), s.get('capacity'))
                sessions.push(newSession);
            });
            console.log(sessions)



        }
    }
});
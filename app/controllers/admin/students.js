import Ember from 'ember';

export default Ember.Controller.extend({

    adminController: Ember.inject.controller('admin'),
    admin: Ember.computed.reads('adminController'),

    searchFilter: '',

    filteredStudents: Ember.computed.filter('model.students', function(student) {

        var filterString = this.get('searchFilter').toUpperCase();

        if ((student.get('firstname') === filterString) || (student.get('lastname') === filterString)) {
            return true;
        }

        if (filterString.length < 3) {
            return false; 
        }
        
        var regex = new RegExp(filterString, 'i');
        return student.get('firstname').match(regex) || student.get('lastname').match(regex);
    }).property('searchFilter', 'model.students'),

    actions: {
        processKeyUp: function(value) {
            this.set('searchFilter', value);
        },

        unlock: function(student) {
            student.set('locked', false);
            student.save();
        },

        doImport: function(importText) {
            var body = [];
            var newStudents = importText.split('\n');
            for (var i = 0; i < newStudents.length; i++) {
                var student = newStudents[i].split(',');
                var studentJson = {
                    firstName: student[0],
                    lastName: student[1],
                    grade: student[2],
                    locked: false
                };
                body.push(studentJson);
            }

            Ember.$.ajax({
                method: 'POST',
                url: 'http://localhost:51773/api/students',
                data: JSON.stringify(body)
            }).done(function(msg) {
                alert('Data Saved: ' + msg );
            });
        }
    }
}); 
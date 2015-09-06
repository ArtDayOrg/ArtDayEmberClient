import Ember from 'ember';
import AdminControllerHooks  from 'art-day/mixins/admin-controller-hooks';
import ENV from '../../config/environment';

export default Ember.Controller.extend(AdminControllerHooks, {

    searchFilter: '',    
    filteredStudents: Ember.computed.filter('model.students', function(student) {

        var filterString = this.get('searchFilter').toUpperCase();

        if ((student.get('firstName') === filterString) || (student.get('lastName') === filterString)) {
            return true;
        }

        if (filterString.length < 3) {
            return false; 
        }
        
        var regex = new RegExp(filterString, 'i');
        return student.get('firstName').match(regex) || student.get('lastName').match(regex);
    }).property('searchFilter', 'model.students', 'model.students.length'),

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
                    grade: parseInt(student[2]),
                    locked: false
                };
                body.push(studentJson);
            }
            var self = this;
            Ember.$.ajax({
                method: 'POST',
                url: ENV.APP.host + '/api/students',
                data: JSON.stringify(body)
            }).done(function(msg) {
                alert('Data Saved: ' + msg );
                self.send('refreshAdmin');
            });
        }
    }
}); 
import Ember from 'ember';
import StudentFilter from 'art-day/mixins/student-filter';

export default Ember.Controller.extend(StudentFilter, {

    isAdmin: false,
    
    searchFilter: '',

    filteredStudents: Ember.computed.filter('model', function(student) {
        var filterString = this.get('searchFilter').toUpperCase();
        if ((student.get('firstName') === filterString) || (student.get('lastName') === filterString)) {
            return true;
        }
        if (filterString.length < 3) {
            return false; 
        }    
        var regex = new RegExp(filterString, 'i');
        return student.get('firstName').match(regex) || student.get('lastName').match(regex);
    }).property('searchFilter', 'model', 'model.length'),

    actions: {
        processKeyUp: function(value) {
            this.set('searchFilter', value);
        },
        unlock: function(student) {
            student.set('locked', false);
            student.save();
        }
    }
}); 
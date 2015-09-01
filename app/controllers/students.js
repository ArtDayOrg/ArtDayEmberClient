import Ember from 'ember';
import StudentFilter from 'art-day/mixins/student-filter';

export default Ember.Controller.extend(StudentFilter, {

    isAdmin: false,
    
    searchFilter: '',

    isEnrolled: function () {
        console.log(this.get('enrollment.length'));
        return this.get('enrollment.length') > 0;
    }.property('enrollment.length'),

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
    }).property('searchFilter', 'students', 'students.length'),

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
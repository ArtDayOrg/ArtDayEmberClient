import Ember from 'ember';

export default Ember.Controller.extend({

    isAdmin: false,

    searchFilter: '',

    isEnrolled: function() {
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
        return student.get('firstName').startsWith(filterString) || student.get('lastName').startsWith(filterString);
    }).property('searchFilter', 'model.students', 'model.students.length'),

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
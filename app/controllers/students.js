import Ember from 'ember';

export default Ember.Controller.extend({

    isAdmin: false,

    searchFilter: '',

    filteredStudents: Ember.computed.filter('model.students', function(student) {

        var filterString = this.get('searchFilter').toUpperCase();

        var fullName = student.get('firstname') + ' ' + student.get('lastname');

        if ((student.get('firstname') === filterString) || (student.get('lastname') === filterString) || fullName === filterString) {
            return true;
        }

        if (filterString.length < 3) {
            return false; 
        }
        
        var regex = new RegExp(filterString, 'i');
        return student.get('firstname').match(regex) || student.get('lastname').match(regex);
    }).property('searchFilter', 'model'),

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
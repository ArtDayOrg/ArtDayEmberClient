import Ember from 'ember';

export default Ember.Controller.extend({

    isAdmin: true,

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
        }
    }
}); 
import Ember from 'ember';

export default Ember.Controller.extend({

    isAdmin: false,

    searchFilter: '',

    filteredStudents: Ember.computed.filter('model', function(student) {

        console.log('inside filtered students with filterString: ' + filterString)

        var filterString = this.get('searchFilter').toUpperCase();


        if ((student.get('firstname') === filterString) || (student.get('lastname') === filterString)) {
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
            console.log('searchFilter changed to: ' + this.searchFilter);
            console.log(this.model.objectAt(0));
        },

        unlock: function(student) {
            student.set('locked', false);
            student.save();
        }
    }

}); 
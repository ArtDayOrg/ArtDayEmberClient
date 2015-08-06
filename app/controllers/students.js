import Ember from 'ember';

export default Ember.Controller.extend({
    filteredStudents: Ember.computed.filter('model', function(student) {
        var filterString = this.get('searchFilter');
        

        //TO DO:  Chinese names have 2 characters eg: Mi Li/Xu Yi/etc.
        if (filterString.length < 3) {
            return false; 
        }
        
        var regex = new RegExp(filterString, 'i');
        return student.get('firstname').match(regex) || student.get('lastname').match(regex);
    }).property('model','searchFilter'),
    
    searchFilter: '',
    
    actions: {
        processKeyUp: function(value) {
            this.set('searchFilter', value);
        } 
    }
}); 
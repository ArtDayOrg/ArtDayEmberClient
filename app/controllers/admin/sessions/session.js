import Ember from 'ember';

export default Ember.Controller.extend({  
    isEditing: false,
    isAdding: false,

    rosters: function () {
        var rosters = [];
        var i;
        var enrollments = this.get('model.enrollments');
        var numberOfPeriods = enrollments.sortBy('period').reverse().objectAt(0).get('period');

        for (i = 1; i <= numberOfPeriods; i++) {
            var periodRoster = enrollments.filterBy('period', i);
            rosters.push(periodRoster);
        }

        return rosters;
    }.property('model.enrollments'),

    actions: {
        
        edit: function() {
            this.set('isEditing', true);
        },
        
        doneEditing: function() {
            this.set('isEditing', false);
            this.model.save();
        },

        delete: function() {
            var self = this;
            this.get('model').destroyRecord().then(function() {
                self.transitionToRoute('admin.sessions');
            }, function(err) {
                console.log(err);
            });
        },

        add: function() {
            this.set('isAdding', true);
        },

        doneAdding: function() {
            this.set('isAdding', false);
            this.model.save();
        } 
    }
}); 
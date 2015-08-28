import Ember from 'ember';

export default Ember.Controller.extend({  

    isEditing: false,
    
    isAdding: false,

    adminController: Ember.inject.controller('admin'),
    admin: Ember.computed.reads('adminController'),

    rosters: function () {
        var rosters = [];
        var i;
        var enrollment = this.get('model.enrollments');
        var numberOfPeriods = enrollment.sortBy('period').reverse().objectAt(0).get('period');
        for (i = 1; i <= numberOfPeriods; i++) {
            var periodRoster = enrollment.filterBy('period', i);
            var sortedPeriodRoster = periodRoster.sortBy('student.lastname');
            rosters.push(sortedPeriodRoster);
        }
        return rosters;
    }.property('model'),

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
                console.error(err);
            });
        },
        fileChanged: function(evt) {
            alert('file changed!');
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
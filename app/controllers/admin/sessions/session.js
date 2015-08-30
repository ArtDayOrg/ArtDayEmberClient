import Ember from 'ember';
import AdminControllerHooks  from 'art-day/mixins/admin-controller-hooks'

export default Ember.Controller.extend(AdminControllerHooks, {  

    isEditing: false,
    
    isAdding: false,

    // processes the current models enrollment and
    // returns a sorted array of alphabetized session rosters
    rosters: function () {
        var rosters = [];
        var i;
        var numberOfPeriods;
        var enrollment = this.get('admin.enrollment');
        
        if (enrollment.get('length')) {
            numberOfPeriods = enrollment.sortBy('period').reverse().objectAt(0).get('period');
        } else {
            numberOfPeriods = 0;
        }
        for (i = 1; i <= numberOfPeriods; i++) {
            var periodRoster = enrollment.filterBy('period', i);
            var sortedPeriodRoster = periodRoster.sortBy('student.lastName');
            rosters.push(sortedPeriodRoster);
        }
        return rosters;
    }.property('admin.model', 'admin.model.@each.enrollments'),

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

        add: function() {
            this.set('isAdding', true);
        },

        doneAdding: function() {
            this.set('isAdding', false);
            this.model.save();
        } 
    }
}); 
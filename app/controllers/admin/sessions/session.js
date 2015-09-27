import Ember from 'ember';
import AdminControllerHooks from 'art-day/mixins/admin-controller-hooks';

export default Ember.Controller.extend(AdminControllerHooks, {


    isEditing: false,

    isAdding: false,

    shouldRefresh: false,

    imageFile: '',

    // processes the current models enrollment and
    // returns a sorted array of alphabetized session rosters
    rosters: function() {
        var rosters = [];
        var i;
        var numberOfPeriods;
        var enrollment = this.get('model.enrollments');

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
    }.property('model', 'model.@each.enrollments'),

    modelDidChange: function() {
        this.set('isEditing', false);
        this.set('isAdding', false);
        this.set('imageData', '');
        this.set('shouldRefresh', false)
    }.observes('model'),

    actions: {

        updateImageFile: function(imageFile) {
            this.set('imageFile', imageFile);
        },

        edit: function() {
            this.set('isEditing', true);
        },

        doneEditing: function() {
            this.set('isEditing', false);
            this.model.save();
            if (this.get('imageFile')) {
                var sessionId = this.get('model.id');
                var fileName = sessionId + '.png';
                var data = new FormData();
                var self = this;
                data.append(fileName, this.get('imageFile'));
                Ember.$.ajax({
                    url: 'http://artday.azurewebsites.net/api/image',
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function(data) {
                        self.set('shouldRefresh', true);
                    }
                });
            }
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
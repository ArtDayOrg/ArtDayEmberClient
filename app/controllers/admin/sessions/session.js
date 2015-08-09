import Ember from 'ember';

export default Ember.ObjectController.extend({  
    isEditing: false,
    isAdding: false,

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
import Ember from 'ember';

export default Ember.Controller.extend({

    adminController: Ember.inject.controller('admin'),
    admin: Ember.computed.reads('adminController'),

    actions: {
        addSession: function() {
            var self = this;

            var newSessionJson = {
                sessionName: this.get('model.sessionName'),
                location: this.get('model.location'),
                capacity: this.get('model.capacity'),
                instructorName: this.get('model.instructorName'),
                imageUrl: this.get('model.imageUrl'),
                description: this.get('model.description'),
                instructions: this.get('model.instructions')
            };

            var newSession = this.store.createRecord('session', newSessionJson);
            
            newSession.save().then(function(newSession) {
                self.transitionToRoute('admin.sessions.session', newSession.id);
            }, function(err) {
                console.error(err);
                alert('Save session failed. Check the console.');                
            });
        }        
    }
});
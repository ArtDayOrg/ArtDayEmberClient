import Ember from 'ember';

export default Ember.ObjectController.extend({
    actions: {
        addSession: function() {
            var self = this;

            var newSessionJson = {
                sessionName: this.get('sessionName'),
                location: this.get('location'),
                capacity: this.get('capacity'),
                instructorName: this.get('instructorName'),
                imageUrl: this.get('imageUrl'),
                description: this.get('description')
            };

            var newSession = this.store.createRecord('session', newSessionJson);
            
            newSession.save().then(function(newSession) {
                console.log('new sessionId: ' + newSession.id);
                self.transitionToRoute('admin.sessions.session', newSession.id);
            }, function(err) {
                // handle error
                console.log(err);
                alert('Save session failed. Check the console.');                
            });
        }        
    }
});
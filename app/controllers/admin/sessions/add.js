import Ember from 'ember';
import AdminControllerHooks from 'art-day/mixins/admin-controller-hooks';

export default Ember.Controller.extend(AdminControllerHooks, {

    imageData: '',

    actions: {

        updateImageData: function(imageData) {
            this.set('imageData', imageData);
        },

        addSession: function() {
            var self = this;

            var newSessionJson = {
                sessionName: this.get('model.sessionName'),
                location: this.get('model.location'),
                capacity: this.get('model.capacity'),
                instructorName: this.get('model.instructorName'),
                description: this.get('model.description'),
                instructions: this.get('model.instructions')
            };

            var newSession = this.store.createRecord('session', newSessionJson);

            newSession.save().then(function(response) {

                // handle image upload here
                // var imageFile = self.get('imageData');
                // var sessionId = response.session.id;
                // var imageUpload = {
                //     id: sessionId
                //     image: imageFile
                // };
                // mime multipart file upload
                // .then(function (response) {
                //     transitionToRoute('admin.sessions.session', response.id);
                // }
            }, function(err) {
                console.error(err);
                alert('Save session failed. Check the console.');
            });
        }
    }
});
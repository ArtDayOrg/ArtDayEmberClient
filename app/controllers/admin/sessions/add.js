import Ember from 'ember';
import AdminControllerHooks from 'art-day/mixins/admin-controller-hooks';

export default Ember.Controller.extend(AdminControllerHooks, {

    imageFile: '',

    actions: {

        updateImageFile: function(imageFile) {
            this.set('imageFile', imageFile);
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
                var imageFile = self.get('imageFile');

                // <form style='margin-top:100px;' id='myForm' action='http://localhost:51773/api/image' method='POST'>
                //   <input type='file' id='fileInput' name='fileInput'></input>
                //   <input type='submit' formenctype='multipart/form-data'>Submit</input>
                // </form>
                var sessionId = response.id;
                var fileName = sessionId + '.png'
                var data = new FormData();
                data.append(fileName, imageFile);;
                Ember.$.ajax({
                    url: 'http://artday.azurewebsites.net/api/image',
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function(data) {
                        self.transitionToRoute('admin.sessions.session', response.id);
                    }
                });

            }, function(err) {
                console.error(err);
                alert('Save session failed. Check the console.');
            });
        }
    }
});
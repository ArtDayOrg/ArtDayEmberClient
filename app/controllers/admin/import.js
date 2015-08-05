import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        doImport: function() {
            var body = [];
            var rawText = Ember.$('#importText').val();
            var newStudents = rawText.split('\n');
            for (var i = 0; i < newStudents.length; i++) {
                var student = newStudents[i].split(',');
                var studentJson = {
                    firstName: student[0],
                    lastName: student[1],
                    grade: student[2],
                    locked: false
                };
                body.push(studentJson);
            }

            Ember.$.ajax({
                method: 'POST',
                url: 'http://localhost:51773/api/students',
                data: JSON.stringify(body)
            }).done(function(msg) {
                alert('Data Saved: ' + msg );
            });
        }
    }
});
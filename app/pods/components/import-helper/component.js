import Ember from 'ember';
import ENV from '../../../config/environment';

export default Ember.Component.extend({
  actions: {
    doImport: function() {
      var importText = Ember.$('#importText').val();
      var body = [];
      var newStudents = importText.split('\n');
      for (var i = 0; i < newStudents.length; i++) {
        var student = newStudents[i].split(',');
        var studentJson = {
          firstName: student[0],
          lastName: student[1],
          grade: parseInt(student[2]),
          locked: false
        };
        body.push(studentJson);
      }

      var self = this;
      Ember.$.ajax({
        method: 'POST',
        url: ENV.APP.host + '/api/students',
        data: JSON.stringify(body)
      }).done(function(msg) {
        alert('Data Saved: ' + msg);
        //bubbles to route 'admin'
        self.sendAction('refreshAdmin');
      });
    }
  }
});
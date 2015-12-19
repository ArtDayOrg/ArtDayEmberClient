import Ember from 'ember';
import ENV from '../../../config/environment';

export default Ember.Component.extend({

  importBegan: false,

  importSuccess: false,

  importNotSuccess: Ember.computed.not('importSuccess'),

  importProcessing: Ember.computed.and('importBegan', 'importNotSuccess'),

  lastImportCount: 0,

  actions: {
    doImport: function() {
      var importText = Ember.$('#importText').val(),
        body = [],
        newStudents = importText.split('\n'),
        self = this,
        i;

      this.set('importBegan', true);
      this.set('lastImportCount', newStudents.length);

      for (i = 0; i < newStudents.length; i++) {
        var student = newStudents[i].split(',');
        var studentJson = {
          firstName: student[0],
          lastName: student[1],
          grade: parseInt(student[2]),
          locked: false
        };
        body.push(studentJson);
      }

      Ember.$.ajax({
        method: 'POST',
        url: ENV.APP.host + '/api/students',
        data: JSON.stringify(body)
      }).done(function() {
        self.set('importSuccess', true);
        self.set('importBegan', false);
        Ember.$('#importText').val('');
        //automatically bubbles to route 'admin'
        self.sendAction('refreshAdmin');
      });
    }
  }
});
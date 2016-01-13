import Ember from 'ember';

export default Ember.Mixin.create({

  schedule: function() {
    var sessionsArray = ['Period 1', 'Period 2', 'Period 3'];
    var locationsArray = ['', '', ''];
    var item = this.get('item');
    var self = this;
    if (item) {
      item.get('enrollments').forEach(function(enrollment) {
        if (enrollment.get('session.sessionName') && enrollment.get('period') && enrollment.get('session.location')) {
          var sessionString = enrollment.get('session.sessionName');
          var locationString = enrollment.get('session.location');
          var index = enrollment.get('period') - 1;
          sessionsArray[index] = sessionString;
          locationsArray[index] = locationString;
          self.set('locations', true);
        }
      });
    }

    var schedule = [
      ['7:30 AM', '7:35 AM', 'Homeroom', 'Homeroom'],
      ['7:40 AM', '9:05 AM', sessionsArray[0], locationsArray[0]],
      ['9:10 AM', '10:35 AM', sessionsArray[1], locationsArray[1]],
      ['10:40 AM', '11:40 AM', 'Assembly', 'Lyceum'],
      ['11:50 AM', '12:20 PM', 'Lunch', 'Lyceum'],
      ['12:30 PM', '2:05 PM', sessionsArray[2], locationsArray[2]]
    ];

    return schedule;

  }.property('item', 'item.enrollments.@each.period', 'item.enrollments.@each.session.sessionName', 'item.enrollments.@each.session.location'),

});
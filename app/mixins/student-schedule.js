import Ember from 'ember';

export default Ember.Mixin.create({

  schedule: function () {
    var sessionsArray = ['Period 1', 'Period 2', 'Period 3'];
    var locationsArray = ['', '', ''];
    var item = this.get('item');
    var self = this;
    if (item) {
      item.get('enrollments').forEach(function (enrollment) {
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
    ['8:00AM', '9:30AM', sessionsArray[0], locationsArray[0]],
    ['9:40AM', '11:10AM', sessionsArray[1], locationsArray[1]],
    ['11:20AM', '12:15PM', 'Lunch', 'Cafeteria'],
    ['12:25PM', '1:15PM', 'Assembly', 'Gym'],
    ['1:30PM', '3:00PM', sessionsArray[2], locationsArray[2]]
    ];

    return schedule;

  }.property('item', 'item.enrollments.@each.period', 'item.enrollments.@each.session.sessionName', 'item.enrollments.@each.session.location'),

});

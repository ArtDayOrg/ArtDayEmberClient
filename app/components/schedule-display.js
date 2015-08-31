import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['schedule'],

  schedule: function () {
    var sessionsArray = ['Period 1', 'Period 2', 'Period 3'];
    var item = this.get('item');
    console.log('item');
    console.log(item);
    if (item) {
      item.get('enrollments').forEach(function (enrollment) {
        if (enrollment.get('session.sessionName') && enrollment.get('period')) {
          var sessionString = enrollment.get('session.sessionName') + ' ' + enrollment.get('session.location');
          console.log(enrollment.get('period'));
          sessionsArray[enrollment.get('period')-1] = sessionString;
          console.log(sessionsArray)
        }
      });
    }

    var schedule = [
    ['8:00AM', '9:30AM', sessionsArray[0]],
    ['9:40AM', '11:10AM', sessionsArray[1]],
    ['11:20AM', '12:15PM', 'Lunch'],
    ['12:25PM', '1:15PM', 'Assembly'],
    ['1:30PM', '3:00PM', sessionsArray[2]]
    ]

    return schedule;

  }.property('item', 'item.enrollments.@each.period', 'item.enrollments.@each.session.sessionName')

});

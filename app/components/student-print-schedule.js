import Ember from 'ember';
import StudentSchedule from 'art-day/mixins/student-schedule';

export default Ember.Component.extend(StudentSchedule, {

  classNames: ['printable'],

});

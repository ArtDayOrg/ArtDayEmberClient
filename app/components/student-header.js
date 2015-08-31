import Ember from 'ember';
import StudentSchedule from 'art-day/mixins/student-schedule';

export default Ember.Component.extend(StudentSchedule, {
	classNames: ['student'],

  locations: true,

  actions: {
    lockPrefs: function () {
      this.sendAction('lockPrefs');
    },

    printSchedule: function () {
      console.log('printSchedule')
      var scheduleContent = document.getElementsByClassName('printable')[0];
      var printWindow = window.open('', 'ICS Art Day', 'left=300,top=100,width=595,height=841');
      printWindow.document.write('<html><head><title>ICS Art Day</title>');
      printWindow.document.write('<link rel="stylesheet" href="assets/vendor.css" type="text/css">');
      printWindow.document.write('<link rel="stylesheet" href="assets/art-day.css" type="text/css">');
      printWindow.document.write('</head><body>');
      printWindow.document.write(scheduleContent.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
    }
  }
});

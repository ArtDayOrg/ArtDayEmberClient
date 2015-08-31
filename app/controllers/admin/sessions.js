import Ember from 'ember';
import AdminControllerHooks  from 'art-day/mixins/admin-controller-hooks'

export default Ember.Controller.extend(AdminControllerHooks, {

	sessionsPrint: function () {
		
		var sessions = this.get('admin.sessions');
		console.log(sessions);
		var sessionsPrint = [];

		sessions.forEach(function (s) {
			
			var rosters = [];
        	var i;
        	var numberOfPeriods;
        	var enrollment = s.get('enrollments');

        	//guard against crash if enrollments are set but a session has 0 enrollments
        	if (enrollment.get('length')) {
		        numberOfPeriods = enrollment.sortBy('period').reverse().objectAt(0).get('period');
		    } else {
		    	numberOfPeriods = 0;
		    }

    	    for (i = 1; i <= numberOfPeriods; i++) {
        	    var periodRoster = enrollment.filterBy('period', i);
            	var sortedPeriodRoster = periodRoster.sortBy('student.lastName');
            	rosters.push(sortedPeriodRoster);
        	}

			var sessionPrint = {
				sessionName: s.get('sessionName'),
				sessionInstructor: s.get('instructorName'),
				sessionLocation: s.get('location'),
				sessionRosters: rosters
			};
			
			sessionsPrint.push(sessionPrint);
		
		});
		
		return sessionsPrint;

	}.property('admin.enrollments.length'),

	actions: {
		printRosters: function () {
			var rosterContent = document.getElementsByClassName('printable')[0];
	        var printWindow = window.open('', 'ICS Art Day', 'left=300,top=100,width=595,height=841');
			printWindow.document.write('<html><head><title>ICS Art Day</title>');
        	printWindow.document.write('<link rel="stylesheet" href="assets/vendor.css" type="text/css">');
        	printWindow.document.write('<link rel="stylesheet" href="assets/art-day.css" type="text/css">');
        	printWindow.document.write('</head><body>');
        	printWindow.document.write(rosterContent.innerHTML);
	        printWindow.document.write('</body></html>');
	        printWindow.document.close();
	        printWindow.focus();
	    }
	}
});

import Ember from 'ember';

export default Ember.Component.extend({

	classNames: ['student-selector'],

	actions: {
		processKeyUp: function (value) {
			this.sendAction('processKeyUp', value);
		}, 

		unlock: function (student) {
			this.sendAction('unlock', student);
		}
	}
});

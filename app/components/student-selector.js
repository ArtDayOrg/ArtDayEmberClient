import Ember from 'ember';

export default Ember.Component.extend({

	actions: {
		processKeyUp: function (value) {
			console.log('sending processKeyUp action with value: ' + value);
			this.sendAction('processKeyUp', value);
		}, 

		unlock: function (student) {
			this.sendAction('unlock', student);
		}
	}
});

import Ember from 'ember';

export default Ember.Component.extend({

	actions: {
		enroll: function () {
			this.sendAction('enroll');
		}
	}
});

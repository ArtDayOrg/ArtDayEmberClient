import Ember from 'ember';

export default Ember.Component.extend({

	classNames: ['instructions', 'admin-instructions'],

	actions: {
		enroll: function () {
			this.sendAction('enroll');
		}
	}
});
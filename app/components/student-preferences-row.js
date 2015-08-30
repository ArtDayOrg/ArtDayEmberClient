import Ember from 'ember';

export default Ember.Component.extend({

	actions: {
		changeDescription: function (description, sessionName) {
			this.sendAction('changeDescription', description, sessionName);
		},
		sessionDropped: function (session, ops) {
			this.sendAction('sessionDropped', session, ops);
		}
	}
});

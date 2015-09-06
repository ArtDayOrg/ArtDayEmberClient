import Ember from 'ember';

export default Ember.Component.extend({

	index: 0,

	classNames: ['pref-tile'],

	//off by one fix from index of @each
	rank: function () {
		return this.get('index')+1;
	}.property('index'),

	actions: {
		sessionDropped: function (session, ops) {
			this.sendAction("sessionDropped", session, ops);
		},

		changeDescription: function (description, sessionName) {
			this.sendAction('changeDescription', description, sessionName);
		}
	}
});
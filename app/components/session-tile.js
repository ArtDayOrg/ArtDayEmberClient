import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['session-tile'],

	click: function () {
		this.sendAction('changeDescription', this.get('description'), this.get('sessionName'));
	}
});
import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['session-detail', 'session-pane', 'instructions'],

	actions: {
		isAdding: function () {
			this.sendAction('isAdding');
		}, 
		isEditing: function () {
			this.sendAction('isEditing');
		},
		edit: function () {
			this.sendAction('edit');
		},
		delete: function () {
			this.sendAction('delete');
		}
	}
});

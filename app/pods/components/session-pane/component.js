import Ember from 'ember';
import ImagePath from 'art-day/mixins/image-path';

export default Ember.Component.extend(ImagePath, {
	classNames: ['session-detail', 'session-pane', 'instructions'],


	actions: {
		isAdding: function() {
			this.sendAction('isAdding');
		},
		isEditing: function() {
			this.sendAction('isEditing');
		},
		edit: function() {
			this.sendAction('edit');
		},
		delete: function() {
			this.sendAction('delete');
		}
	}
});
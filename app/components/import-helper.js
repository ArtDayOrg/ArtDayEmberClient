import Ember from 'ember';

export default Ember.Component.extend({
	
	actions: {
		doImport: function() {
			var importText = Ember.$('#importText').val();
			this.sendAction('doImport', importText);
		}
	}
});

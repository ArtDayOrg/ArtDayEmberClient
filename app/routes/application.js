import Ember from 'ember';

export default Ember.Route.extend({
	//TO DO this should return, remove this.store.findAll('session') from other models?  ask joe?
	model: function() {
		this.store.findAll('session');
	}
});

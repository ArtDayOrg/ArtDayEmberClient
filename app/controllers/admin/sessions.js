import Ember from 'ember';

export default Ember.Controller.extend({

	adminController: Ember.inject.controller('admin'),
	admin: Ember.computed.reads('adminController')

});

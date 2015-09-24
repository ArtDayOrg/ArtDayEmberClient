import Ember from 'ember';

export default Ember.Component.extend({

	index: 0,

	//off by one fix from index
	period: Ember.computed('index', function () {
		return this.get('index')+1;
	})
});

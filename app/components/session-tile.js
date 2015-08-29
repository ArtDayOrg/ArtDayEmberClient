import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['session-tile'],

	imagePath: function () {
		var id = this.get('item.id');
		var imagePath = 'assets/images/' + id + '.png';
		return imagePath;
	}.property('item'),

	click: function () {
		this.sendAction('changeDescription', this.get('item.description'), this.get('item.sessionName'));
	}
});
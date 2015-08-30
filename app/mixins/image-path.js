import Ember from 'ember';

export default Ember.Mixin.create({
	imagePath: function () {
		var id = this.get('item.id');
		var imagePath = 'assets/images/' + id + '.png';
		return imagePath;
	}.property('item')
});

import Ember from 'ember';

export default Ember.Mixin.create({
  imagePath: function() {
    var id = this.get('item.id');
    if (id) {
      var imagePath = 'http://artday.blob.core.windows.net/images/' + id + '.png';
      return imagePath;
    } else {
      return 'assets/images/undefined.png';
    }
  }.property('item')
});
import Ember from 'ember';

export default Ember.Mixin.create({
  imagePath: function() {
    var id = this.get('item.id');
    if (id) {
      var imagePath = 'http://artday.blob.core.windows.net/images/' + id + '.png?timestamp=' + new Date().getTime();
      return imagePath;
    } else {
      return 'assets/images/undefined.png';
    }
  }.property('item', 'imageShouldRefresh')
});
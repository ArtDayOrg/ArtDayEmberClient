import Ember from 'ember';
import ImagePath from 'art-day/mixins/image-path';

export default Ember.Component.extend(ImagePath, {

  imageData: '',

  imageUrl: function() {
    if (this.get('imageData') !== '') {
      return 'data:image/png;base64,' + this.get('imageData');
    } else if (this.get('imageExists')) {
      return this.get('imagePath');
    } else {
      return 'assets/images/undefined.png';
    }
  }.property('imageExists', 'imagePath', 'imageData'),

  imageExists: function() {
    if (this.get('imagePath') === 'assets/images/undefined.png' && this.get('imageData') === '') {
      return false;
    } else {
      return true;
    }
  }.property('item', 'item.id', 'imageData'),

  actions: {
    updateImageData: function(imageData) {
      console.log('sending image data from session form')
      this.set('imageData', imageData);
      this.sendAction('updateImageData', imageData);
    }
  }

});
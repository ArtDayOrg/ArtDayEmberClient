import Ember from 'ember';
import ImagePath from 'art-day/mixins/image-path';

export default Ember.Component.extend(ImagePath, {


  imageExists: function () {
    if (this.get('imagePath') === 'assets/images/undefined.png') {
      return false;
    } else {
      return true;
    }
  }.property('item', 'item.id'),

  actions: {
    updateImageData: function (imageData) {
      console.log('sending image data from session form')
      this.sendAction('updateImageData', imageData);
    }
  }

});

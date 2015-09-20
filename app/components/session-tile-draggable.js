import Ember from 'ember';
import ImagePath from 'art-day/mixins/image-path';

export default Ember.Component.extend(ImagePath, {

  //the draggable session tile needs to be able to turn transparent on drag.  
  //when the user drags, they create a visible ghost of the tile.
  //by setting the tile image to be trasparent pixel of the same size as the image
  //the ghost is the only visible tile.  Thus, the user feels like they are moving the tile
  //while the experience with a ghost and a visible tile would be awkward.  
  isTransparent: false,
  transparentUrl: "assets/images/transparent.png",

  imageUrl: function() {
    return this.get('isTransparent') ? this.get('transparentUrl') : this.get('imagePath');
  }.property('imagePath', 'isTransparent'),

  drag: function() {
    this.set('isTransparent', true);
  },

  dragEnd: function() {
    this.set('isTransparent', false);
  },

  drop: function() {
    this.set('isTransparent', false);
  },

  actions: {
    changeDescription: function(description, sessionName) {
      this.sendAction('changeDescription', description, sessionName);
    }
  }

});
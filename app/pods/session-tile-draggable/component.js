import Ember from 'ember';
import ImagePath from 'art-day/mixins/image-path';

export default Ember.Component.extend(ImagePath, {

  /*
   * A draggable session tile needs to be able to turn itself invisible.  
   * On dragStart, a ghost is created.  On drag, we set isTransparent to true
   * this hides the text and sets the image of the non ghost to a tranparent pixel
   * while preserving these on the ghost.
   *
   * in this way, the dragging of the tile becomes the animation for that tile while
   * liquid-fire handles the rest of the animation.
   */

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